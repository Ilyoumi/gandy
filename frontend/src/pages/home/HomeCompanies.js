import React from "react";
import "./HomeCompanies.css";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "antd";
import logo from "../../assets/images/lg.png";
import gy from "../../assets/images/gy.png";
import expert from "../../assets/images/expert.png";
import servihome from "../../assets/images/servihome.png";
import sunlogo from "../../assets/images/LOGO_sunlightcall.png";
import sunsymbole from "../../assets/images/sunlogo.png";
import servisymbol from "../../assets/images/servisymbol.png";
import optinergy from "../../assets/images/optinergy.png";
import optisymbole from "../../assets/images/optisymbole.png";
import gysymbol from "../../assets/images/gysymbol.png";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "antd";

const CompanyCard = ({ number, name, logoFrontSrc, logoBackSrc, buttonText, buttonLink }) => {
  return (
    <Col xs={24} sm={12} md={12} lg={6}>
      <Link to={buttonLink} className="card-link2">
        <div className="card2">
          <div className="content2">
            <img src={logoFrontSrc} alt="Front Logo" />
          </div>
          <div className="content2-back">
            <img src={logoBackSrc} alt="Back Logo" />
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
          logoFrontSrc={sunsymbole}
          logoBackSrc={sunlogo}
          buttonText="Connexion"
          buttonLink="/login"
        />
        <CompanyCard
          number="02"
          name="Expertinout"
          logoFrontSrc={expert}
          logoBackSrc={expert}
          buttonText="Connexion"
          buttonLink="/expertinout"
        />
        <CompanyCard
          number="03"
          name="gandy invest"
          logoFrontSrc={gysymbol}
          logoBackSrc={gy}
          buttonText="Connexion"
          buttonLink="/gandy-invest"
        />
         <CompanyCard
          number="04"
          name="Servihome"
          logoFrontSrc={servisymbol}
          logoBackSrc={servihome}
          buttonText="Connexion"
          buttonLink="/servihome"
        />
        <CompanyCard
          number="05"
          name="optinergy"
          logoFrontSrc={optisymbole}
          logoBackSrc={optinergy}
          buttonText="Connexion"
          buttonLink="/optinergy"
        />
        <CompanyCard
          number="06"
          name="brandpartners"
          logoFrontSrc={optisymbole}
          logoBackSrc={optinergy}
          buttonText="Connexion"
          buttonLink="/brandpartners"
        />
        <CompanyCard
          number="07"
          name="wizoo"
          logoFrontSrc={optisymbole}
          logoBackSrc={optinergy}
          buttonText="Connexion"
          buttonLink="/wizoo"
        />
        <CompanyCard
          number="08"
          name="brandassurance"
          logoFrontSrc={optisymbole}
          logoBackSrc={optinergy}
          buttonText="Connexion"
          buttonLink="/brandassurance"
        />
      </Row>
    </div>
  );
};

export default HomeCompanies;
