import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [progress, setProgress] = useState({ total: 0, done: 0 });
  const [quote, setQuote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/login");
    fetch(`${process.env.REACT_APP_API_URL}/api/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setProgress);
    // Citation de motivation locale
    const quotes = [
      "Le succès appartient à ceux qui persévèrent.",
      "Chaque jour est une nouvelle chance d’apprendre.",
      "Crois en toi et avance.",
      "La discipline est la clé de la réussite.",
      "N’abandonne jamais tes rêves.",
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [token, navigate]);

  return (
    <div className="card">
      <h2>Tableau de bord</h2>
      <p>Bienvenue, {user?.name} !</p>
      <div>
        <strong>Progression :</strong>
        <progress value={progress.done || 0} max={progress.total || 1} />
        <span>
          {progress.done || 0} / {progress.total || 0} tâches accomplies
        </span>
      </div>
      <blockquote style={{ marginTop: "1em", fontStyle: "italic" }}>
        {quote}
      </blockquote>
    </div>
  );
}

export default Dashboard;
