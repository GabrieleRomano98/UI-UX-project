import { useState } from 'react';
import { Modal, Button, Alert, Card } from 'react-bootstrap';
import API from '../API';

const ModalPick = props => (
    <Modal centered show={props.show} onHide={() => props.setShow(false) || props.setSelected(-1)}>

        <Modal.Header className='first-color' closeButton>
            <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body className='second-color'>
            {props.message && <Alert variant="danger" onClose={() => props.setMessage('')} dismissible>{props.message}</Alert>}
            {props.options.map(o => <span onClick = {() => props.setSelected(o.id)}>
                <Card className = "m-2 first-color" style={o.id === props.selected ? {border: "3px solid red"} : {}}>
                    <h4 className = 'm-1' align="center">{o.m}</h4>
                </Card></span>)
            }
        </Modal.Body>

        <Modal.Footer className='first-color justify-content-around'>
            <Button size="lg" variant="secondary" onClick={() => props.setShow(false) || props.setSelected(false)}>Cancel</Button>
            <Button size="lg" variant="success" onClick={props.handleResult}>Confirm</Button>
        </Modal.Footer>

    </Modal>
)

function ResultModal(props) {
    const [value, setValue] = useState();
    const [message, setMessage] = useState('');

    const options = [{m: 'White wins (1-0)', id: 1}, {m: 'Black wins (0-1)', id: 2}, {m: 'Draw (½-½)', id: 3}];

	const handleResult = () => {
        if(!value) {
            setMessage("Select an option!");
            return;
        }
        setValue(-1)
        props.setResult(value);
        API.putResult(props.idT, value, props.turn);
        props.setShow(false);
    }

    return(
        <ModalPick title={'Select a result'}
            message={message} setMessage={setMessage}
            selected={value} setSelected={setValue}
            show={props.show} setShow={props.setShow} 
            options={options} handleResult={handleResult}
        />
    );
}

function RefreeModal(props) {
    const [selected, setSelected] = useState(false)
    const [message, setMessage] = useState('');

    const options = [
        {m: 'Irregular move ❌', id: 1},
        {m: 'Missing opponent 🤷‍♂️', id: 2},
        {m: 'Misbehavior 🗣️', id: 3},
        {m: 'Clock not working 🕰️', id: 4}
    ];

	const handleResult = id => {
        if(!selected) {
            setMessage("Select a reason for calling the arbiter!");
            return;
        }
        //API.callAribter(selected);
        props.setMessage("The arbiter has been called")
        setSelected(false);
        props.setShow(false);
    }

    return(
        <ModalPick title={'Select a reason'}
            message={message} setMessage={setMessage}
            selected={selected} setSelected={setSelected}
            show={props.show} setShow={props.setShow} 
            options={options} handleResult={handleResult}
        />
    );
}

function ForfeitModal(props) {

	const handleResult = () => {
        API.forfeit(props.id);
        props.exit();
        props.setShow(false);
    }

    return(
        <Modal centered show={props.show} onHide={() => props.setShow(false)}>

			<Modal.Header className='first-color' closeButton>
				<Modal.Title>Are you sure?</Modal.Title>
			</Modal.Header>

			<Modal.Body className='second-color'>
                If you forfeit you <b>won't be able</b> to access again this page and you <b>will lose</b> your next matches for this tournament by default.
			</Modal.Body>

			<Modal.Footer className='first-color justify-content-around'>
				<Button size="lg" variant="secondary" onClick={() => props.setShow(false)}>Cancel</Button>
				<Button size="lg" variant="danger" onClick={handleResult}>Forfeit</Button>
			</Modal.Footer>

		</Modal>
    );
}

export { ResultModal, RefreeModal, ForfeitModal };