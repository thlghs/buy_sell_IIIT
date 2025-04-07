import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const SITE_KEY = "6Lemf8oqAAAAALq7SHFimQd_IJjtvRq9yIeRh4a3";


  const handleLogin = async (e) => {
    e.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(iiit\.ac\.in|students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/;
    if (!emailPattern.test(email)) {
        setError("Please use an IIIT email (iiit.ac.in, students.iiit.ac.in, or research.iiit.ac.in).");
        return;
    }
    if (!recaptchaToken) {
      alert("Please verify that you are not a robot.");
      return;
    }
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
        recaptchaToken,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleCasLogin = () => {
    window.location.href = "http://localhost:5000/api/cas/login"; 
  }

return (
  <div className="form-container">
      <h2 className="text-center mb-4">Login</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      <form onSubmit={handleLogin}>  
          <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <div className="text-center mb-3">
              <ReCAPTCHA
                  sitekey={SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token)}
              />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
      <button onClick={handleCasLogin} className="btn btn-secondary w-100 mt-2">CAS Login</button>
  </div>
);

};

export default Login;
