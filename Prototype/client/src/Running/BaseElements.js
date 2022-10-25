import { Table } from "react-bootstrap";

function TableBase(props) {
    if(!props.elements || !props.elements.length)
        return (<></>);
    const renderElement = E => typeof E !== 'function' ? E : <E/>
    return(
        <Table striped size="sm" style={{fontSize: 16, padding: 0}}>
            <thead>
                <tr align="center">
                    {Object.keys(props.elements[0]).map(k => <th>{k}</th>)}
                </tr>
            </thead>
                <tbody>
                    {props.elements.map((e, i) => <tr align="center" className={props.highlight(e.id, i) && "highlight"}>
                        {Object.values(e).map(v =><td>{renderElement(v)}</td>)}
                    </tr>)}
                </tbody>
        </Table>
    );
}

export {TableBase};