import React, { useState } from "react";
import "./Login.css";
import { Link, useHistory } from "react-router-dom";
import logo from "../NavbarAdmin/thepeakstudio.png";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // console.log(email);
  // console.log(password);

  return (
    <div className="login">
      <Link to="/">
        <img className="login__logo" src={logo} alt="The Peak Studio" />
      </Link>

      <div className="login__container">
        <h1>Sign In</h1>
        <form>
          <h5>E-mail</h5>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className="login__signInButton" type="submit">
            Sign In
          </button>
        </form>
        {/* <button className="login__registerButton">
          Create Your Amazon Account
        </button> */}
      </div>
    </div>
  );
};

export default Login;
