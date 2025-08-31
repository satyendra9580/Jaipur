import { Router } from 'express';
import Project from '../models/Project.js';
import Profile from '../models/Profile.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: { message: 'q is required' } });

    // Safe regex for fallback matching
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(escaped, 'i');

    // Run text and regex searches and merge results
    const [textProjects, regexProjects, profileHit] = await Promise.all([
      Project.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(50)
        .lean(),
      Project.find({ $or: [{ title: rx }, { description: rx }, { skills: rx }] })
        .limit(50)
        .lean(),
      Profile.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(1)
        .lean(),
    ]);

    // Dedupe projects by _id, prefer ordering by text score when available
    const byId = new Map();
    for (const p of textProjects) byId.set(String(p._id), p);
    for (const p of regexProjects) if (!byId.has(String(p._id))) byId.set(String(p._id), p);
    const projects = Array.from(byId.values()).slice(0, 50);

    res.json({ projects, profile: profileHit[0] || null });
  } catch (err) {
    next(err);
  }
});

export default router;
