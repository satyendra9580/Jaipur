import { Router } from 'express';
import Project from '../models/Project.js';

const router = Router();

router.get('/top', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
    const agg = await Project.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: { $toLower: '$skills' }, count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: limit },
      { $project: { _id: 0, skill: '$_id', count: 1 } },
    ]);
    res.json(agg);
  } catch (err) {
    next(err);
  }
});

export default router;
