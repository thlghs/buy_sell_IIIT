import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "../api/axios";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    contactNumber: "",
  });

  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);  
  const navigate = useNavigate();
  const SITE_KEY = "6Lemf8oqAAAAALq7SHFimQd_IJjtvRq9yIeRh4a3";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(iiit\.ac\.in|students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/;
    if (!emailPattern.test(formData.email)) {
        alert("Please use an IIIT email (iiit.ac.in, students.iiit.ac.in, or research.iiit.ac.in).");
        return;
    }
    if (!recaptchaToken) {
      alert("Please verify that you are not a robot.");
      return;
    }
    try {
      const response = await axios.post("/auth/register", {
        ...formData,
        recaptchaToken,
      });
      alert(response.data.message);
      navigate("/login");
    } 
    catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      recaptchaRef.current.reset(); 
      setRecaptchaToken(null);
    }
  };

  return (
    <div className="form-container">
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="First Name"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="Last Name"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="number"
                    name="age"
                    className="form-control"
                    placeholder="Age"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="tel"
                    name="contactNumber"
                    className="form-control"
                    placeholder="Contact Number"
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3 text-center">
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={SITE_KEY}
                    onChange={(token) => setRecaptchaToken(token)}
                />
            </div>

            <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
    </div>
);

};

export default Register;
