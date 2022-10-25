//React
import { useState, useEffect } from "react";
import { Container, Row, Col, Accordion, Card, Button, Alert, Spinner, Badge } from "react-bootstrap";
//My components
import { ResultModal, RefreeModal, ForfeitModal } from "./ResultModal";
import { TableBase } from "./BaseElements";
//Icons
import { MdOutlineEdit } from "react-icons/md";
import { GiTrophyCup } from "react-icons/gi";
import { RiCalendar2Fill } from "react-icons/ri";
import { MdPlace, MdOutlineTextsms } from "react-icons/md";
import { MdOutlineAddCircle } from "react-icons/md";
import { BiHelpCircle } from "react-icons/bi";
import { FiClock } from "react-icons/fi";
import { FcExpand } from 'react-icons/fc';
import { BsFlagFill } from 'react-icons/bs';
import { MdCircleNotifications } from "react-icons/md";

import API from "../API";
import SupportModal from "../SupportModal";
import { useHistory } from "react-router-dom";

function Running(props) {
	const [loading, setLoading] = useState(true);
	const [tournament, setTournament] = useState(false);
	const [turns, setTurns] = useState(false);
	const [standings, setStandings] = useState(false);
	const [message, setMessage] = useState(false);
	const [show, setShow] = useState(false);
	const [showSupport, setShowSupport] = useState(false);
	const [dirty, setDirty] = useState(false);
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
	const [announces, setAnnounces] = useState([]);
	
	const history = useHistory();
	
	const forfeit = () => {
		history.push('./');
		props.setMessage("You retired from the tournament");
		props.setDirty(true);
	}

	const currentResult = result => {
		return dirty ? <Spinner animation="border" size="sm" /> : <>
			<u style={{ color: "blue" }} onClick={() => setShow(true)}>
				{!result ? <MdOutlineAddCircle/> : <>{getResult(result)}<MdOutlineEdit /></>}
			</u>
		</>
	}
	const getResult = r => {
		switch (r) {
			case 1: return '1-0';
			case 2: return '0-1';
			case 3: return '½-½';
		}
	}

	useEffect(() => {
		const getValues = async () => {
			const t = await API.getRunning()
			setTournament(t);console.log(t)
			const T = await API.getTurns(t.id);
			setTurns(T.map((t, i) => ({ ...t, Result: (i !== T.length - 1 ? getResult(t.Result) : () => currentResult(t.Result)) })));
			setStandings(await API.getStandings(t.id));
			if (dirty) setDirty(false);
		}
		getValues().then(() => setLoading(false)).catch(() => setLoading(false));
		API.getAnnounces().then(announces => setAnnounces(announces.map(a => { if (a) a.tData = JSON.parse(a.tData); return a; }).reverse()));
	}, [dirty])

	const Details = () => (
		<Container fluid className='justify-content-center'>
			<Row><Col><b>Date </b> <RiCalendar2Fill /> {" " + tournament.Date}</Col></Row>
			<Row className="mt-2"><Col><b>Time </b> <FiClock /> {tournament.Time}</Col></Row>
			<Row className="mt-2"><Col><b>Place </b><MdPlace />{" " + tournament.Place}</Col></Row>
			<Row className="mt-2"><Col><b>Type: </b>{tournament.Type}</Col></Row>
			<Row className="mt-2"><Col><b>Description </b><MdOutlineTextsms /> {tournament.Description}</Col></Row>
		</Container>
	);

	return (<>
		<h2 className="ml-3 mb-0">Running Tournament</h2>
		<h6 className="ml-4 mt-0 mb-0"><i>Current tournament you are enrolled into</i></h6>
	{loading ? <div style={{textAlign: "center"}} className="mt-5">
		<Spinner animation="grow" />
		<Spinner animation="grow" />
		<Spinner animation="grow" /></div> :
		!(tournament && turns) ? 
		<dev style={{ display: 'flex', justifyContent: 'center' }}>
			<h2 className="mt-4" align="center"><i>No tournament running now</i></h2>
        </dev> 
		: <>
		<ResultModal show={show} setShow={setShow} setResult={setDirty} turn={turns.length} idT={tournament.id} />
		<RefreeModal show={show1} setShow={setShow1} setMessage={setMessage} />
		<ForfeitModal show={show2} setShow={setShow2} id={tournament.id} exit={forfeit}/>
		<h1 className="ml-3 mt-2"><Badge variant="dark">{tournament.Name}</Badge></h1>
		{message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
		<Button className="first-color m-2 shadow" onClick={() => setShow1(true)}>Call Arbiter  <BiHelpCircle /></Button>
		<Button className="first-color m-2 shadow" onClick={() => setShow2(true)} >Withdraw <BsFlagFill /></Button>
		<Button className="first-color m-2 shadow" onClick={() => setShowSupport(true)} >Contact Organizer <BiHelpCircle /></Button>
		<Accordion className="mt-2">
			<Card className="second-color m-2 shadow">
				<Accordion.Toggle className="first-color" as={Card.Header} eventKey="0">
					<Row className="mt-1">
						<Col><h5>Details</h5></Col>
						<Col style={{ textAlign: "right" }}><FcExpand size="27" /></Col>
					</Row>
				</Accordion.Toggle>
				<Accordion.Collapse eventKey="0">
					<Card.Body><Details /></Card.Body>
				</Accordion.Collapse>
			</Card>
			<Card className="second-color m-2 shadow">
				<Accordion.Toggle as={Card.Header} eventKey="1" className="first-color">
					<Row className="mt-1">
						<Col><h5>Turns</h5></Col>
						<Col style={{ textAlign: "right" }}><FcExpand size="27" /></Col>
					</Row>
				</Accordion.Toggle>
				<Accordion.Collapse eventKey="1">
					<Card.Body className="p-0"><TableBase elements={turns} highlight={(id, i) => i===turns.length-1} /></Card.Body>
				</Accordion.Collapse>
			</Card>
			<Card className="second-color m-2 shadow">
				<Accordion.Toggle as={Card.Header} eventKey="2" className="first-color">
					<Row className="mt-1">
						<Col><h5>Standings <GiTrophyCup /></h5></Col>
						<Col style={{ textAlign: "right" }}><FcExpand size="27" /></Col>
					</Row>
				</Accordion.Toggle>
				<Accordion.Collapse eventKey="2">
					<Card.Body className="p-0 scroll-box" style={{minHeight: "195px"}}>
						<TableBase elements={standings} highlight={(id, i) => id===1}/>
					</Card.Body>
					
				</Accordion.Collapse>
			</Card>
			{announces.find(a => a.forID === tournament.id) && <Card className="second-color m-2 shadow">
				<Accordion.Toggle as={Card.Header} eventKey="3" className="first-color">
					<Row className="mt-1">
						<Col><h5>Announcements <MdCircleNotifications /></h5></Col>
						<Col xs="4" style={{ textAlign: "right" }}><FcExpand size="27" /></Col>
					</Row>
				</Accordion.Toggle>
				<Accordion.Collapse eventKey="3">
					<Card.Body>
						<div className="scroll-box">
							{announces.filter(a => a.forID === tournament.id).map((a, i) => <Row className="mt-2"><Col><b>•</b> {a.text}</Col></Row>)}
						</div>
					</Card.Body>
				</Accordion.Collapse>
			</Card>}
		</Accordion>
    <SupportModal show={showSupport} setShowSupport={setShowSupport} tournament={tournament} setMessage={props.setMessage} />
	</>}</>);
}

export default Running;
