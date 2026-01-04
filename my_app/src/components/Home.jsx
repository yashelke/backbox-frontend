import React from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import DotGrid from "./DotGrid";
import "./Home.css";
import logo from "../assets/logo_vid.mp4";
import FileUpload from "./FileUpload";
const Home = () => {
  const [typeEffect] = useTypewriter({
    words: [
      "Secure your files.",
      "Your privacy, our priority.",
      "Made for you.",
    ],
    loop: {},
    typeSpeed: 70,
    deleteSpeed: 50,
    delaySpeed: 1000,
  });

  return (
    <>
      <div className="home-content">
        <div className="dot-grid-background">
          <DotGrid
            dotSpacing={25}
            dotBaseSize={1.5}
            influenceRadius={120}
            maxScale={6}
            backgroundColor="#ffffff"
            glowColor="#7c3aed"
            numLayers={3}
            hiddots={false}
            showGrid={true}
          />
        </div>

        <div className="home-content-inner">
          <div className="hero-sections">
            <section className="left-section">
              <h2 className="home-title">Welcome to Backbox</h2>
              <p className="home-subtitle">
                <em>
                  {typeEffect}
                  <Cursor cursorColor="blue" cursorStyle="/" />
                </em>
              </p>
              <p className="home-description">
                Backbox is your trusted solution for secure file storage and
                management.
              </p>

              <button className="try-btn">
                <a href="#try">Try Now</a>
              </button>
            </section>

            <section className="right-section">
              <video
                src={logo}
                alt="Backbox Logo"
                className="home-logo"
                autoPlay
                loop
                muted
              />
            </section>
          </div>

          <section className="card-section">
            <div id="card1" className="info-card">
              <h3>Secure Storage</h3>
              <p>Your files are encrypted and stored safely.</p>
            </div>
            <div id="card2" className="info-card">
              <h3>Easy Access</h3>
              <p>Access your files from anywhere, anytime.</p>
            </div>
            <div id="card3" className="info-card">
              <h3>User Friendly</h3>
              <p>Intuitive interface for seamless file management.</p>
            </div>
            <div id="card4" className="info-card">
              <h3>Mutiple File Formats Support</h3>
              <p>Upload and manage various file types with ease.</p>
            </div>
          </section>
        </div>
      </div>

      <div id="try" className="Upload-component">
        <FileUpload />
      </div>
    </>
  );
};

export default Home;
