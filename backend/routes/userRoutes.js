const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: " Email is already in use, Please login. " });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({ error: "Email is not registered" });
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        //Let us generate a JWT:

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        )
        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});


module.exports = router;
