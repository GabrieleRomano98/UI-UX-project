import { React, useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import Running from "./Running/Running";
import NavbarTogglerMenu from './NavbarTogglerMenu';
import HomePage from "./HomePage";
import MyTabs from "./Tabs";
import Profile from "./Profile"
import Announcements from "./Announcements";
import About from "./About"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import API from "./API";
import Support from "./issue/Issues";
import Chat from "./issue/Chat";
import { JoinList } from "./JoinEnroll/JoinList";
import Enrollments from "./Enrollments";

const App = () => {
  const [message, setMessage] = useState('');
  const [message1, setMessage1] = useState('');
  const [message2, setMessage2] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [joining, setJoining] = useState(false);

  const [tournamentList, setTournamentList] = useState([]);
  const [dirty, setDirty] = useState(true);

  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (dirty) {
      API.getTournament()
        .then(tournament => {
          setTournamentList(tournament);
          setDirty(false);
          setDeleting(false);
          setJoining(false);
        })
        .catch(e => handleErrors(e));
    }
  }, [dirty])

  const handleErrors = (err) => {
    //setMessage(err)
  }

  const routes = [
    {path: '/join', render: () => <>
      <MyTabs aKey={'/join'} />
      <JoinList 
        tournamentList={tournamentList.filter(t => !t.Enrolled && !t.Running)} 
        joinedList={tournamentList.filter(t => !!t.Enrolled)} 
        setDirty={setDirty}
        message={message1} setMessage={setMessage1}
        joining={joining} setJoining={setJoining}
      /></>
    },
    {path: '/enrollments', render: () => <>
      <MyTabs aKey={'/enrollments'} />
      <Enrollments 
        tournamentList={tournamentList.filter(t => !!t.Enrolled)}
        deleting={deleting} setDeleting={setDeleting} 
        dirty={dirty} setUpdate={setDirty} 
        message={message2} setMessage={setMessage2}
      /></>
    },
    {path: '/Running', render: () => <>
      <MyTabs aKey={'/running'} />
      <Running setMessage={setMessage} setDirty={setDirty}/></>
    },
    {path: '/profile', render: () => <Profile/>},
    {path: '/announce', render: () => <Announcements unread={unread} setUnread={(c) => setUnread(c)} />},
    {path: '/about', render: () => <About/>},
    {path: '/support/:id', render: props => <Chat id = {props.match.params.id} />},
    {path: '/support', render: () => <Support/>},
    {path: '/', render: () => <HomePage running={tournamentList.find(t => t.Running && t.Enrolled)}/>}
  ]

  const BaseRoute = props => <Route exact path={props.path} render={props.render} />

  return (<div className="min-vh-100">
  <Router>
    <NavbarTogglerMenu unread={unread} setUnread={c => setUnread(c)} />
    {message && <Alert variant="danger" onClose={() => setMessage('')} dismissible>{message}</Alert>}
    <Switch>
      {routes.map(r => <BaseRoute path={r.path} render={r.render} />)}
    </Switch>
  </Router>
</div>);
};

export default App;
