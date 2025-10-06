// Middleware de gestion des erreurs globales
function errorHandler(err, req, res, next) {
  console.error("Erreur:", err);
  res.status(err.status || 500).json({
    error: err.message || "Erreur serveur",
  });
}

module.exports = { errorHandler };
