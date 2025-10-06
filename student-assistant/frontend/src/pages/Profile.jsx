import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(user);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setProfile);
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      }
    );
    if (res.ok) setMessage("Profil mis à jour !");
    else setMessage("Erreur lors de la mise à jour.");
  };

  return (
    <div className="card">
      <h2>Profil étudiant</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={profile?.name || ""}
          onChange={handleChange}
          placeholder="Nom"
        />
        <input
          name="field"
          value={profile?.field || ""}
          onChange={handleChange}
          placeholder="Filière"
        />
        <input
          name="level"
          value={profile?.level || ""}
          onChange={handleChange}
          placeholder="Niveau"
        />
        <input
          name="goals"
          value={profile?.goals || ""}
          onChange={handleChange}
          placeholder="Objectifs"
        />
        <button className="btn" type="submit">
          Mettre à jour
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;
