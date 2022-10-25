import userAPI from "./api/user.js";
const BASEURL = '/api';

function getJson(httpResponsePromise) {
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // always return {} from server, never null or non json, otherwise it will fail
          response
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject({ error: "Cannot parse server response" }));
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => reject(obj)) // error msg in the response body
            .catch((err) => reject({ error: "Cannot parse server response" })); // something else
        }
      })
      .catch((err) => reject({ error: "Cannot communicate" })); // connection error
  });
}


/***** API Tournament Management *****/

const getTournament = async () => {
  return getJson(fetch(BASEURL + '/tournament')
  ).then(json => {
    return json.map((tournament) => Object.assign({}, tournament))
  })
}

const getJoinedTour = async () => {
  return getJson(fetch(BASEURL + '/tournament/joined')
  ).then(json => {
    return json.map((tournament) => Object.assign({}, tournament))
  });
}

const joinTournament = async (tour) => {
  console.log("Fetching '/tournament/join/'" + tour)
  const response = await fetch(
    BASEURL + '/tournament/join/' + tour, 
    { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json'}});
  return response;
}

const cancelEnrollment = async (id) => {
  const response = await fetch(BASEURL + '/tournament/joined/' + id, {method: 'DELETE'});
  return response;
}


/***** API Announcements Management *****/

const getAnnounces = async () => {
  return getJson(fetch(BASEURL + '/announcements')
  ).then(json => {
    return json.map((announce) => Object.assign({}, announce))
  })
}

const readAnnounce = async (id) => {
  const response = await fetch(BASEURL + '/announcements/' + id, {method: 'PUT'})
  return response;
}


/***** API Running tournament *****/

async function getRunning() {
	const response = await fetch(BASEURL + '/running');
	const running = await response.json();
	if (response.ok) {
		return running;
	}
	else throw running;
}

async function getStandings(tournament) {
	const response = await fetch(BASEURL + '/standings/' + tournament);
	const standings = await response.json();
	if (response.ok) {
		return standings;
	}
	else throw standings;
}

async function getTurns(tournament) {
	const response = await fetch(BASEURL + '/turns/' + tournament);
	const turns = await response.json();
	if (response.ok) {
		return turns;
	}
	else throw turns;
}

const putResult = async (tournament, result, turn) => {
  const response = await fetch(BASEURL + '/result/' + tournament, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'result': result, 'turn': turn})
  });
  return response;
}

const openIssue = async (tournament, message, object) => {
  const response = await fetch(BASEURL + '/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'tournament': tournament, 'message': message, 'object': JSON.stringify(object)})
  });
  return response;
}

const sendMessage = async (id, message) => {
  const response = await fetch(BASEURL + '/chat/' + id, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'message': message})
  });
  return response;
}

const readMessages = async id => {
  const response = await fetch(BASEURL + '/chat/' + id, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'}
  });
  return response;
}

const deleteChat = async id => {
  const response = await fetch(BASEURL + '/chat/' + id, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'}
  });
  return response;
}

const getChats = async () => {
  const response = await fetch(BASEURL + '/chat');
	const chats = await response.json();
	if (response.ok) {
		return chats;
	}
	else throw chats;
}

const getMessages = async id => {
  const response = await fetch(BASEURL + '/chat/' + id);
	const messages = await response.json();
	if (response.ok) {
		return messages;
	}
	else throw messages;
}

const forfeit  = async id => {
  const response = await fetch(BASEURL + '/forfeit/' + id, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'}
  });
  return response;
}


const API = { 
  ...userAPI, 
  getTournament, 
  joinTournament, 
  getJoinedTour, 
  cancelEnrollment, 
  getAnnounces, 
  readAnnounce,
  getRunning,
  getStandings,
  getTurns,
  putResult,
  openIssue,
  sendMessage,
  readMessages,
  deleteChat,
  getChats,
  getMessages,
  forfeit
};

export default API;
