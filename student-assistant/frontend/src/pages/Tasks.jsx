import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Tasks() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", subject: "", due_date: "" });
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setTasks);
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
    }
    setForm({ title: "", subject: "", due_date: "" });
    fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setTasks);
  };

  const handleDelete = async (id) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleComplete = async (id, completed) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...tasks.find((t) => t.id === id),
        completed: !completed,
      }),
    });
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "done") return t.completed;
    if (filter === "todo") return !t.completed;
    if (filter === "subject") return t.subject === form.subject;
    return true;
  });

  return (
    <div className="card">
      <h2>Gestionnaire de tâches</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="subject"
          placeholder="Matière"
          value={form.subject}
          onChange={handleChange}
        />
        <input
          name="due_date"
          type="date"
          value={form.due_date}
          onChange={handleChange}
        />
        <button className="btn" type="submit">
          {editId ? "Modifier" : "Ajouter"}
        </button>
      </form>
      <div style={{ margin: "1em 0" }}>
        <button className="btn" onClick={() => setFilter("all")}>
          Toutes
        </button>
        <button className="btn" onClick={() => setFilter("done")}>
          Terminées
        </button>
        <button className="btn" onClick={() => setFilter("todo")}>
          En cours
        </button>
        <button className="btn" onClick={() => setFilter("subject")}>
          Par matière
        </button>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} style={{ marginBottom: "0.5em" }}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title} ({task.subject}) - {task.due_date}
            </span>
            <button
              className="btn"
              onClick={() => {
                setEditId(task.id);
                setForm(task);
              }}
            >
              Modifier
            </button>
            <button className="btn" onClick={() => handleDelete(task.id)}>
              Supprimer
            </button>
            <button
              className="btn"
              onClick={() => handleComplete(task.id, task.completed)}
            >
              {task.completed ? "Marquer en cours" : "Terminer"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
