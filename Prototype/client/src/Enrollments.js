//React
import { useEffect, useState } from "react";
import { Container, Row, Col, Accordion, Card, Badge, Button, Modal, Spinner, Alert } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
//Icons
import { RiCalendar2Fill } from "react-icons/ri";
import { MdPlace, MdOutlineTextsms } from "react-icons/md";
import { FiClock } from "react-icons/fi";
import { FcExpand } from 'react-icons/fc';
import { MdCircleNotifications } from "react-icons/md";

import API from "./API";
import SupportModal from "./SupportModal";

function Enrollments(props) {

  const [showModal, setShow] = useState(false);
  const [selTourn, setTourn] = useState(-1);
  const [announces, setAnnounces] = useState([]);
  const [showSupport, setShowSupport] = useState(false);

  const history = useHistory();

  useEffect(() => {
    API.getAnnounces().then(announces => setAnnounces(announces.map(a => { if (a) a.tData = JSON.parse(a.tData); return a; }).reverse()));
  }, [])

  const handleCancel = id => {
    API.cancelEnrollment(id).then(res => {
      if (res.ok) {
        props.setUpdate(true);
        setShow(false);
        props.setDeleting(id);
        props.setMessage('Your enrollment has been deleted')
      }
    })
  }

  return (!props.tournamentList ? <dev style={{ justifyContent: 'center' }}><Spinner animation="border" size="lg" /></dev> : <>

    <h2 className="ml-3 mb-0">Your Enrollments</h2>
    <h6 className="ml-4 mt-0 mb-0"><i>Click on a row to see more details</i></h6>

    {props.message && !props.deleting && <Alert variant="success" onClose={() => props.setMessage('')} dismissible>{props.message}</Alert>}

    {props.tournamentList.length != 0 ? <Accordion className="mt-3">
      {props.tournamentList.map((t, i) => <Card className="m-2 first-color shadow">
        <Accordion.Toggle as={Card.Header} eventKey={'t' + i}>
          <Row className="mt-1">
            <Col><h5>
              {t.Name}&nbsp;
              {!!t.Announcements && <MdCircleNotifications />}
              {t.id === props.deleting && <Spinner animation="border" size="lg" />}
            </h5></Col>
            <Col xs="3" style={{ textAlign: "center" }}>{t.Running === 1 && <Badge variant="warning">Running</Badge>}</Col>
            <Col xs="2" style={{ textAlign: "right" }}><FcExpand size="27" /></Col>
          </Row>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={'t' + i}>
          <Card.Body>
            <Container fluid className='justify-content-center'>
              <Row><Col><b>Date </b> <RiCalendar2Fill /> {" " + t.Date}</Col></Row>
              <Row className="mt-2"><Col><b>Time </b> <FiClock /> {t.Time}</Col></Row>
              <Row className="mt-2"><Col><b>Place </b><MdPlace />{" " + t.Place}</Col></Row>
              <Row className="mt-2"><Col><b>Type: </b>{t.Type}</Col></Row>
              <Row className="mt-2"><Col><b>Description </b><MdOutlineTextsms /> {t.Description}</Col></Row>
              {announces.filter(a => a.forID === t.id).length !== 0 && <><hr />
                <h6 className="mt-2">Announcements:</h6>
                <div className="scroll-box">
                  {announces.filter(a => a.forID === t.id).map((a, i) => <Row className="mt-2"><Col><b>•</b> {a.text}</Col></Row>)}
                </div>
              </>}
              <Row className="mt-3"><Col style={{ textAlign: "center" }}>
                <Button size="lg" variant={t.Running ? 'warning' : 'danger'} onClick={() => t.Running ? history.push('/running') : setTourn(t) || setShow(true)}>
                  {t.Running ? 'Running' : 'Cancel registration'}
                </Button>
              </Col></Row>
              <Row className="mt-3"><Col style={{ textAlign: "center" }}>
                <Button size="lg" variant="primary" onClick={() => { setTourn(t); setShowSupport(true); }}>Contact Organizer</Button>
              </Col></Row>
            </Container>
          </Card.Body>
        </Accordion.Collapse>
      </Card>)
      }
    </Accordion> : <dev style={{ display: 'flex', justifyContent: 'center' }}>
      <h2 className="mt-5" align="center"><i>You aren't registered to any tournament at the moment</i></h2>
    </dev>}

    <Modal show={showModal} onHide={() => setShow(false)} size="lg" centered>
      <Modal.Header className="first-color"><Modal.Title>Cancel Registration</Modal.Title></Modal.Header>
      <Modal.Body className="second-color">
        Are you sure you want to cancel your registration to <b>{selTourn.Name}</b>?<br />
        You can always enroll again from the Join tab until the start of the tournament.
      </Modal.Body>
      <Modal.Footer className="first-color">
        <Container fluid className='justify-content-center'>
          <Row>
            <Col style={{ textAlign: 'center' }}><Button variant="secondary" size="lg" onClick={() => setShow(false)}>Cancel</Button></Col>
            <Col style={{ textAlign: 'center' }}><Button variant="success" size="lg" onClick={() => handleCancel(selTourn.id)}>Confirm</Button></Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
    <SupportModal show={showSupport} setShowSupport={setShowSupport} tournament={selTourn} setMessage={props.setMessage} />
  </>);
}

export default Enrollments;