import React, { useEffect } from "react";
import "./Greetheader.css";
// import {useTypewriter,Cursor} from 'react-simple-typewriter';
import Home from "./Home";
import { useNavigate } from "react-router-dom";

const Greetheader = () => {
  const [userEmail, setUserEmail] = React.useState("");
  const navigate = useNavigate();

  //  const [typeEffect] = useTypewriter({
  //     words:['BackBox',"Secure your files.","Your privacy, our priority."],
  //     loop:{},
  //     typeSpeed:70,
  //     deleteSpeed:50,
  //     delaySpeed:1000
  //   });

  useEffect(() => {
    // add a className to root html to force a plain white background for this page
    const root = document.documentElement;
    root.classList.add("greet-page");
    // read user from localStorage
    try {
      const u = localStorage.getItem("user");
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed && parsed.email) setUserEmail(parsed.email);
      }
    } catch (e) {
      /* ignore parse errors */
    }
    return () => root.classList.remove("greet-page");
  }, []);

  const handleLogout = () => {
    // Clear user session data (e.g., JWT token)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login page
    window.location.href = "/";
  };
  return (
    <>
      <header className="header-section">
        <nav className="nav-wrapper">
          <div className="brand">
            {/* <h1 className="nav-title"><em>{typeEffect}  <Cursor cursorColor='blue' cursorStyle="/"/></em></h1> */}
            <h1 className="nav-title">BackBox</h1>

            <div className="nav-items">
              <a
                href="/greet"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/greet");
                }}
              >
                Home
              </a>
              <a
                href="/uploads"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/uploads");
                }}
              >
                Uploads
              </a>
            </div>
          </div>

          <div
            className="corner-profile-section"
            role="region"
            aria-label="User profile"
          >
            <div className="greet">
              <span className="greet-user">Welcome,</span>
              <span className="greet-name">{userEmail || "User"}</span>
            </div>

            <button
              id="logout-btn"
              className="logout-btn"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-box-arrow-right"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                />
                <path
                  fillRule="evenodd"
                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                />
              </svg>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </nav>
      </header>

      <div className="home-section">
        <Home />
      </div>

      {/* <div>
      <FileUpload />
    </div> */}

      <footer className="footer-section">
        <p>&copy; {new Date().getFullYear()} BackBox. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Greetheader;
