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
      
      <div className="container2">
        <Link to="/login" className="card-link2">
          <div class="card2">
            <div class="content2">
              <h2>01</h2>
              <h3>Sunlight PRDV</h3>
            </div>
            <div class="content2-back">
              <h2>01</h2>
              <h3>Sunlight PRDV</h3>
              <button class="flip-button">Connexion</button>
            </div>
            <div class="glow2"></div>
          </div>
        </Link>
        <Link to="/login" className="card-link2">
          <div class="card2">
            <div class="content2">
              <h2>02</h2>
              <h3>Sunlight PRDV</h3>
            </div>
            <div class="content2-back">
              <h2>02</h2>
              <h3>Sunlight PRDV</h3>
              <button class="flip-button">Connexion</button>
            </div>
            <div class="glow2"></div>
          </div>
        </Link>
        <Link to="/login" className="card-link2">
          <div class="card2">
            <div class="content2">
              <h2>03</h2>
              <h3>Sunlight PRDV</h3>
            </div>
            <div class="content2-back">
              <h2>03</h2>
              <h3>Sunlight PRDV</h3>
              <button class="flip-button">Connexion</button>
            </div>
            <div class="glow2"></div>
          </div>
        </Link>
        <Link to="/login" className="card-link2">
          <div class="card2">
            <div class="content2">
              <h2>04</h2>
              <h3>Sunlight PRDV</h3>
            </div>
            <div class="content2-back">
              <h2>04</h2>
              <h3>Sunlight PRDV</h3>
              <button class="flip-button">Connexion</button>
            </div>
            <div class="glow2"></div>
          </div>
        </Link>
      </div>

      
    </div>
  );
};

export default CardComponent;
