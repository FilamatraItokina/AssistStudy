const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/auth/login");

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.redirect("/auth/login");

    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };

    console.log(req.user);
    next();
  });
};

module.exports = authMiddleware;
