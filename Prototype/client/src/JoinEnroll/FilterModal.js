import dayjs from 'dayjs';
import { useState } from "react";
import { Container, Row, Col, Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../App.css';


function FilterModal(props) {

    const typeList = ["All", "Bullet 5'+0", "Rapid 25'+0", "Blitz 5'+0", "Atomic 15'+10"];
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [type, setType] = useState(typeList[0]);

    const handleFiltered = () => {
        props.setFilterDate([startDate, endDate]);
        props.setFilterType(type);
        setStartDate(null);
        setEndDate(null);
        setType(typeList[0]);
        props.onHide();
    }

    const handleClear = () => { 
        setStartDate(null); 
        setEndDate(null);
        setType(typeList[0]); 
        props.onHide(); 
    }

    return (

        <Modal show={props.show} onHide={props.onHide} size="lg" centered>

            <Modal.Header className="first-color">                
                <Modal.Title>
                    Filter Tournament
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="second-color">
                <Container fluid className='justify-content-center'>
                
                <Row className="mb-2 ml-1">Type</Row>
                    <Row className="mb-4 ml-5">
                    <Form.Group controlId="selectedType">
                                <Form.Control  className="first-color" as="select" value={type} onChange={event => setType(event.target.value)} >
                                    <option value={typeList[0]}>{typeList[0]}</option>
                                    <option value={typeList[1]}>{typeList[1]}</option>
                                    <option value={typeList[2]}>{typeList[2]}</option>
                                    <option value={typeList[3]}>{typeList[3]}</option>
                                    <option value={typeList[4]}>{typeList[4]}</option>
                                </Form.Control>
                            </Form.Group>
                    </Row>

                    <Row className="mb-2 ml-1">Range Date</Row>
                    <Row className="mb-4 ml-5">
                        
                            <DatePicker className="myDatePicker"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                minDate={new Date()}
                                withPortal
                                placeholderText='Insert start date'
                                dateFormat="yyyy-MM-dd"
                            />
                        </Row>
                            
                        <Row className="mb-4 ml-5">
                            <DatePicker className="myDatePicker"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                withPortal
                                placeholderText='Insert end date'
                                disabled={startDate == null}
                                dateFormat="yyyy-MM-dd"
                            />
                        </Row>
                        
                </Container>
            </Modal.Body>
            
            <Modal.Footer className="first-color">
                <Container fluid className='justify-content-center'>
                    <Row className="align-items-center">
                        <Col style={{ textAlign: 'center' }}><Button variant="secondary" size="lg" onClick={() => handleClear()}>Cancel</Button></Col>
                        <Col style={{ textAlign: 'center' }}><Button variant="success" size="lg" onClick={() => handleFiltered()}>Confirm</Button></Col>
                    </Row>
                </Container>
            </Modal.Footer>
        </Modal>
    );
}
export default FilterModal;


