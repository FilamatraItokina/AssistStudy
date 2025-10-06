function TaskList({ tasks, onEdit, onDelete, onComplete }) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} style={{ marginBottom: "0.5em" }}>
          <span
            style={{ textDecoration: task.completed ? "line-through" : "none" }}
          >
            {task.title} ({task.subject}) - {task.due_date}
          </span>
          <button className="btn" onClick={() => onEdit(task)}>
            Modifier
          </button>
          <button className="btn" onClick={() => onDelete(task.id)}>
            Supprimer
          </button>
          <button
            className="btn"
            onClick={() => onComplete(task.id, task.completed)}
          >
            {task.completed ? "Marquer en cours" : "Terminer"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
