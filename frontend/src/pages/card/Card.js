import React from "react";
import "./Card.css"; // Import your CSS file for styling
import logo from "../../assets/images/gy.png";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "antd";

const CardComponent = () => {
  return (
    <div>
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
      </header>

      <Row gutter={[0, 0]} justify="center" style={{margin:"0 80px"}}>
        {[...Array(6).keys()].map((index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Link to="/login" className="card-link2">
              <div className="card2 ">
                <div className="content2">
                  <h2>{`0${index + 1}`}</h2>
                  <h3>Sunlight PRDV</h3>
                </div>
                <div className="content2-back">
                  <h2>{`0${index + 1}`}</h2>
                  <h3>Sunlight PRDV</h3>
                  <Button className="flip-button">Connexion</Button>
                </div>
                <div className="glow2"></div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CardComponent;
