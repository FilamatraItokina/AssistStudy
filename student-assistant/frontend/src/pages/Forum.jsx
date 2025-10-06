import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Forum() {
  const { token, user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [form, setForm] = useState({ category: "", title: "", content: "" });
  const [answerForm, setAnswerForm] = useState({ forum_id: "", content: "" });
  const [categories] = useState([
    "Maths",
    "Physique",
    "Français",
    "Histoire",
    "Autres",
  ]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/forum`)
      .then((res) => res.json())
      .then(setQuestions);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_API_URL}/api/forum`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    setForm({ category: "", title: "", content: "" });
    fetch(`${process.env.REACT_APP_API_URL}/api/forum`)
      .then((res) => res.json())
      .then(setQuestions);
  };

  const handleAnswerChange = (e) => {
    setAnswerForm({ ...answerForm, [e.target.name]: e.target.value });
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_API_URL}/api/forum/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(answerForm),
    });
    setAnswerForm({ forum_id: "", content: "" });
    fetch(
      `${process.env.REACT_APP_API_URL}/api/forum/${answerForm.forum_id}/answers`
    )
      .then((res) => res.json())
      .then((ans) => setAnswers((a) => ({ ...a, [answerForm.forum_id]: ans })));
  };

  const loadAnswers = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/forum/${id}/answers`)
      .then((res) => res.json())
      .then((ans) => setAnswers((a) => ({ ...a, [id]: ans })));
  };

  const handleDelete = async (id) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/forum/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="card">
      <h2>Forum étudiant</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Catégorie</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Question"
          value={form.content}
          onChange={handleChange}
          required
        />
        <button className="btn" type="submit">
          Poster
        </button>
      </form>
      <ul>
        {questions.map((q) => (
          <li key={q.id} style={{ marginBottom: "1em" }}>
            <strong>{q.category}</strong> - {q.title}
            <br />
            <span>{q.content}</span>
            <br />
            <small>Par {q.name}</small>
            {user && user.id === q.user_id && (
              <button className="btn" onClick={() => handleDelete(q.id)}>
                Supprimer
              </button>
            )}
            <button className="btn" onClick={() => loadAnswers(q.id)}>
              Voir réponses
            </button>
            <form onSubmit={handleAnswerSubmit} style={{ marginTop: "0.5em" }}>
              <input
                name="forum_id"
                type="hidden"
                value={q.id}
                onChange={handleAnswerChange}
              />
              <textarea
                name="content"
                placeholder="Répondre..."
                value={answerForm.forum_id === q.id ? answerForm.content : ""}
                onChange={(e) => {
                  handleAnswerChange(e);
                  setAnswerForm({ ...answerForm, forum_id: q.id });
                }}
              />
              <button className="btn" type="submit">
                Répondre
              </button>
            </form>
            <ul>
              {(answers[q.id] || []).map((a) => (
                <li key={a.id}>
                  <strong>{a.name}</strong> : {a.content}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Forum;
