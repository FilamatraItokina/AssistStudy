// Point d’entrée du backend Express
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const taskRoutes = require("./routes/task");
const noteRoutes = require("./routes/note");
const forumRoutes = require("./routes/forum");
const progressRoutes = require("./routes/progress");
const settingsRoutes = require("./routes/settings");
const { errorHandler } = require("./middleware/errorHandler");
const { initDB } = require("./config/database");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(bodyParser.json());

// Initialisation de la base de données
initDB();

// Routes principales
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/settings", settingsRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
