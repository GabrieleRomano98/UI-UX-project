import Image from 'react-bootstrap/Image'
import { ListGroup } from 'react-bootstrap';
import { MdOutlineEdit } from "react-icons/md";


function Profile(props) {
    let url = "https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg"
    let name = "Mario Rossi";
    let mail = "MarioRossi@polito.it";
    let password = "*********";

    return (<>
        <div className='first-color'>
            <h3 className="ml-3 mb-1">Profile</h3>
            <h6 className="ml-4 mt-0 mb-0"><i>View and edit your personal info</i></h6>&nbsp;
        </div>
        <div >
            <Image src={url} roundedCircle
                style={{
                    width: "150px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "30px",
                    marginBottom: "30px"
                }} />
            <hr />
            <ListGroup>
                <ListGroup.Item>Name: {name} <MdOutlineEdit /></ListGroup.Item>
                <ListGroup.Item>E-mail : {mail} </ListGroup.Item>
                <ListGroup.Item>Password : {password} <MdOutlineEdit /></ListGroup.Item>
            </ListGroup>
        </div>
        <div class="d-flex flex-row justify-content-center align-items-center gap-2"
            style={{
                marginTop: "30px",
                marginBottom: "30px"
            }}>
        </div>
    </>);
}

export default Profile;