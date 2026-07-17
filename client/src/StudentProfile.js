import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import CFHeatmap from './components/CFHeatmap';

function StudentProfile() {
  const { handle: routeHandle } = useParams();
  const handle = decodeURIComponent(routeHandle);
  const [profile, setProfile] = useState(null);
  const [contestData, setContestData] = useState([]);
  const [problemData, setProblemData] = useState(null);
  const [contestFilter, setContestFilter] = useState(30);
  const [problemFilter, setProblemFilter] = useState(30);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setError('');
      setProfile(null);
      try {
        const [profileRes, contestRes, problemRes] = await Promise.all([
          axios.get(`/api/codeforces/profile/${encodeURIComponent(handle)}`),
          axios.get(`/api/codeforces/contests/${encodeURIComponent(handle)}?days=${contestFilter}`),
          axios.get(`/api/codeforces/problems/${encodeURIComponent(handle)}?days=${problemFilter}`),
        ]);

        if (!active) return;
        setProfile(profileRes.data);
        setContestData(contestRes.data);
        setProblemData(problemRes.data);
      } catch (err) {
        if (!active) return;
        setError(err.response?.data?.error || 'We could not load that Codeforces profile. Check the username and try again.');
      }
    };

    loadProfile();
    return () => { active = false; };
  }, [handle, contestFilter, problemFilter]);

  if (error) {
    return (
      <main className="profile-page">
        <Link className="back-link" to="/">← Search another handle</Link>
        <div className="status-card error-card" role="alert">{error}</div>
      </main>
    );
  }

  if (!profile || !problemData) {
    return <main className="profile-page"><div className="status-card">Loading {handle}&rsquo;s Codeforces data…</div></main>;
  }

  const profileUrl = `https://codeforces.com/profile/${profile.handle}`;
  const title = profile.firstName || profile.lastName
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
    : profile.handle;

  return (
    <main className="profile-page">
      <Link className="back-link" to="/">← Search another handle</Link>

      <header className="profile-header">
        <div>
          <p className="eyebrow">CODEFORCES PROFILE</p>
          <h1>{title}</h1>
          <a href={profileUrl} target="_blank" rel="noreferrer">@{profile.handle} ↗</a>
          {(profile.city || profile.country) && <p>{[profile.city, profile.country].filter(Boolean).join(', ')}</p>}
        </div>
        <div className="rating-summary">
          <div><span>Current rating</span><strong>{profile.rating ?? 'Unrated'}</strong></div>
          <div><span>Maximum rating</span><strong>{profile.maxRating ?? '—'}</strong></div>
          <div><span>Rank</span><strong>{profile.rank || 'Unrated'}</strong></div>
        </div>
      </header>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <div className="section-heading">
            <div><h2>Contest activity</h2><p>Rating changes and results</p></div>
            <select value={contestFilter} onChange={(event) => setContestFilter(Number(event.target.value))} aria-label="Contest time range">
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>
          {contestData.length ? (
            <>
              <Line data={{
                labels: contestData.map((contest) => contest.contestName),
                datasets: [{ label: 'Rating', data: contestData.map((contest) => contest.newRating), borderColor: '#4f46e5', backgroundColor: '#4f46e5', tension: 0.25 }],
              }} options={{ plugins: { legend: { display: false } }, scales: { x: { ticks: { display: false } } } }} />
              <div className="table-scroll"><table><thead><tr><th>Contest</th><th>Rank</th><th>Rating</th><th>Solved</th></tr></thead><tbody>{contestData.slice().reverse().map((contest) => <tr key={contest.contestId}><td>{contest.contestName}</td><td>{contest.rank}</td><td>{contest.oldRating} → {contest.newRating}</td><td>{contest.solvedCount}</td></tr>)}</tbody></table></div>
            </>
          ) : <p className="empty-state">No rated contests found for this time range.</p>}
        </div>

        <div className="dashboard-card">
          <div className="section-heading">
            <div><h2>Problem solving</h2><p>Unique accepted problems</p></div>
            <select value={problemFilter} onChange={(event) => setProblemFilter(Number(event.target.value))} aria-label="Problem time range">
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          {problemData.totalSolved ? <>
            <Bar data={{ labels: Object.keys(problemData.ratingBuckets), datasets: [{ label: 'Problems solved', data: Object.values(problemData.ratingBuckets), backgroundColor: '#10b981', borderRadius: 5 }] }} options={{ plugins: { legend: { display: false } } }} />
            <div className="stat-grid">
              <div><span>Solved</span><strong>{problemData.totalSolved}</strong></div>
              <div><span>Average rating</span><strong>{problemData.avgRating}</strong></div>
              <div><span>Per day</span><strong>{problemData.avgPerDay}</strong></div>
              <div><span>Hardest</span><strong>{problemData.hardestProblem.name ? `${problemData.hardestProblem.name} (${problemData.hardestProblem.rating})` : '—'}</strong></div>
            </div>
          </> : <p className="empty-state">No rated problems solved in this time range.</p>}
        </div>

        <div className="dashboard-card heatmap-card">
          <div className="section-heading"><div><h2>Submission heatmap</h2><p>Accepted submissions from the last year</p></div></div>
          <CFHeatmap handle={profile.handle} />
        </div>
      </section>
    </main>
  );
}

export default StudentProfile;
