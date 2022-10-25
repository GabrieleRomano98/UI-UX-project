import { Button, Image, Row, Col, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom';

function HomePage(props) {

    const HomeButton = p => 
        <div className='home-element'>
            <Link to={p.route} className="mt-4">
                <Button disabled={p.disabled} className="first-color shadow" style={{ width: "300px", height: "90px", fontSize: 28 }}>
                    {p.title}
                </Button>
            </Link>
        </div>

    return (
        <>
            <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%", fontSize: "350%" }}>
                ChessMate
                <Image style={{ width: "50px" }} 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/1024px-Chess_kdt45.svg.png" ></Image> 
            </h1>

            <HomeButton route="/join" title="Join Tournament" />
            <HomeButton route="/enrollments" title="Enrollments" />
            <HomeButton disabled={!props.running} route="/running" title="Running Tournament" />

        </>
    )
}

export default HomePage;