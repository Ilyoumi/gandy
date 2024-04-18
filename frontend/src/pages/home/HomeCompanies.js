import React from "react";
import "./HomeCompanies.css"; // Import your CSS file for styling
import logo from "../../assets/images/lg.png";
import gy from "../../assets/images/gy.png"
import expert from "../../assets/images/expert.png";
import servihome from "../../assets/images/servihome.png";
import sunlogo from "../../assets/images/LOGO_sunlightcall.png"; // Corrected import statement
import { Link } from "react-router-dom";
import { Row, Col, Button } from "antd";


const CompanyCard = ({ number, name, logoSrc, buttonText }) => {
  const cardStyle = {
    backgroundImage: `url(${logoSrc})`, // Set background image dynamically
    backgroundSize: 'contain', 
  };
  return (
    <Col xs={24} sm={12} md={12} lg={6}>
      <Link to="/login" className="card-link2">
        <div className="card2" style={cardStyle}> {/* Apply dynamic style */}
          <div className="content2">
            {/* <h2>{number}</h2> */}
            {/* <h3>{name}</h3> */}
          </div>
          <div className="content2-back">
            {/* <h2>{number}</h2> */}
            {/* <h3>{name}</h3> */}
            {/* <Button className="flip-button">{buttonText}</Button> */}
            <Button className="custom-btn">{buttonText}</Button>

          </div>
          <div className="glow2"></div>
        </div>
      </Link>
    </Col>
  );
};

const HomeCompanies = () => {
  return (
    <div>
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
      </header>

      <Row gutter={[16, 16]} justify="center" style={{ margin: "0 80px" }}>
        <CompanyCard
          number="01"
          name="Sunlight-Call PRD"
          logoSrc={sunlogo} // Pass different logo source for each card
          buttonText="Connexion"
        />
        <CompanyCard
          number="02"
          name="Expertinout"
          logoSrc={expert} // Pass a different logo source for each card
          buttonText="Connexion"
        />
        <CompanyCard
          number="03"
          name="gandy invest"
          logoSrc={gy} // Pass a different logo source for each card
          buttonText="Connexion"
          style={{ backgroundSize: "10px", }}
        
        />
        <CompanyCard
          number="03"
          name="Servihome"
          logoSrc={servihome} // Pass a different logo source for each card
          buttonText="Connexion"
        
        />
        {/* Add more CompanyCard components with different logo sources as needed */}

      </Row>
    </div>
  );
};

export default HomeCompanies;
