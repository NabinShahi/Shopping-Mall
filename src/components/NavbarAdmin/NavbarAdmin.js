import React from "react";
import { Link } from "react-router-dom";
import "./NavbarAdmin.css";
import thePeakStudio from './thepeakstudio.png'

function NavbarAdmin() {
  return (
    <div className="navbar">
      <Link to="/" className="navbar__img">
        <img src={thePeakStudio} alt="The Peak Studio" />
      </Link>
      <div className="navbar__signIn">
        <Link to="/login" className="navbar__logout">
          Log Out
        </Link>
        <Link to="/login" className="navbar__switch">
          Switch to User
        </Link>
      </div>
    </div>
  );
}

export default NavbarAdmin;
