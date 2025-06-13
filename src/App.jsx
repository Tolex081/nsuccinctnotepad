// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import NoteDetails from './pages/NoteDetails';
import './index.css';

function App() {
  const [team, setTeam] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTeam = localStorage.getItem('succinct-team');
    const savedTheme = localStorage.getItem('succinct-theme') || 'light';
    if (savedTeam) {
      setTeam(JSON.parse(savedTeam));
    }
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleTeamSelect = (selectedTeam) => {
    setTeam(selectedTeam);
    localStorage.setItem('succinct-team', JSON.stringify(selectedTeam));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('succinct-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Router>
      <div className="app-container">
        <Header toggleTheme={toggleTheme} theme={theme} />
        <Routes>
          <Route
            path="/welcome"
            element={<Welcome onTeamSelect={handleTeamSelect} />}
          />
          <Route
            path="/"
            element={
              team ? (
                <Home team={team} theme={theme} />
              ) : (
                <Navigate to="/welcome" replace />
              )
            }
          />
          <Route
            path="/note/:id"
            element={
              team ? (
                <NoteDetails team={team} theme={theme} />
              ) : (
                <Navigate to="/welcome" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;