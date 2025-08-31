import { Router } from 'express';
import Project from '../models/Project.js';

const router = Router();

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/', async (req, res, next) => {
  try {
    const { skill, q, limit } = req.query;
    const filter = {};

    if (skill) {
      filter.skills = { $regex: new RegExp(escapeRegex(skill), 'i') };
    }
    if (q) {
      filter.$text = { $search: q };
    }

    const lim = Math.min(parseInt(limit || '50', 10), 100);

    const projects = await Project.find(filter, q ? { score: { $meta: 'textScore' } } : {})
      .sort(q ? { score: { $meta: 'textScore' } } : { updatedAt: -1 })
      .limit(lim)
      .lean();

    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await Project.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

export default router;
