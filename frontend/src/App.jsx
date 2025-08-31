import React, { useEffect, useMemo, useState } from 'react';
import { api } from './services/api';
import Profile from './components/Profile';
import ProjectList from './components/ProjectList';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [skill, setSkill] = useState('');
  const [q, setQ] = useState('');
  const [searchRes, setSearchRes] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    async function boot() {
      try {
        setLoading(true);
        const [prof, skills] = await Promise.all([
          api.getProfile().catch(() => null),
          api.getTopSkills(10),
        ]);
        setProfile(prof);
        setTopSkills(skills);
        const initial = await api.getProjects({});
        setProjects(initial);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }
    boot();
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setErr('');
        const list = await api.getProjects({ skill: skill || undefined });
        if (!cancelled) setProjects(list);
      } catch (e) {
        if (!cancelled) setErr(e.message);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [skill]);

  async function handleReset() {
    setSkill('');
    setQ('');
    setSearchRes(null);
    try {
      setErr('');
      const list = await api.getProjects({});
      setProjects(list);
      const skills = await api.getTopSkills(10);
      setTopSkills(skills);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function handleSearch() {
    try {
      setErr('');
      const res = await api.search(q);
      setSearchRes(res);
    } catch (e) {
      setErr(e.message);
    }
  }

  const skillOptions = useMemo(() => topSkills.map((s) => s.skill), [topSkills]);

  return (
    <div className="container">
      <div className="header">
        <h1 style={{ margin: 0 }}>Candidate Playground</h1>
        <span className="small">API: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:4002'}</span>
      </div>

      {err && <div className="card" style={{ borderColor: '#7f1d1d' }}>{err}</div>}

      {loading ? (
        <div className="card">Loading...</div>
      ) : (
        <>
          <Profile profile={profile} />

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Filter Projects by Skill</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select value={skill} onChange={(e) => setSkill(e.target.value)}>
                <option value="">-- any skill --</option>
                {skillOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button className="button" onClick={handleReset}>Reset</button>
              <button className="button" onClick={handleReset}>Refresh</button>
            </div>
          </div>

          <ProjectList projects={projects} />

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Search (profile + projects)</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="e.g. react or express" value={q} onChange={(e) => setQ(e.target.value)} />
              <button className="button" onClick={handleSearch} disabled={!q.trim()}>Search</button>
            </div>
            {searchRes && (
              <div style={{ marginTop: 12 }}>
                <div className="small">Found {searchRes.projects?.length || 0} projects{searchRes.profile ? ' + profile match' : ''}.</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
