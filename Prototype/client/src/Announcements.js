import { useEffect, useState } from 'react';
import { Container, Row, Col, Badge, Accordion, Card, Spinner } from 'react-bootstrap';
import { FcExpand } from 'react-icons/fc';
import { GrNotification } from 'react-icons/gr';
import { RiCalendar2Fill } from "react-icons/ri";
import { GiTrophyCup } from "react-icons/gi";
import { MdPlace, MdOutlineTextsms } from "react-icons/md";
import API from './API';

function Announcements(props) {

  const [announcements, setAnnounces] = useState([]);

  useEffect(() => {
    API.getAnnounces().then(announces => setAnnounces(announces.filter(a => a.forID === -1)));
  }, [])

  const handleRead = (announce) => {
    API.readAnnounce(announce.id).then(res => {
      if (res) setAnnounces(old => old.map(oa => {
        if (oa.id === announce.id) oa.read = 1;
        return oa;
      }));
    });
  }

  return (<Container>
    <Row className='first-color'>
      <h3 className="ml-3 mt-0 mb-1">Announcements</h3>
      <h6 className="ml-4 mt-0 mb-4"><i>General announcements about the platform</i></h6>
    </Row>
    {!announcements.length && <div style={{ textAlign: "center" }} className="mt-5">
      <Spinner animation="grow" />
      <Spinner animation="grow" />
      <Spinner animation="grow" /></div>}
    <Accordion className="mt-3">
      {announcements.map((a, i) =>
        <Card key={'ca' + i} style={{ borderTopLeftRadius: '18px', borderTopRightRadius: '18px', borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px', borderBottom: '1px solid rgba(0,0,0,.125)' }} className='shadow mt-2'>
          <Accordion.Toggle className="first-color" as={Card.Header} eventKey={'a' + i} style={{ backgroundColor: a.read ? 'rgb(0 0 0 / 11%)' : 'rgb(198 211 0 / 53%)' }}
            onClick={() => { if (!a.read) handleRead(a) }}>
            <Row className="mt-1">
              <Col><h5>{a.title}</h5></Col>
              <Col xs="1" style={{ textAlign: "right" }}>{!a.read && <Badge variant="warning"><GrNotification size="16" /></Badge>}</Col>
              <Col xs="2" style={{ textAlign: "right" }}><FcExpand size="27" /></Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={'a' + i}>
            <Card.Body>
              {a.text}
              {a.forID !== -1 && <>
                <h6 className="mt-3">Tournament details</h6>
                <Row className="ml-2"><b>Name</b>&nbsp;<MdOutlineTextsms />&nbsp;{" " + a.tData.name}</Row>
                <Row className="ml-2"><b>Date</b>&nbsp;<RiCalendar2Fill />&nbsp;{" " + a.tData.date}</Row>
                <Row className="ml-2"><b>Place</b>&nbsp;<MdPlace />&nbsp;{" " + a.tData.place}</Row>
              </>}
              <h6 className="mt-3">From Organizer {a.organizer}</h6>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      )}
    </Accordion>
  </Container>);
}

export default Announcements;