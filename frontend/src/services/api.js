const BASE = import.meta.env.VITE_API_BASE_URL || 'https://jaipur.onrender.com';

async function http(path, opts) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch (_) {}
    const msg = body?.error?.message || res.statusText;
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  getHealth: () => http('/health'),
  getProfile: () => http('/api/profile'),
  getProjects: ({ skill, q, limit } = {}) => {
    const params = new URLSearchParams();
    if (skill) params.set('skill', skill);
    if (q) params.set('q', q);
    if (limit) params.set('limit', String(limit));
    const qs = params.toString();
    return http(`/api/projects${qs ? `?${qs}` : ''}`);
  },
  getTopSkills: (limit = 10) => http(`/api/skills/top?limit=${limit}`),
  search: (q) => http(`/api/search?q=${encodeURIComponent(q)}`),
};
