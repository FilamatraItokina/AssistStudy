import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: ''
  });

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      const url = filter !== 'all' ? `/api/tasks?priority=${filter}` : '/api/tasks';
      const data = await api.get(url);
      setTasks(data);
    } catch (error) {
      console.error('Erreur chargement tâches:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/api/tasks/${editingTask.id}`, formData);
      } else {
        await api.post('/api/tasks', formData);
      }
      resetForm();
      loadTasks();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await api.put(`/api/tasks/${task.id}`, { completed: !task.completed });
      loadTasks();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const deleteTask = async (id) => {
    if (!confirm('Supprimer cette tâche ?')) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      loadTasks();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      deadline: task.deadline ? task.deadline.substring(0, 10) : ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', priority: 'medium', deadline: '' });
    setEditingTask(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tâches</h1>
          <p className="text-gray-600 mt-1">Gérez vos tâches et deadlines</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Annuler' : '+ Nouvelle tâche'}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">
            {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Titre *</label>
              <input
                type="text"
                className="input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                className="input"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Priorité</label>
                <select
                  className="input"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>

              <div>
                <label className="label">Échéance</label>
                <input
                  type="date"
                  className="input"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingTask ? 'Enregistrer' : 'Ajouter'}
              </button>
              {editingTask && (
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Filtres */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`btn ${filter === 'high' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Priorité haute
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`btn ${filter === 'medium' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Priorité moyenne
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`btn ${filter === 'low' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Priorité basse
        </button>
      </div>

      {/* Liste des tâches */}
      <div className="card">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Aucune tâche trouvée</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  task.completed ? 'bg-gray-50 border-gray-200' : 'border-gray-300 hover:border-primary-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task)}
                    className="mt-1 w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                  />
                  
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </span>
                      {task.deadline && (
                        <span className="text-sm text-gray-500">
                          📅 {new Date(task.deadline).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(task)}
                      className="px-3 py-2 text-sm btn btn-secondary"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-2 text-sm btn btn-danger"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
