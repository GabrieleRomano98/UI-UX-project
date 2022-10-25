//React
import { useState, useEffect } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
//Icons
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

import API from "../API";
import ConfirmModal from "./confirmModal";

function Support(props) {
    const [chats, setChats] = useState(false);
    const [show, setShow] = useState(false);
    const [dirty, setDirty] = useState(true);

    useEffect(() => {
        const getValues = async () => {
            if (dirty) {
                setChats(await API.getChats());
                setDirty(false);
            }
        }
        getValues();
    }, [dirty]);

    const confirm = () => {
        setChats(c => c.map(v => v.id !== show ? v : { ...v, loading: true }))
        API.deleteChat(show);
        setDirty(true)
    }

    return (<>
        <div className='first-color'>
            <h3 className="ml-3 mb-1">Messages</h3>
            <h6 className="ml-4 mt-0 mb-0"><i>Your issues with tournaments</i></h6>&nbsp;
        </div>
        {!chats ? <div style={{ textAlign: "center" }} className="mt-5">
            <Spinner animation="grow" />
            <Spinner animation="grow" />
            <Spinner animation="grow" /></div> : <>
            <ConfirmModal show={!!show} setShow={setShow} confirm={confirm} />
            {!chats.length ?
                <h2 className="mt-5" align="center"><i>There are no open issues</i></h2>
                : chats.map(c =>
                    <Card className="first-color m-3" key={c.id}><Row>
                        <Col>
                            <Link className="first-color" to={"/support/" + c.id}>
                                <h3 className="ml-1">
                                    {c.object}&nbsp;
                                    {!!c.unread && <MdOutlineMarkEmailUnread size={30} />}
                                </h3>
                                <h5 className="ml-2">[{c.Name}]</h5>
                            </Link>
                        </Col>
                        <Col className="mr-3 my-auto" align="right" xs="3">
                                {!c.loading ? <RiDeleteBin2Fill onClick={() => setShow(c.id)} size={45} color="#dc3545" />
                                    : <Spinner animation="border" className="ml-1 m-3" />}
                        </Col>
                    </Row></Card>
                )}
        </>}
    </>);
}

export default Support;
