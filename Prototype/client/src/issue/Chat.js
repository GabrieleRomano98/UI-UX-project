//React
import { useState, useEffect, useRef } from "react";
import { Card, Button, Spinner, Form, Row } from "react-bootstrap";
//Icons
import { BiSend } from "react-icons/bi";
import { GoArrowLeft } from "react-icons/go";
import { useHistory } from "react-router-dom";

import API from "../API";

function Chat(props) {
    const [chat, setChat] = useState(false);
    const [dirty, setDirty] = useState(true);
    const [value, setValue] = useState('');
    const history = useHistory();

    const myRef = useRef(null);

    useEffect(() => {
        const getValues = async () => {
            if (dirty) {
                setChat(await API.getMessages(props.id));
                myRef.current && myRef.current.scroll({
                    behavior: "smooth",
                    top: myRef.current.scrollHeight
                });
                setDirty(false);
                setValue('');
                API.readMessages(props.id)
            }
        }
        getValues();
    }, [dirty]);

    const sendMessage = () => {
        if (value != '') {
            setChat(c => ({ ...c, messages: [...c.messages, { message: value, user: 1, timestamp: Number.MAX_VALUE, loading: true }] }));
            API.sendMessage(props.id, value);
            setDirty(true)
        }

    };

    return (<>
        <dev style={{ display: 'flex', justifyContent: 'left' }}>
            <Button className="first-color m-3 shadow" onClick={() => history.goBack()}><GoArrowLeft /></Button>
            <h2 className = "mt-3">{chat.object}</h2>
        </dev>
        <Card className="first-color mb-3 ml-2 mr-3  shadow" style={{ minHeight: "70vh", maxHeight: "70vh", overflow: "scroll" }} ref={myRef}>
            {!chat ? <div align="center" className="m-4"><Spinner animation="border" /></div> :
                chat.messages.sort((m1, m2) => m1.timestampe - m2.timestamp).map((m, i) =>
                    <div align={m.user === 1 && "right"}>
                        <Card className="m-2 second-color shadow" style={{ maxWidth: "75%" }}>
                            <t style={{ fontSize: 20, textAlign: "justify-right" }} key={i} className="m-1" >
                                {m.message}<br />
                                {m.loading && <Spinner style={{ float: "left" }} animation="border" size="sm" />}
                            </t>
                        </Card>
                    </div>
                )}
        </Card>
        <Form.Control
            className="ml-3 mr-3"
            style={{ maxWidth: "75vw", display: "inline" }}
            value={value}
            onChange={e => setValue(e.target.value)}
        />
        <Button className="first-color" onClick={sendMessage}><BiSend /></Button>
    </>);
}

export default Chat;
