// src/pages/NoteDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Home.css';

function NoteDetails({ team, theme }) {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  const storageKey = `succinct-notes-${team.name.toLowerCase().replace(' ', '-')}-${theme}`;

  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      try {
        const notes = JSON.parse(savedNotes);
        const foundNote = notes.find((n) => n.id === parseInt(id));
        setNote(foundNote || null);
      } catch (error) {
        console.error(`Error parsing notes from ${storageKey}:`, error);
        setNote(null);
      }
    }
  }, [id, storageKey]);

  if (!note) {
    return (
      <div className="container">
        <p className="empty-message">Note not found.</p>
        <Link to="/" className="note-detail-link" style={{ color: team.color }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="note-detail" style={{ borderColor: team.color }}>
        <h2 style={{ color: team.color }}>{note.title}</h2>
        <p>{note.content}</p>
        <p className="timestamp">
          {note.updatedAt
            ? `Updated: ${new Date(note.updatedAt).toLocaleString()}`
            : `Created: ${new Date(note.createdAt).toLocaleString()}`}
        </p>
        <Link to="/" className="note-detail-link" style={{ color: team.color }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NoteDetails;