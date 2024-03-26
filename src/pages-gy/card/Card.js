import React from "react";
import ParallaxTilt from "react-parallax-tilt";
import "./Card.css"; // Import your CSS file for styling
import logo from "../../assets/images/gy.png";
import { Link } from "react-router-dom";

const CardComponent = () => {
    return (
        <div>
            <header className="header">
                <img src={logo} alt="Logo" className="logo" />
            </header>
            <div className="container">
            <Link to="/sign-in" className="card-link">
                    <ParallaxTilt
                        className="card"
                        perspective={500}
                        tiltMaxAngleX={15}
                        tiltMaxAngleY={15}
                    >
                        <div className="content">
                            <h2>01</h2>
                            <h3>Sunlight PRDV</h3>
                            <p className="link">Connexion</p>
                        </div>
                        <div className="glow" />
                    </ParallaxTilt>
                </Link>
                <Link to="/sign-in" className="card-link">
                    <ParallaxTilt
                        className="card"
                        perspective={500}
                        tiltMaxAngleX={15}
                        tiltMaxAngleY={15}
                    >
                        <div className="content">
                            <h2>02</h2>
                            <h3>Sunlight PRDV</h3>
                            <p className="link">Connexion</p>
                        </div>
                        <div className="glow" />
                    </ParallaxTilt>
                </Link>
                <Link to="/sign-in" className="card-link">
                    <ParallaxTilt
                        className="card"
                        perspective={500}
                        tiltMaxAngleX={15}
                        tiltMaxAngleY={15}
                    >
                        <div className="content">
                            <h2>03</h2>
                            <h3>Sunlight PRDV</h3>
                            <p className="link">Connexion</p>
                        </div>
                        <div className="glow" />
                    </ParallaxTilt>
                </Link>
                <Link to="/sign-in" className="card-link">
                    <ParallaxTilt
                        className="card"
                        perspective={500}
                        tiltMaxAngleX={15}
                        tiltMaxAngleY={15}
                    >
                        <div className="content">
                            <h2>04</h2>
                            <h3>Sunlight PRDV</h3>
                            <p className="link">Connexion</p>
                        </div>
                        <div className="glow" />
                    </ParallaxTilt>
                </Link>
            </div>
        </div>
    );
};

export default CardComponent;
