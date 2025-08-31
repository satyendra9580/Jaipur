import 'dotenv/config';
import connectDB from '../src/config/db.js';
import Profile from '../src/models/Profile.js';
import Project from '../src/models/Project.js';

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');

  await connectDB(uri);

  const name = process.env.SEED_NAME || 'Satyendra Singh';
  const email = process.env.SEED_EMAIL || 'seenu5180singh@gmail.com';
  const github = process.env.SEED_GITHUB || '';
  const linkedin = process.env.SEED_LINKEDIN || '';
  const portfolio = process.env.SEED_PORTFOLIO || '';
  const chat = process.env.SEED_CHAT || '';
  const skills = (process.env.SEED_SKILLS || 'javascript,react,node,express,mongodb,python,django')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Upsert profile
  const profileDoc = await Profile.findOneAndUpdate(
    { email },
    {
      name,
      email,
      summary,
      education:[],
      skills,
      work:[],
      links: { github, linkedin, portfolio },
    },
    { new: true, upsert: true }
  );

  // Seed a few projects idempotently (by unique title)
  const projects = [];

  for (const p of projects) {
    await Project.updateOne({ title: p.title }, { $set: p }, { upsert: true });
  }

  console.log('Seed completed:', {
    profileEmail: profileDoc.email,
    projects: projects.map((p) => p.title),
  });
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
