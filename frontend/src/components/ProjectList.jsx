import React from 'react';

export default function ProjectList({ projects }) {
  if (!projects || projects.length === 0) return (
    <div className="card">No projects found.</div>
  );

  return (
    <div className="grid">
      {projects.map((p) => (
        <div key={p._id || p.title} className="card">
          <h3 style={{ marginTop: 0 }}>{p.title}</h3>
          {p.description && <p>{p.description}</p>}
          {p.skills?.length ? (
            <div style={{ marginTop: 6 }}>
              {p.skills.map((s) => (
                <span key={s} className="badge">{s}</span>
              ))}
            </div>
          ) : null}
          {p.links?.length ? (
            <p style={{ marginTop: 8 }}>
              {p.links.map((l, i) => (
                <span key={i}>
                  <a href={l} target="_blank" rel="noreferrer">Link {i + 1}</a>{' '}
                </span>
              ))}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
