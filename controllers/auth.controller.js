require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

exports.Register = async (req, res) => {
  // Add safety check for req.body
  if (!req.body || Object.keys(req.body).length === 0) {
    console.log("req.body is empty or undefined");
    return res.status(400).json({ message: "No data received" });
  }

  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "Info required" });

  const hashed = await bcrypt.hash(password, 10);
  User.Create(username, email, hashed, function (err, result) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(409).json({ message: "Email already used" });
      }
      return res.status(500).json({ error: err.message });
    }

    const userId = result.id;

    const token = jwt.sign(
      { id: userId, email, username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      message: "User created",
      result: {
        username: username,
        email: email,
        id: userId,
      },
      token,
    });
  });
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password)
    return res.status(400).render("login", { message: "Info required" });

  // Find user by email or username
  User.FindByEmail(email, async function (err, user) {
    if (err) return res.status(500).render("login", { error: err.message });
    if (!user)
      return res
        .status(401)
        .render("login", { message: "Invalid credentials" });

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res
        .status(401)
        .render("login", { message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      id: user.id,
      email: user.email,
      username: user.username,
      token,
    });
  });
};

exports.LogOut = async (req, res) => {
  // Supprimer le cookie côté client
  res.clearCookie("token");
  // Rediriger vers la page de login
  return res.redirect("/auth/login");
};
