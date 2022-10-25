"use strict";
const dayjs = require("dayjs");
/* Data Access Object (DAO) module for accessing users */

const db = require("../db");

// get all tournaments
exports.listTournament = () => {
  return new Promise((resolve, reject) => {
    const sql = 
      'SELECT t.id, t.Name, Date, Time, Place, Type, Description, u.Name || " " || u.Surname AS Organizer, Running, ' +
      't.id IN (SELECT forID FROM Announcements) AS Announcements, ' +
      't.id IN (SELECT tournament FROM Enrollments WHERE user = ? AND forfeit = 0) AS Enrolled ' +
      ' FROM Tournament t, Users u WHERE organizer = u.id';
    db.all(sql, [1], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const tournament = rows.map((e) => {
        return Object.assign({}, e)
      });
      resolve(tournament);
    });
  });
};

// get all joined tournaments
exports.listJoinedTour = (user) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Tournament, Enrollments WHERE id = tournament AND user = ? AND forfeit = 0';
    db.all(sql, [user], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const tournament = rows.map((e) => {
        return Object.assign({}, e)
      });
      resolve(tournament);
    });
  });
};

exports.joinTournament = (tournament, user) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Enrollments VALUES(?,?,?)'; /*VALUES(?,?,0)*/ 
    db.run(sql, [user, tournament, 0], err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

exports.deleteEnrollment = (tournament, id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Enrollments WHERE tournament = ? AND user = ?';
    db.run(sql, [tournament, id], err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

// get all announcements
exports.getAnnouncements = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Announcements';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const announces = rows.map(a => {
        return Object.assign({}, a)
      });
      resolve(announces);
    });
  });
};

// read an announce
exports.readAnnounce = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Announcements SET read=1 WHERE id=?';
    db.run(sql, [id], err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

exports.getRunning = user => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Tournament WHERE Running = 1 AND ? IN (SELECT user FROM Enrollments WHERE tournament = id AND NOT forfeit)";
    db.all(sql, [user], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows[0]);
    });
  });
}

exports.getStandings = tournament => {
  return new Promise((resolve, reject) => {
    const sql = 
      "SELECT u.id, u.Name || ' ' || u.Surname AS Player, "
      + "(SELECT COUNT(*) FROM Turns t1 WHERE t1.tournament = t.tournament AND (t1.id_white = u.id AND t1.result = 1 OR t1.id_black = u.id AND t1.result = 2)) + "
      + "0.5*(SELECT COUNT(*) FROM Turns t1 WHERE t1.tournament = t.tournament AND (t1.id_white = u.id OR t1.id_black = u.id) AND t1.Result = 3 ) AS Score "
      + "FROM Turns t, users u, Enrollments e "
      + "WHERE t.tournament = ? AND t.tournament = e.tournament AND u.id = e.user AND t.Done = 1 "
      + "GROUP BY u.id ORDER BY Score DESC";
    db.all(sql, [tournament], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows.map((r, i) => ({id: r.id, Position: i + 1, Player: r.Player, Score: r.Score})));
    });
  });
}

exports.getTurns = (user, tournament) => {
  return new Promise((resolve, reject) => {
    const sql = 
      "SELECT Number AS N, Board, "
      + "(SELECT Name || ' ' || Surname FROM users WHERE id_white = id AND id_black = ? OR id_black = id AND id_white = ?) AS Opponent, "
      + "IFNULL((SELECT 'White' FROM Turns WHERE id_white = ? AND Number = t.Number), 'Black') AS Color, "
      + "Result FROM Turns t WHERE tournament = ? AND (id_black = ? OR id_white = ?)";
    db.all(sql, [user, user, user, tournament, user, user], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

exports.updateResult = (user, tournament, result, turn) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE Turns SET Result = ?, Done = 1 WHERE Tournament = ? AND Number = ? AND (id_black = ? OR id_white = ?)";
    db.run(sql, [result, tournament, turn, user, user], err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
}

exports.newChat = (user, tournament, message, object) => {
  return new Promise((resolve, reject) => {
    const sql = 
      "INSERT INTO Chats(id, user, tournament, message, object, read, timestamp) " + 
      "VALUES(IFNULL((select MAX(id)+1 from Chats), 1), ?, ?, ?, ?, 0, ?)";
    db.run(sql, [user, tournament, message, object, dayjs().valueOf()], err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
}

exports.newMessage = (user, id, message) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO Chats(user, id, message, read, timestamp) VALUES(?, ?, ?, 0, ?)";
    db.run(sql, [user, id, message, dayjs().valueOf()], err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
}

exports.readMessage = (id, user) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE Chats SET read = 1 WHERE id = ? AND user != ?";
    db.run(sql, [id, user], err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
}

exports.deleteChat = id => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Chats WHERE id = ?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

exports.getChats = user => {
  return new Promise((resolve, reject) => {
    const sql = 
      "SELECT c.id, Name, object, 0 IN (SELECT read FROM Chats WHERE user != ? AND id = c.id) AS unread " + 
      "FROM Chats c, Tournament t WHERE c.user = ? AND t.id = c.tournament AND object IS NOT NULL";
    db.all(sql, [user, user], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

exports.getMessages = id => {
  return new Promise((resolve, reject) => {
    const sql = 
      "SELECT id, (SELECT Name FROM Tournament t, Chats c1 WHERE c.id = c1.id AND t.id = c1.tournament) AS Name, message, " + 
      "(SELECT object FROM Chats WHERE id = ?) AS object, user, timestamp FROM Chats c WHERE id = ?";
    db.all(sql, [id, id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if(!rows[0])
        resolve(rows);
      else resolve({
        id: rows[0].id,
        Name: rows[0].Name,
        object: rows[0].object,
        messages: rows.map(r => ({message: r.message, user: r.user, timestamp: r.timestamp}))
      });
    });
  });
}

exports.forfeit = (id, user) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE Enrollments SET forfeit = 1 WHERE tournament = ? AND user = ?";
    db.run(sql, [id, user], err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
}/*
exports.forfeit = ()  => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Tournament WHERE Running = 1";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}*/