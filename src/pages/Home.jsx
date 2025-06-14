import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShare2, FiDownload } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import pinkImage from '../assets/pink.png';
import blueImage from '../assets/blue.png';
import purpleImage from '../assets/purple.png';
import greenImage from '../assets/green.png';
import orangeImage from '../assets/orange.png';
import succinctLogo from '../assets/succinct-logo.png';
import './Home.css';

function Home({ team, theme }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const noteRefs = useRef({});

  const teamImages = {
    'Pink Team': pinkImage,
    'Blue Team': blueImage,
    'Purple Team': purpleImage,
    'Green Team': greenImage,
    'Orange Team': orangeImage,
  };

  const storageKey = `succinct-notes-${team.name.toLowerCase().replace(' ', '-')}-${theme}`;

  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error(`Error parsing notes from ${storageKey}:`, error);
        setNotes([]);
      }
    }
  }, [storageKey]);

  const saveNotes = (updatedNotes) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error(`Error saving notes to ${storageKey}:`, error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const note = {
      id: editingNote ? editingNote.id : Date.now(),
      title,
      content,
      createdAt: editingNote ? editingNote.createdAt : new Date().toISOString(),
      updatedAt: editingNote ? new Date().toISOString() : undefined,
    };

    let updatedNotes;
    if (editingNote) {
      updatedNotes = notes.map((n) => (n.id === note.id ? note : n));
    } else {
      updatedNotes = [note, ...notes];
    }

    saveNotes(updatedNotes);
    setEditingNote(null);
    setTitle('');
    setContent('');
  };

  const startEditing = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    saveNotes(updatedNotes);
  };

  const captureScreenshot = async (noteId) => {
    const noteElement = noteRefs.current[noteId];
    if (!noteElement) {
      console.error('Note element not found for ID:', noteId);
      return null;
    }

    try {
      const screenshotElement = noteElement.querySelector('.screenshot-text');
      if (!screenshotElement) {
        console.error('Screenshot element not found for note ID:', noteId);
        return null;
      }

      // Temporarily make screenshot element visible for rendering
      screenshotElement.style.visibility = 'visible';
      screenshotElement.style.position = 'absolute';
      screenshotElement.style.top = '-9999px';
      screenshotElement.style.left = '-9999px';

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(screenshotElement, {
        scale: 2,
        backgroundColor: '#2e3b4e',
        logging: true,
      });

      // Restore original styles
      screenshotElement.style.visibility = 'hidden';
      screenshotElement.style.position = 'absolute';
      screenshotElement.style.top = '-9999px';
      screenshotElement.style.left = '-9999px';

      const dataUrl = canvas.toDataURL('image/png');
      if (!dataUrl || dataUrl === 'data:,') {
        console.error('Generated canvas is empty');
        return null;
      }

      return dataUrl;
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      return null;
    }
  };

  const shareNote = async (noteId) => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const shareText = 'Gprove, check out my Succinct to do list for today create yours at https://succinctnotepad.vercel.app';

    if (isMobile && navigator.share) {
      // Mobile: Share both image and text via Web Share API
      const imageDataUrl = await captureScreenshot(noteId);
      if (!imageDataUrl) {
        alert('Failed to capture screenshot. Sharing text only.');
        try {
          await navigator.share({ text: shareText });
          console.log('Shared text only via Web Share API');
        } catch (error) {
          console.error('Error sharing text:', error);
          alert('Failed to share text.');
          const tweetText = encodeURIComponent(shareText);
          const tweetUrl = `https://x.com/compose/post?text=${tweetText}`;
          console.log('Opening X compose URL (text fallback):', tweetUrl);
          window.open(tweetUrl, '_blank');
        }
        return;
      }

      try {
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'task.png', { type: 'image/png' });
        const shareData = {
          title: 'Succinct Notepad Task',
          text: shareText,
          files: [file],
        };

        await navigator.share(shareData);
        console.log('Shared text and image via Web Share API');
      } catch (error) {
        console.error('Error sharing image and text:', error);
        alert('Failed to share image. Sharing text only.');
        try {
          await navigator.share({ text: shareText });
          console.log('Shared text only via Web Share API (error fallback)');
        } catch (err) {
          console.error('Error sharing text:', err);
          alert('Failed to share text.');
          const tweetText = encodeURIComponent(shareText);
          const tweetUrl = `https://x.com/compose/post?text=${tweetText}`;
          console.log('Opening X compose URL (error fallback):', tweetUrl);
          window.open(tweetUrl, '_blank');
        }
      }
    } else {
      // Desktop: Share text only via X compose page
      try {
        const tweetText = encodeURIComponent(shareText);
        const tweetUrl = `https://x.com/compose/post?text=${tweetText}`;
        console.log('Opening X compose URL (desktop):', tweetUrl);
        window.open(tweetUrl, '_blank');
      } catch (error) {
        console.error('Error sharing note:', error);
        alert('Failed to open X post page. Please check your network or try again.');
      }
    }
  };

  const downloadNote = async (noteId, noteTitle) => {
    const imageDataUrl = await captureScreenshot(noteId);
    if (!imageDataUrl) {
      alert('Failed to download screenshot.');
      return;
    }

    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = `${noteTitle}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-content">
          <h2 style={{ color: team.color }}>
            {editingNote ? 'Edit Task' : 'Add New Task'}
          </h2>
          <input
            type="text"
            placeholder="Task Title (e.g., Succinct Daily Task)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ borderColor: team.color }}
          />
          <textarea
            placeholder="Write your daily task..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            style={{ borderColor: team.color }}
          />
          <button type="submit" style={{ backgroundColor: team.color }}>
            Save
          </button>
        </div>
        <img
          src={teamImages[team.name]}
          alt={`${team.name}`}
          className="team-image"
        />
      </form>

      <div className="note-list">
        {notes.length === 0 && (
          <p className="empty-message">No tasks yet. Add one above!</p>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-card"
            style={{ borderColor: team.color }}
            ref={(el) => (noteRefs.current[note.id] = el)}
          >
            <h2 style={{ color: team.color }}>
              <Link to={`/note/${note.id}`} style={{ color: team.color }}>
                {note.title}
              </Link>
            </h2>
            <p>{note.content}</p>
            <p className="timestamp">
              {note.updatedAt
                ? `Updated: ${new Date(note.updatedAt).toLocaleString()}`
                : `Created: ${new Date(note.createdAt).toLocaleString()}`}
            </p>
            <div className="screenshot-text">
              <h2 style={{ color: team.color }}>{note.title}</h2>
              {note.content.split('\n').map((item, index) => (
                <p key={index}>{item}</p>
              ))}
              <img
                src={succinctLogo}
                alt="Succinct Logo"
                className="logo-screenshot"
              />
            </div>
            <div className="button-group">
              <button
                className="edit-button"
                onClick={() => startEditing(note)}
                style={{ backgroundColor: team.color }}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => deleteNote(note.id)}
              >
                <FiTrash2 />
              </button>
              <button
                className="share-button"
                onClick={() => shareNote(note.id)}
              >
                <FiShare2 />
              </button>
              <button
                className="download-button"
                onClick={() => downloadNote(note.id, note.title)}
              >
                <FiDownload />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
