import { Container, Row, Col, Modal, Button, Accordion, Card, Form, Alert, Spinner } from "react-bootstrap";
import { RiCalendar2Fill } from "react-icons/ri";
import { MdPlace, MdOutlineTextsms } from "react-icons/md";
import { FiClock } from "react-icons/fi";
import { FcExpand } from "react-icons/fc";
import API from "../API";
import { useState, useEffect } from "react";

function JoinModal(props) {

  const [announces, setAnnounces] = useState([]);
  const [issueMsg, setIssue] = useState('');
  const [object, setObject] = useState('');
  const [loadingAnn, setLoadingAnn] = useState(true);

  useEffect(() => {
    setLoadingAnn(true);
    API.getAnnounces().then(ann => {
      setAnnounces(ann.filter(a => a.forID === props.tournament.id).map(a => { if (a) a.tData = JSON.parse(a.tData); return a; }).reverse());
      setLoadingAnn(false);
    });
  }, [props.tournament])

  const handleJoin = (tour, event) => {
    API.joinTournament(tour.id).then((res) => {
      if (res.ok) buttonJoined(event, 0);
      else buttonJoined(event, 1);
      props.setUpdate(true);
      props.setMessage('Tournament joined! It is now visible in the section "Enrollments"')
      props.setJoining(tour.id);
      return;
    });
  }

  const buttonJoined = (ev, already) => {
    ev.target.innerText = (already ? 'Already j' : 'J') + 'oined!';
    ev.target.style.backgroundColor = '#0984e3';
    ev.target.style.borderColor = '#2e86de';
    ev.target.disabled = true;
  }

  const handleOpen = (ev) => {
    API.openIssue(props.tournament.id, issueMsg, object).then(res => { if (res.ok) { setIssue(''); ev.target.innerText = 'Sent!'; } });
  }

  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" centered>
      <Modal.Header className="first-color" closeButton>
        <Modal.Title>
          {props.tournament.Name} - Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="second-color">
        {props.already && <Alert variant="danger">
          You are already enrolled in a tournament in the same date. Resign from that one before joining this tournament
        </Alert>}
        <Container fluid className='justify-content-center'>
          <Row><Col><b>Date </b> <RiCalendar2Fill /> {" " + props.tournament.Date}</Col></Row>
          <Row className="mt-2"><Col><b>Time </b> <FiClock /> {props.tournament.Time}</Col></Row>
          <Row className="mt-2"><Col><b>Place </b><MdPlace />{" " + props.tournament.Place}</Col></Row>
          <Row className="mt-2"><Col><b>Type: </b>{props.tournament.Type}</Col></Row>
          <Row className="mt-2"><Col><b>Description </b><MdOutlineTextsms /> {props.tournament.Description}</Col></Row>
          <Accordion className="mt-3">
            <Card className="first-color">
              <Accordion.Toggle as={Card.Header} eventKey="support">
                <Row className="mt-1">
                  <Col xs="9"><h5>Contact Organizer</h5></Col>
                  <Col style={{ textAlign: "right" }}><FcExpand size="27" /></Col>
                </Row>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="support">
                <Card.Body>
                  <Form>
                    <Form.Label>Write the object of your issue:<span className="form_required"> <b>*</b></span></Form.Label>
                    <Form.Control onChange={e => setObject(e.target.value)} placeholder="max 20 characters" maxlength="20" />
                    <Form.Label className="mt-3">Describe briefly your issue/question:<span className="form_required"> <b>*</b></span></Form.Label>
                    <Form.Control id="support_text" as="textarea" rows={3} onChange={e => setIssue(e.target.value)} />
                  </Form>
                  <div className="form_required mt-2"><b>* required fields</b></div>
                  <h6 className="mt-2" style={{ textAlign: 'center' }}>You can view your issues in the navbar menu "Messages".</h6>
                  <Col className="mt-3" style={{ textAlign: 'center' }}><Button disabled={issueMsg === '' || object == ''} variant="success" size="lg" onClick={ev => handleOpen(ev)}>Open issue</Button></Col>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          {loadingAnn ? <div style={{ textAlign: "center" }} className="mt-3"><Spinner animation="grow" /><Spinner animation="grow" /><Spinner animation="grow" /></div>
            : announces.length !== 0 && <><hr />
              <h6 className="mt-2">Announcements:</h6>
              <div className="scroll-box">
                {announces.map((a, i) => <Row className="mt-2"><Col><b>•</b> {a.text}</Col></Row>)}
              </div>
            </>}
        </Container>
      </Modal.Body>
      <Modal.Footer className="first-color">
        <Container fluid className='justify-content-center'>
          <Row className="align-items-center">
            <Col style={{ textAlign: 'center' }}><Button variant="secondary" size="lg" onClick={() => props.onHide()}>Close</Button></Col>
            <Col style={{ textAlign: 'center' }}><Button disabled={props.already} variant="success" size="lg" onClick={ev => handleJoin(props.tournament, ev)}>Join</Button></Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal >
  );
}


export default JoinModal;