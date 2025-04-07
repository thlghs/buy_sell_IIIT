const express = require("express");
const router = express.Router();
const session = require("express-session");
const CAS = require("cas");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const cas = new CAS({
  base_url: process.env.CAS_LINK, 
  service: `${process.env.BASE_URL}/api/cas/callback`,
});


router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
   
  })
);


router.get("/login", (req, res) => {
  const loginUrl = `${process.env.CAS_LINK}/login?service=${encodeURIComponent(`${process.env.BASE_URL}/api/cas/callback`)}`;
  console.log("Redirecting to CAS login:", loginUrl);
  res.redirect(loginUrl);
});

router.get("/callback", (req, res) => {
  const ticket = req.query.ticket;
  if (!ticket) {
    return res.status(400).send("Missing CAS ticket.");
  }

 
  cas.validate(ticket, async (err, status, username, extended) => {
    console.log("CAS Validation Response:", { err, status, username, extended });
    if (err || !status) {
      console.error("CAS Authentication Error:", err);
      return res.status(401).send("CAS authentication failed.");
    }

   
    const email = username;
    try {
     
      const existingUser = await User.findOne({ email });
      if (existingUser) {
       
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("CAS user found, redirecting to CAS login success with token:", token);
       
        return res.redirect(`http://localhost:5173/cas-login-success?token=${token}`);
      } else {
        console.log("CAS user not registered, redirecting to registration with email:", email);
        
        return res.redirect(`http://localhost:5173/register?email=${email}`);
      }
    } catch (error) {
      console.error("Database Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});


router.get("/logout", (req, res) => {
  req.session.destroy();
  const logoutUrl = `${process.env.CAS_LINK}/logout?service=${encodeURIComponent("http://localhost:5173/login")}`;
  res.redirect(logoutUrl);
});

module.exports = router;
