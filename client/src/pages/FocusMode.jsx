import React, { useState, useEffect, useRef } from 'react';

const FocusMode = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25 minutes
  const [cycles, setCycles] = useState(Number(localStorage.getItem('pomodoro_cycles') || 0));
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const start = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(true);
    
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          playSound();
          
          if (!isBreak) {
            // Fin du cycle de travail
            const newCycles = cycles + 1;
            setCycles(newCycles);
            localStorage.setItem('pomodoro_cycles', String(newCycles));
            setIsBreak(true);
            setSecondsLeft(breakDuration * 60);
            setIsRunning(false);
          } else {
            // Fin de la pause
            setIsBreak(false);
            setSecondsLeft(workDuration * 60);
            setIsRunning(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsBreak(false);
    setSecondsLeft(workDuration * 60);
  };

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  
  const progress = isBreak 
    ? ((breakDuration * 60 - secondsLeft) / (breakDuration * 60)) * 100
    : ((workDuration * 60 - secondsLeft) / (workDuration * 60)) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Focus Mode</h1>
        <p className="text-gray-600 mt-1">Technique Pomodoro pour une meilleure concentration</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timer principal */}
        <div className="lg:col-span-2">
          <div className={`card ${isBreak ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
            <div className="text-center">
              {/* Status */}
              <div className={`inline-block px-6 py-2 rounded-full text-sm font-medium mb-6 ${
                isBreak 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {isBreak ? '☕ Pause' : '💪 Travail'}
              </div>

              {/* Circular progress */}
              <div className="relative inline-block mb-6">
                <svg className="transform -rotate-90 w-64 h-64">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                    className={isBreak ? 'text-green-500' : 'text-blue-500'}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-mono font-bold text-gray-900">
                      {minutes}:{seconds}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contrôles */}
              <div className="flex justify-center gap-3 mt-6">
                {!isRunning ? (
                  <button 
                    onClick={start} 
                    className="btn btn-primary text-lg px-8 py-3"
                  >
                    {secondsLeft === workDuration * 60 && !isBreak ? '▶️ Démarrer' : '▶️ Reprendre'}
                  </button>
                ) : (
                  <button 
                    onClick={pause} 
                    className="btn text-lg px-8 py-3 bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    ⏸️ Pause
                  </button>
                )}
                <button 
                  onClick={reset} 
                  className="btn btn-secondary text-lg px-8 py-3"
                >
                  🔄 Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Paramètres et stats */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <h3 className="text-lg font-semibold mb-2 opacity-90">Cycles complétés</h3>
            <div className="text-5xl font-bold mb-2">{cycles}</div>
            <p className="text-sm opacity-75">
              🎯 {Math.floor(cycles * workDuration / 60)}h de travail focus
            </p>
          </div>

          {/* Paramètres */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">⚙️ Paramètres</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Durée travail (min)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="input"
                  value={workDuration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 25;
                    setWorkDuration(val);
                    if (!isRunning && !isBreak) setSecondsLeft(val * 60);
                  }}
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="label">Durée pause (min)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  className="input"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(parseInt(e.target.value) || 5)}
                  disabled={isRunning}
                />
              </div>
              <button
                onClick={() => {
                  if (confirm('Réinitialiser le compteur de cycles ?')) {
                    setCycles(0);
                    localStorage.setItem('pomodoro_cycles', '0');
                  }
                }}
                className="btn btn-secondary w-full text-sm"
              >
                Réinitialiser les cycles
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">💡 Technique Pomodoro</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Travaillez 25 min concentré</li>
              <li>• Prenez 5 min de pause</li>
              <li>• Répétez 4 fois</li>
              <li>• Pause longue de 15-30 min</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Audio pour la notification */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS56+ibUBALT6Lf8LdjHAU7ktfy0H0wBSd3x+/ejEEKE1yy6eyrWRkKRp7f8sBuJAUrfMvy2Ys4CBlmt+vmnlQRC06h3vC8Zh0FOI7V8tJ+MgUocsjw3Y9ECRJYr+nqsF4eCkWc3vHCciYFK3zH8Nr"
      />
    </div>
  );
};

export default FocusMode;
