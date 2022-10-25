import {Tabs, Tab} from 'react-bootstrap'
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

function MyTabs(props) {
    const [reqUpdate, setUpdate] = useState(true);
    const [showSupport, setShowSupport] = useState(false);
    const history = useHistory();

    return (
            <Tabs
                id="controlled-tab-example"
                activeKey={props.aKey}
                onSelect={k => history.push(k)}
                className="mb-2 first-color"
                style={{justifyContent:"space-around"}}>

                <Tab tabClassName={(props.aKey === "/join" ? "page" : "first-color")+" tab"} eventKey="/join" title="Join">
                </Tab>
                    
                <Tab tabClassName={(props.aKey === "/enrollments" ? "page" : "first-color")+" tab"} eventKey="/enrollments" title="Enrollments">
                </Tab>

                <Tab tabClassName={(props.aKey === "/running" ? "page" : "first-color")+" tab"} eventKey="/running" title="Running">
                </Tab>
            </Tabs>
    )
}

export default MyTabs;