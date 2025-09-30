import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ name: '', description: '', color: '#3B82F6' });
  const [editingCourseId, setEditingCourseId] = useState(null);
  
  const [noteText, setNoteText] = useState('');
  const [gradeForm, setGradeForm] = useState({ label: '', score: '', maxScore: 20, date: '' });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await api.get('/api/courses');
      setCourses(data);
    } catch (error) {
      console.error('Erreur chargement cours:', error);
    }
  };

  const loadCourseDetails = async (courseId) => {
    try {
      const data = await api.get(`/api/courses/${courseId}`);
      setSelectedCourse(data);
    } catch (error) {
      console.error('Erreur chargement détails:', error);
    }
  };

  const saveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourseId) {
        await api.put(`/api/courses/${editingCourseId}`, courseForm);
      } else {
        await api.post('/api/courses', courseForm);
      }
      resetCourseForm();
      loadCourses();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const deleteCourse = async (id) => {
    if (!confirm('Supprimer ce cours ?')) return;
    try {
      await api.delete(`/api/courses/${id}`);
      if (selectedCourse?.id === id) setSelectedCourse(null);
      loadCourses();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const addNote = async () => {
    if (!noteText.trim() || !selectedCourse) return;
    try {
      await api.post('/api/notes', { courseId: selectedCourse.id, content: noteText });
      setNoteText('');
      loadCourseDetails(selectedCourse.id);
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/api/notes/${id}`);
      loadCourseDetails(selectedCourse.id);
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const addGrade = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      await api.post('/api/grades', {
        courseId: selectedCourse.id,
        ...gradeForm,
        score: parseFloat(gradeForm.score),
        maxScore: parseFloat(gradeForm.maxScore)
      });
      setGradeForm({ label: '', score: '', maxScore: 20, date: '' });
      loadCourseDetails(selectedCourse.id);
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const resetCourseForm = () => {
    setCourseForm({ name: '', description: '', color: '#3B82F6' });
    setEditingCourseId(null);
    setShowCourseForm(false);
  };

  const startEditCourse = (course) => {
    setCourseForm({ name: course.name, description: course.description || '', color: course.color || '#3B82F6' });
    setEditingCourseId(course.id);
    setShowCourseForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cours</h1>
          <p className="text-gray-600 mt-1">Gérez vos cours, notes et examens</p>
        </div>
        <button onClick={() => setShowCourseForm(!showCourseForm)} className="btn btn-primary">
          {showCourseForm ? 'Annuler' : '+ Nouveau cours'}
        </button>
      </div>

      {/* Formulaire cours */}
      {showCourseForm && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">{editingCourseId ? 'Modifier le cours' : 'Nouveau cours'}</h2>
          <form onSubmit={saveCourse} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="label">Nom du cours *</label>
                <input
                  type="text"
                  className="input"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Description</label>
                <input
                  type="text"
                  className="input"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Couleur</label>
                <input
                  type="color"
                  className="input h-11"
                  value={courseForm.color}
                  onChange={(e) => setCourseForm({ ...courseForm, color: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingCourseId ? 'Enregistrer' : 'Ajouter'}
              </button>
              {editingCourseId && (
                <button type="button" onClick={resetCourseForm} className="btn btn-secondary">Annuler</button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Liste des cours */}
        <div className="card lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Mes cours</h2>
          {courses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun cours</p>
          ) : (
            <div className="space-y-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => loadCourseDetails(course.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCourse?.id === course.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: course.color }}></div>
                      <div>
                        <div className="font-bold">{course.name}</div>
                        {course.description && <div className="text-xs text-gray-600">{course.description}</div>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); startEditCourse(course); }} className="px-2 py-1 text-xs btn btn-secondary">✏️</button>
                      <button onClick={(e) => { e.stopPropagation(); deleteCourse(course.id); }} className="px-2 py-1 text-xs btn btn-danger">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Détails du cours */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedCourse ? (
            <div className="card text-center text-gray-500 py-16">
              Sélectionnez un cours pour voir les détails
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="card" style={{ borderLeft: `4px solid ${selectedCourse.color}` }}>
                <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
                {selectedCourse.description && <p className="text-gray-600 mt-1">{selectedCourse.description}</p>}
              </div>

              {/* Notes (texte) */}
              <div className="card">
                <h3 className="text-lg font-bold mb-3">Notes de cours</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    className="input"
                    placeholder="Écrire une note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addNote()}
                  />
                  <button onClick={addNote} className="btn btn-primary">Ajouter</button>
                </div>
                <div className="space-y-2">
                  {selectedCourse.notes?.map((note) => (
                    <div key={note.id} className="flex items-start justify-between bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm flex-1">{note.content}</p>
                      <button onClick={() => deleteNote(note.id)} className="btn btn-danger text-xs px-2 py-1 ml-2">🗑️</button>
                    </div>
                  ))}
                  {(!selectedCourse.notes || selectedCourse.notes.length === 0) && (
                    <p className="text-gray-500 text-center py-4 text-sm">Aucune note</p>
                  )}
                </div>
              </div>

              {/* Notes d'examens */}
              <div className="card">
                <h3 className="text-lg font-bold mb-3">Notes d'examens</h3>
                <form onSubmit={addGrade} className="grid md:grid-cols-5 gap-2 mb-4">
                  <input type="text" className="input" placeholder="Intitulé" value={gradeForm.label} onChange={(e) => setGradeForm({ ...gradeForm, label: e.target.value })} required />
                  <input type="number" step="0.01" className="input" placeholder="Note" value={gradeForm.score} onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })} required />
                  <input type="number" step="0.01" className="input" placeholder="Sur" value={gradeForm.maxScore} onChange={(e) => setGradeForm({ ...gradeForm, maxScore: e.target.value })} />
                  <input type="date" className="input" value={gradeForm.date} onChange={(e) => setGradeForm({ ...gradeForm, date: e.target.value })} />
                  <button type="submit" className="btn btn-primary">Ajouter</button>
                </form>
                <div className="space-y-2">
                  {selectedCourse.grades?.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium">{grade.label}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          {grade.date && `• ${new Date(grade.date).toLocaleDateString('fr-FR')}`}
                        </span>
                      </div>
                      <span className={`text-lg font-bold ${
                        (grade.score / grade.maxScore) * 20 >= 12 ? 'text-green-600' :
                        (grade.score / grade.maxScore) * 20 >= 10 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {grade.score}/{grade.maxScore}
                      </span>
                    </div>
                  ))}
                  {(!selectedCourse.grades || selectedCourse.grades.length === 0) && (
                    <p className="text-gray-500 text-center py-4 text-sm">Aucune note d'examen</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
