import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

function Settings() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { token, logout } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    if (!window.confirm("Confirmer la réinitialisation des données ?")) return;
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/settings/reset`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      setMessage("Données réinitialisées !");
      logout();
    } else {
      setMessage("Erreur lors de la réinitialisation.");
    }
  };

  return (
    <div className="card">
      <h2>Paramètres</h2>
      <button className="btn" onClick={toggleTheme}>
        Mode {theme === "light" ? "sombre" : "clair"}
      </button>
      <button
        className="btn"
        style={{ marginLeft: "1em" }}
        onClick={handleReset}
      >
        Réinitialiser mes données
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Settings;
