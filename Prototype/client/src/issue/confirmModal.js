import { Modal, Button } from 'react-bootstrap';

function ConfirmModal(props) {

	const handleConfirm = () => {
		props.confirm();
		props.setShow(false);
	}

	return (
		<Modal centered show={props.show} onHide={() => props.setShow(false)}>

			<Modal.Header closeButton className='first-color'>
				<Modal.Title>Delete Chat</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h6>Are you sure you want to delete this chat?</h6>
				<i>This action <b>can't be undone</b>.</i>
			</Modal.Body>
			<Modal.Footer className='first-color justify-content-around'>
				<Button size="lg" variant="secondary" onClick={() => props.setShow(false)}>Cancel</Button>
				<Button size="lg" variant="danger" onClick={handleConfirm}>Delete Chat</Button>
			</Modal.Footer>

		</Modal>
	);
}

export default ConfirmModal;