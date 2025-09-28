const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", auth.Register);
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/login", auth.Login);
router.get("/login", (req, res) => {
  res.render("login");
});

// Page compte utilisateur (protégée)
router.get("/account",  authMiddleware, (req, res) => {
  console.log({ user: req.user });
  res.render("account", { user: req.user });
});

// Déconnexion
router.post("/logout", auth.LogOut);

module.exports = router;
