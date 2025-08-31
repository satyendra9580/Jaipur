import React from 'react';

export default function Profile({ profile }) {
  if (!profile) return null;
  const { name, email, summary, skills = [], links = {}, education = [], work = [] } = profile;
  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{name}</h2>
      <div className="small">{email}</div>
      {summary && <p>{summary}</p>}
      {links && (
        <p>
          {links.github && (
            <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
          )}
          {links.linkedin && (
            <>
              {' | '}
              <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </>
          )}
          {links.portfolio && (
            <>
              {' | '}
              <a href={links.portfolio} target="_blank" rel="noreferrer">Portfolio</a>
            </>
          )}
        </p>
      )}
      {skills.length > 0 && (
        <div>
          {skills.map((s) => (
            <span key={s} className="badge">{s}</span>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <h4 style={{ margin: 0 }}>Education</h4>
          <ul style={{ margin: '6px 0 0 16px' }}>
            {education.map((e, i) => (
              <li key={i}>
                <strong>{e.degree}</strong> @ {e.institution}
                {typeof e.startYear === 'number' && (
                  <span className="small"> {' '}({e.startYear}{e.endYear ? ` - ${e.endYear}` : ''})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {work.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <h4 style={{ margin: 0 }}>Work</h4>
          <div style={{ display: 'grid', gap: 8, marginTop: 6 }}>
            {work.map((w, i) => (
              <div key={i} className="card" style={{ padding: 8 }}>
                <div style={{ fontWeight: 600 }}>{w.title} @ {w.company}</div>
                {(w.startDate || w.endDate) && (
                  <div className="small">
                    {w.startDate ? new Date(w.startDate).toLocaleDateString() : '—'}
                    {' - '}
                    {w.endDate ? new Date(w.endDate).toLocaleDateString() : 'Present'}
                  </div>
                )}
                {w.description && <div style={{ marginTop: 4 }}>{w.description}</div>}
                {Array.isArray(w.skills) && w.skills.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    {w.skills.map((s) => (
                      <span key={s} className="badge">{s}</span>
                    ))}
                  </div>
                )}
                {Array.isArray(w.links) && w.links.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    {w.links.map((l, idx) => (
                      <a key={idx} href={l} target="_blank" rel="noreferrer" style={{ marginRight: 8 }}>Link {idx + 1}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
