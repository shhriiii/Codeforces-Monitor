import './studentList.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentList() {
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const openProfile = (event) => {
    event.preventDefault();
    const cleanHandle = handle.trim();

    if (!cleanHandle) {
      setError('Enter a Codeforces handle to continue.');
      return;
    }

    setError('');
    navigate(`/profile/${encodeURIComponent(cleanHandle)}`);
  };

  return (
    <main className="home-page">
      <section className="home-card">
        <p className="eyebrow">LIVE CODEFORCES INSIGHTS</p>
        <h1>Codeforces Progress Tracker</h1>
        <p className="home-copy">
          Look up any public Codeforces profile to see rating, contest history,
          solved-problem trends, and a submission heatmap.
        </p>

        <form className="handle-form" onSubmit={openProfile}>
          <label htmlFor="codeforces-handle">Codeforces username</label>
          <div className="handle-input-row">
            <input
              id="codeforces-handle"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder="e.g. tourist"
              autoComplete="off"
              autoFocus
            />
            <button type="submit">View progress</button>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>

        <p className="home-note">No account, student list, CSV download, or database required.</p>
      </section>
    </main>
  );
}

export default StudentList;
