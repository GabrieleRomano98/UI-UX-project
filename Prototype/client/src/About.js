
import { Card } from 'react-bootstrap';


function About() {

    let url = "https://static.vecteezy.com/system/resources/previews/002/755/771/non_2x/continuous-line-drawing-of-chess-figure-moving-in-game-illustration-vector.jpg";

    return (<>
        <div style={{
            position:"absolute",
            display:"block",
            height: "100vh",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundImage: `url(${url})`,
        }}>
            <div style={{
                marginTop:"200px"
            }}>
                <Card>
                    <Card.Body >
                        <Card.Title>We're ChessMate!</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">HCI polito group</Card.Subtitle>
                        <Card.Text>
                            Hi! We're the ChessMate team! We like web developing, we choose the HumanComputerInteraction
                            course and here we are!
                        </Card.Text>
                        <span>For further information, do not visit our website <Card.Link href="#">www.chessmate.com</Card.Link> </span>
                    </Card.Body>
                </Card>
            </div>
        </div>
    </>);
}

export default About;