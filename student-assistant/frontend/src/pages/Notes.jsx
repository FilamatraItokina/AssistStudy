import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Notes() {
  const { token } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({
    subject: "",
    chapter: "",
    type: "",
    content: "",
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setNotes);
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      await fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
    }
    setForm({ subject: "", chapter: "", type: "", content: "" });
    fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setNotes);
  };

  const handleDelete = async (id) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(notes.filter((n) => n.id !== id));
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      n.chapter.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <h2>Notes & Révisions</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="subject"
          placeholder="Matière"
          value={form.subject}
          onChange={handleChange}
        />
        <input
          name="chapter"
          placeholder="Chapitre"
          value={form.chapter}
          onChange={handleChange}
        />
        <input
          name="type"
          placeholder="Type"
          value={form.type}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Contenu"
          value={form.content}
          onChange={handleChange}
          required
        />
        <button className="btn" type="submit">
          {editId ? "Modifier" : "Ajouter"}
        </button>
      </form>
      <input
        placeholder="Recherche..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ margin: "1em 0" }}
      />
      <ul>
        {filteredNotes.map((note) => (
          <li key={note.id} style={{ marginBottom: "0.5em" }}>
            <strong>{note.subject}</strong> - {note.chapter} ({note.type})<br />
            <span>{note.content}</span>
            <button
              className="btn"
              onClick={() => {
                setEditId(note.id);
                setForm(note);
              }}
            >
              Modifier
            </button>
            <button className="btn" onClick={() => handleDelete(note.id)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notes;
