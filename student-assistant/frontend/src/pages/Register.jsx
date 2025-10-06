import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    field: "",
    level: "",
    goals: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (res.ok) {
        navigate("/login");
      } else {
        setError(data.error || "Erreur d’inscription");
      }
    } catch {
      setError("Erreur serveur");
    }
  };

  return (
    <div className="card">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="field"
          placeholder="Filière"
          value={form.field}
          onChange={handleChange}
        />
        <input
          name="level"
          placeholder="Niveau"
          value={form.level}
          onChange={handleChange}
        />
        <input
          name="goals"
          placeholder="Objectifs"
          value={form.goals}
          onChange={handleChange}
        />
        <button className="btn" type="submit">
          S’inscrire
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Register;
