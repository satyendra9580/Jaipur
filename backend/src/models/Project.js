import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    skills: [{ type: String, index: true }],
    links: [{ type: String }],
    repoUrl: String,
    demoUrl: String,
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

ProjectSchema.index({ title: 'text', description: 'text', skills: 'text' });

const Project = mongoose.model('Project', ProjectSchema);
export default Project;
