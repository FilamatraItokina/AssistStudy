import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Progress = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [grades, setGrades] = useState([]);
  const [averages, setAverages] = useState({ byCourse: [], overall: null });
  const [cycles, setCycles] = useState(Number(localStorage.getItem('pomodoro_cycles') || 0));

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadCourseGrades(selectedCourseId);
    } else {
      setGrades([]);
    }
  }, [selectedCourseId]);

  const loadData = async () => {
    try {
      const [coursesData, averagesData] = await Promise.all([
        api.get('/api/courses'),
        api.get('/api/grades/averages')
      ]);
      setCourses(coursesData);
      setAverages(averagesData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  const loadCourseGrades = async (courseId) => {
    try {
      const data = await api.get(`/api/grades/course/${courseId}`);
      setGrades(data);
    } catch (error) {
      console.error('Erreur chargement notes:', error);
    }
  };

  // Préparation données pour le graphique linéaire
  const chartData = grades
    .filter(g => g.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(g => ({
      date: new Date(g.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      note: Math.round((g.score / g.maxScore) * 20 * 100) / 100,
      label: g.label
    }));

  // Préparation données pour le bar chart des moyennes
  const averagesChartData = averages.byCourse.map(item => ({
    cours: item.courseName.length > 15 ? item.courseName.substring(0, 15) + '...' : item.courseName,
    moyenne: item.average
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Progrès</h1>
        <p className="text-gray-600 mt-1">Suivez votre évolution académique</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Moyenne générale</p>
              <p className="text-4xl font-bold mt-1">
                {averages.overall ? `${averages.overall}/20` : '-'}
              </p>
            </div>
            <div className="text-5xl opacity-20">📊</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Cours suivis</p>
              <p className="text-4xl font-bold mt-1">{courses.length}</p>
            </div>
            <div className="text-5xl opacity-20">📚</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Cycles Pomodoro</p>
              <p className="text-4xl font-bold mt-1">{cycles}</p>
            </div>
            <div className="text-5xl opacity-20">🎯</div>
          </div>
        </div>
      </div>

      {/* Moyennes par cours - Bar Chart */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Moyennes par cours</h2>
        {averagesChartData.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Aucune donnée disponible</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={averagesChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cours" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 20]} />
              <Tooltip />
              <Bar dataKey="moyenne" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {/* Liste détaillée */}
        <div className="mt-6 grid md:grid-cols-2 gap-3">
          {averages.byCourse.map((item) => (
            <div key={item.courseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-800">{item.courseName}</span>
              <span className={`text-lg font-bold px-3 py-1 rounded-full ${
                item.average >= 12 ? 'bg-green-100 text-green-700' :
                item.average >= 10 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {item.average}/20
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Évolution par cours - Line Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Évolution des notes</h2>
          <select
            className="input !w-auto"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">Sélectionner un cours...</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {!selectedCourseId ? (
          <p className="text-center text-gray-500 py-8">Sélectionnez un cours pour voir l'évolution</p>
        ) : chartData.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Aucune note avec date pour ce cours</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 20]} />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border rounded shadow">
                      <p className="font-bold">{payload[0].payload.label}</p>
                      <p className="text-sm text-gray-600">{payload[0].payload.date}</p>
                      <p className="text-primary-600 font-bold">{payload[0].value}/20</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="note" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 5 }}
                activeDot={{ r: 7 }}
                name="Note sur 20"
              />
              {/* Ligne de référence moyenne */}
              <Line 
                type="monotone" 
                dataKey={() => 10} 
                stroke="#EF4444" 
                strokeDasharray="5 5"
                dot={false}
                name="Seuil (10/20)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Analyse */}
      {selectedCourseId && chartData.length > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">📊 Analyse</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Meilleure note</p>
              <p className="text-2xl font-bold text-blue-900">
                {Math.max(...chartData.map(d => d.note))}/20
              </p>
            </div>
            <div>
              <p className="text-blue-700">Note la plus basse</p>
              <p className="text-2xl font-bold text-blue-900">
                {Math.min(...chartData.map(d => d.note))}/20
              </p>
            </div>
            <div>
              <p className="text-blue-700">Progression</p>
              <p className="text-2xl font-bold text-blue-900">
                {chartData.length > 1 
                  ? `${(chartData[chartData.length - 1].note - chartData[0].note > 0 ? '+' : '')}${(chartData[chartData.length - 1].note - chartData[0].note).toFixed(1)}`
                  : '-'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
