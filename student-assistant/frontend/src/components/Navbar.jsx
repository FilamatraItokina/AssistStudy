import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav
      style={{
        padding: "1em",
        background: "var(--primary)",
        color: "#fff",
        display: "flex",
        gap: "1em",
      }}
    >
      <Link
        to="/"
        style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}
      >
        Accueil
      </Link>
      <Link to="/tasks" style={{ color: "#fff" }}>
        Tâches
      </Link>
      <Link to="/notes" style={{ color: "#fff" }}>
        Notes
      </Link>
      <Link to="/forum" style={{ color: "#fff" }}>
        Forum
      </Link>
      <Link to="/motivation" style={{ color: "#fff" }}>
        Motivation
      </Link>
      <Link to="/profile" style={{ color: "#fff" }}>
        Profil
      </Link>
      <Link to="/settings" style={{ color: "#fff" }}>
        Paramètres
      </Link>
      {user ? (
        <button className="btn" style={{ marginLeft: "auto" }} onClick={logout}>
          Déconnexion
        </button>
      ) : (
        <Link to="/login" style={{ marginLeft: "auto", color: "#fff" }}>
          Connexion
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
