const Task = require("../models/task.model");

exports.addTask = (req, res) => {
  const user_id = req.user.id;
  const { title, category, subject_id, desc, priority } = req.body;
  console.log("Body: " + JSON.stringify(req.body));
  if (!title || !category || !priority)
    return res.status(400).json({ message: "All infos required" });

  Task.Create(
    title,
    category,
    subject_id,
    user_id,
    desc,
    priority,
    function (err, result) {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json({ message: "Task Added", result });
    }
  );
};

exports.readAll = (req, res) => {
  const user_id = req.user.id;
  Task.readAll(user_id, (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    if (tasks.length === 0)
      return res.status(404).json({ message: "No task found" });

    return res.status(200).json(tasks);
  });
};

exports.readBySubject = (req, res) => {
  const user_id = req.user.id;
  const sub_id = req.subject.id;

  Task.ReadBySub(user_id, sub_id, (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    if (tasks.length === 0)
      return res.status(404).json({ message: "No task found" });

    return res.status(200).json(tasks);
  });
};

exports.readByPrio = (req, res) => {
  const userId = req.user.id;
  const priority = req.body;

  if (!priority) return res.status(400).json({ message: "Info required" });

  Task.ReadByPriority(userId, priority, (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    if (tasks.length === 0)
      return res.status(404).json({ message: "No task found" });

    return res.status(200).json(tasks);
  });
};

exports.prioInSub = (req, res) => {
  const userId = req.user.id;
  const subId = req.subject.id;
  const priority = req.body;

  Task.ByPrioInSub(userId, subId, priority, (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    if (tasks.length === 0)
      return res.status(404).json({ message: "No task found" });

    return res.status(200).json(tasks);
  });
};

exports.updateTask = (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const { title, category, priority, desc, subject_id } = req.body;

  if (!title || !category || !priority) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  Task.UpdateTask(
    title,
    category,
    priority,
    desc,
    subject_id,
    userId,
    taskId,
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ message: "Task updated successfully" });
    }
  );
};

exports.deleteTask = (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  Task.DeleteTask(userId, taskId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json({ message: "Task deleted successfully" });
  });
};
