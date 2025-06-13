import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';
import allTeam from '../assets/all-team.png'; // New PNG

function Welcome({ onTeamSelect }) {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState('');

  const teams = [
    { name: 'Pink Team', color: '#FF54D7' },
    { name: 'Blue Team', color: '#61C3FF' },
    { name: 'Green Team', color: '#B0FF6F' },
    { name: 'Orange Team', color: '#FF955E' },
    { name: 'Purple Team', color: '#B753FF' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTeam) return;
    const team = teams.find((t) => t.name === selectedTeam);
    onTeamSelect(team);
    navigate('/');
  };

  return (
    <div className="welcome-container">
      <img src={allTeam} alt="All Teams" className="all-team" />
      <h2>Succinct Notepad</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="">Choose your team</option>
          {teams.map((team) => (
            <option key={team.name} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={!selectedTeam}>
          Enter
        </button>
      </form>
    </div>
  );
}

export default Welcome;