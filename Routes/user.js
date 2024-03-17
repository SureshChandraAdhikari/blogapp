const express = require("express");
const User = require("../Models/user.js");
const router = express.Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log("User", token);
    res.cookie("token", token);
    return res.redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    await User.create({
      fullName,
      email,
      password,
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("signup", {
      error: "Error occurred while signing up",
    });
  }
});


router.get('/logout' , (req,res) => {
  res.clearCookie('token').redirect("/");
})

module.exports = router;
