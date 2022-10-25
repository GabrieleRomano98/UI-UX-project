import { Container, Row, Col, Modal, Button, Form } from "react-bootstrap";
import API from "./API";
import { useState } from "react";

function SupportModal(props) {

  const [issueMsg, setIssue] = useState('');
  const [object, setObject] = useState('');

  const handleOpen = () => {
    API.openIssue(props.tournament.id, issueMsg, object).then(res => { if(res.ok) { props.setMessage('Your issue has been sent. You can view it accessing Messages from navbar menu.'); props.setShowSupport(false); }});
  }

  return (
    <Modal centered show={props.show} onHide={() => props.setShowSupport(false)} size="lg">
      <Modal.Header className='first-color' closeButton>
        <Modal.Title>
          {props.tournament.Name} <br/> Contact Organizer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='second-color'>
        <Form>
          <Form.Label>Write the object of your issue:<span className="form_required"> *</span></Form.Label>
          <Form.Control onChange={e => setObject(e.target.value)} placeholder="max 20 characters" maxlength="20"/>
          <Form.Label className="mt-3">Describe briefly your issue/question:<span className="form_required"> *</span></Form.Label>
          <Form.Control as="textarea" rows={3} onChange={e => setIssue(e.target.value)} />
        </Form>
        <div className="form_required mt-2">* required fields</div>
        <h6 className="mt-3" style={{textAlign: 'center'}}>You can view your issues in the navbar menu "Messages".</h6>
      </Modal.Body>
      <Modal.Footer className='first-color justify-content-around'>
        <Button variant="secondary" size="lg" onClick={() => props.setShowSupport(false)}>Cancel</Button>
        <Button disabled={!(issueMsg !== '' || object !== '')} variant="success" size="lg" onClick={() => handleOpen()}>Open issue</Button>
      </Modal.Footer>
    </Modal>
  );
}


export default SupportModal;