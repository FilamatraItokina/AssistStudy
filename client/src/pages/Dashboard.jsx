import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [averages, setAverages] = useState({ byCourse: [], overall: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [tasksData, coursesData, averagesData] = await Promise.all([
        api.get('/api/tasks'),
        api.get('/api/courses'),
        api.get('/api/grades/averages')
      ]);
      
      setTasks(tasksData.filter(t => !t.completed).slice(0, 5));
      setCourses(coursesData.slice(0, 6));
      setAverages(averagesData);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble de vos activités</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tâches en cours</p>
              <p className="text-3xl font-bold mt-1">{tasks.length}</p>
            </div>
            <div className="text-5xl opacity-20">✓</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Cours actifs</p>
              <p className="text-3xl font-bold mt-1">{courses.length}</p>
            </div>
            <div className="text-5xl opacity-20">📚</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Moyenne générale</p>
              <p className="text-3xl font-bold mt-1">
                {averages.overall ? `${averages.overall}/20` : '-'}
              </p>
            </div>
            <div className="text-5xl opacity-20">📈</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tâches à venir */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Tâches à venir</h2>
            <Link to="/tasks" className="text-primary-600 hover:underline text-sm font-medium">
              Voir tout →
            </Link>
          </div>
          
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune tâche en cours</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-3 hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                        {task.deadline && (
                          <span className="text-gray-500">
                            📅 {new Date(task.deadline).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Moyennes par cours */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Moyennes par cours</h2>
            <Link to="/progress" className="text-primary-600 hover:underline text-sm font-medium">
              Détails →
            </Link>
          </div>
          
          {averages.byCourse.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune note enregistrée</p>
          ) : (
            <div className="space-y-3">
              {averages.byCourse.map((item) => (
                <div key={item.courseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">{item.courseName}</span>
                  <span className={`text-lg font-bold ${
                    item.average >= 12 ? 'text-green-600' :
                    item.average >= 10 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {item.average}/20
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mes cours */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Mes cours</h2>
          <Link to="/courses" className="text-primary-600 hover:underline text-sm font-medium">
            Gérer →
          </Link>
        </div>
        
        {courses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucun cours ajouté</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow"
                style={{ borderColor: course.color }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{course.name}</h3>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: course.color }}></div>
                </div>
                {course.description && (
                  <p className="text-sm text-gray-600">{course.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
