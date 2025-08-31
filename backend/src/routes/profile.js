import { Router } from 'express';
import Profile from '../models/Profile.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const doc = await Profile.findOne().lean();
    if (!doc) return res.status(404).json({ error: { message: 'Profile not found' } });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: { message: 'email is required' } });
    const exists = await Profile.findOne({ email });
    if (exists) return res.status(409).json({ error: { message: 'Profile exists. Use PUT to update.' } });
    const doc = await Profile.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { email } = req.body || {};

    if (email) {
      const doc = await Profile.findOneAndUpdate({ email }, req.body, {
        new: true,
        upsert: true,
      });
      return res.json(doc);
    }

    const first = await Profile.findOne();
    if (!first) return res.status(404).json({ error: { message: 'No profile to update. Provide email or create via POST.' } });

    const updated = await Profile.findByIdAndUpdate(first._id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
