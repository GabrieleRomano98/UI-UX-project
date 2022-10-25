"use strict";

const express = require("express");
const morgan = require("morgan"); // logging middleware
const passport = require("passport");
const { check, validationResult, body } = require("express-validator"); // validation middleware
const LocalStrategy = require("passport-local").Strategy; // username+psw
const session = require("express-session");
const dayjs = require("dayjs");
const path = require('path');

const userDao = require("./dao/user-dao");
const mainDao = require("./dao/main-dao");

console.log("Hello world")

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(
  new LocalStrategy(function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });

      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao
    .getUserById(id)
    .then((user) => {
      done(null, user); // req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

// init express
const app = express();
const port = process.env.PORT || 3002;

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "Not authenticated!" });
};

// enable sessions in Express
app.use(
  session({
    // set up here express-session
    secret: "ajs5sd6f5sd6fiufadds8f9865d6fsgeifgefleids89fwu",
    resave: false,
    saveUninitialized: false
  })
);

// init Passport to use sessions
app.use(passport.initialize());
app.use(passport.session());


/*****************/
/*** MAIN APIs ***/
/*****************/

// GET /api/tournament
app.get('/api/tournament', (req, res) => {
  mainDao.listTournament()
    .then(tournament => res.json(tournament))
    .catch(() => res.status(500).end());
});

// GET /api/tournament/joined
app.get('/api/tournament/joined', (req, res) => {
  mainDao.listJoinedTour(1/*req.user.id*/)
    .then(tournament => res.json(tournament))
    .catch(() => res.status(500).end());
});

// POST /api/tournament/join
app.post('/api/tournament/join/:id', (req, res) => {
  console.log("Fetch received ")
  mainDao.joinTournament(req.params.id, 1/*req.user.id*/)
    .then(() => res.status(200).end())
    .catch((err) => res.status(500).json(err));
});

// DELETE /api/tournament/joined/:id
app.delete('/api/tournament/joined/:id', (req, res) => {
  mainDao.deleteEnrollment(req.params.id, 1/*req.user.id*/)
    .then(tournament => res.json(tournament))
    .catch(() => res.status(500).end());
});

// GET /api/announcements
app.get('/api/announcements', (req, res) => {
  mainDao.getAnnouncements()
    .then(announces => res.json(announces))
    .catch(() => res.status(500).end());
});

// PUT /api/announcements/:id
app.put('/api/announcements/:id', (req, res) => {
  mainDao.readAnnounce(req.params.id)
    .then(() => res.status(200).end())
    .catch((err) => res.status(500).json(err));
});

// GET /api/running
app.get('/api/running', (req, res) => {
  mainDao.getRunning(1/*req.user.params*/)
    .then(running => res.json(running))
    .catch(() => res.status(500).end());
});

// GET /api/standings/:id
app.get('/api/standings/:id', (req, res) => {
  mainDao.getStandings(req.params.id)
    .then(standings => res.json(standings))
    .catch(() => res.status(500).end());
});

// GET /api/turns/:id
app.get('/api/turns/:id', (req, res) => {
  mainDao.getTurns(/*req.user.id*/1, req.params.id)
    .then(standings => res.json(standings))
    .catch(() => res.status(500).end());
});

// PUT /api/result/:id
app.put('/api/result/:id', (req, res) => {
  mainDao.updateResult(/*req.user.id*/1, req.params.id, req.body.result, req.body.turn)
    .then(() => res.status(200).end())
    .catch((err) => res.status(500).json(err));
});

// POST /api/chat
app.post('/api/chat', (req, res) => {
  mainDao.newChat(/*req.user.id*/1, req.body.tournament, req.body.message, req.body.object)
    .then(() => res.status(200).end())
    .catch((err) => res.status(500).json(err));
});

// POST /api/chat/id
app.post('/api/chat/:id', (req, res) => {
  mainDao.newMessage(/*req.user.id*/1, req.params.id, req.body.message)
    .then(() => res.status(200).end())
    .catch((err) => res.status(500).json(err));
});

// PUT /api/chat/id
app.put('/api/chat/:id', (req, res) => {
  mainDao.readMessage(req.params.id, /*req.user.id*/1)
    .then(() => res.status(200).end())
    .catch((err) => res.status(500).json(err));
});

// DELETE /api/chat/id
app.delete('/api/chat/:id', (req, res) => {
  mainDao.deleteChat(req.params.id)
    .then(() => res.status(200).end())
    .catch((err) => res.status(500).json(err));
});

// GET /api/chat
app.get('/api/chat', (req, res) => {
  mainDao.getChats(/*req.user.id*/1)
    .then(chats => res.json(chats))
    .catch(() => res.status(500).end());
});

// GET /api/chat/:id
app.get('/api/chat/:id', (req, res) => {
  mainDao.getMessages(req.params.id)
    .then(messages => res.json(messages))
    .catch(() => res.status(500).end());
});

// PUT /api/forfeit/id
app.put('/api/forfeit/:id', (req, res) => {
  mainDao.forfeit(req.params.id, /*req.user.id*/1)
    .then(() => res.status(200).end())
    .catch((err) => res.status(500).json(err));
});

/*****************/
/*** USER APIs ***/
/*****************/

// Login --> POST /sessions
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// Logout --> DELETE /sessions/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get("/api/sessions/current", isLoggedIn, (req, res) => {
  res.status(200).json(req.user);
});

app.get("/api/user/:id", (req, res) => {
  try {
    userDao
      .getUserById(req.params.id)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(503).json({});
      });
  } catch (err) {
    res.status(500).json(false);
  }
});

// POST /api/newUser
app.post(
  "/api/newUser",
  [
    body("email").isEmail(),
    body("password").isString(),
    body("name").isString(),
    body("surname").isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await userDao.addUser(req.body);
      res.status(201).end();
    } catch (err) {
      res.status(503).json({ error: err });
    }
  }
);


/**** Proxy request to the front-end *****/

app.get('*', (req, res) => {
  res.sendFile(path.join('./client', 'build', 'index.html'));
});

/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`react-score-server-mini listening at http://localhost:${port}`);
});
