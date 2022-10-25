import { ListGroup, Row, Col, Button, Badge, Spinner, Alert } from "react-bootstrap";
import JoinModal from "./JoinModal";
import { useState } from "react";
import { MdCircleNotifications } from "react-icons/md";
import FilterModal from "./FilterModal";
import { FaFilter } from "react-icons/fa";
import dayjs from 'dayjs';
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrAfter)

function JoinList(props) {

	const [showModal, setShow] = useState(false);
	const [showFilter, setShowFilter] = useState(false);
	const [selTourn, setTourn] = useState({});
	const [filterDate, setFilterDate] = useState([null, null]);
	const [filterType, setFilterType] = useState('All');

	const startDate = dayjs(filterDate[0]);
	const endDate = (filterDate[1] == null) ? startDate : dayjs(filterDate[1]);
	const filtered = (filterDate[0] == null && filterType == 'All') ? false : true;

	//Filtered List
	const filterFunction = t =>
		!filtered ||
		//Type
		(filterType === 'All' || t.Type == filterType) &&
		//StartDate												
		(filterDate[0] == null || dayjs(t.Date).isSameOrAfter(startDate, 'day')) &&
		//EndDate			
		(filterDate[1] == null || dayjs(t.Date).isSameOrBefore(endDate, 'day'))

	return (!props.tournamentList || props.dirty ? <dev style={{ justifyContent: 'center' }}><Spinner animation="border" size="lg" /></dev> : <>
		<h2 className="ml-3 mb-0">Join Tournaments</h2>
		<h6 className="ml-4 mt-0 mb-0"><i>Click on a row to see more details</i></h6>
		<Row className='m-2'>
			<Button className="m-2 first-color shadow" onClick={() => setShowFilter(true)}><b>Filter</b>  <FaFilter /> </Button>
		</Row>

		<Row className='m-2'>
			<Button hidden={!filtered} variant='warning' className="m-2 shadow" onClick={() => { setFilterDate([null, null]); setFilterType('All') }}><b>Reset</b></Button>
			<Col>
				<Badge className="ml-1" pill hidden={(filterDate[0] == null)} variant="warning">Start: {startDate.format('YYYY-MM-DD')}</Badge>
				<Badge className="ml-1" pill hidden={(filterDate[1] == null)} variant="warning">End: {endDate.format('YYYY-MM-DD')}</Badge>
				<Badge className="ml-1" pill hidden={!filtered} variant="warning">Type: {filterType}</Badge>
			</Col>
		</Row>

		{props.message && !props.joining && <Alert variant="success" onClose={() => props.setMessage('')} dismissible>{props.message}</Alert>}

		<Row hidden={props.tournamentList.filter(filterFunction).length !== 0} className="justify-content-center">
			<h2 className="mt-5" align="center">No tournament found.<br />Try again!</h2>
		</Row>

		<ListGroup variant="flush" className="m-2">
			{props.tournamentList.sort((a, b) => (a.Date > b.Date) ? 1 : -1).filter(filterFunction).map(tournament =>
				<div onClick={() => { setTourn(tournament); setShow(true); }}>
					<TournamentRow
						name={<>
							{tournament.Name}&nbsp;
							{!!tournament.Announcements && <MdCircleNotifications />}
							{tournament.id === props.joining && <Spinner animation="border" size="lg" />}
						</>}
						date={tournament.Date}
						type={tournament.Type}
					/></div>
			)}
		</ListGroup>

		<JoinModal
			setMessage={props.setMessage}
			already={props.joinedList.some(t => selTourn.Date === t.Date)}
			tournament={selTourn}
			show={showModal}
			onHide={() => setShow(false)} setUpdate={props.setDirty}
			setJoining={props.setJoining}
		/>
		<FilterModal
			show={showFilter}
			filterDate={filterDate} setFilterDate={setFilterDate}
			setFilterType={setFilterType}
			onHide={() => setShowFilter(false)}
		/>
	</>);
}

function TournamentRow(props) {

	return (<>
		<ListGroup.Item action className="mb-3 shadow first-color">
			<Row><h4>{props.name}</h4></Row>
			<Row xs={2}>
				<Col style={{ padding: 0 }}>Type: {props.type}</Col>
				<Col className="col">Date: {props.date}</Col>
			</Row>
		</ListGroup.Item>
	</>);
}

export { JoinList };
