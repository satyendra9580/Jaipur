import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema(
  {
    degree: String,
    institution: String,
    startYear: Number,
    endYear: Number,
  },
  { _id: false }
);

const WorkSchema = new mongoose.Schema(
  {
    company: String,
    title: String,
    startDate: Date,
    endDate: Date,
    description: String,
    skills: [String],
    links: [String],
  },
  { _id: false }
);

const LinksSchema = new mongoose.Schema(
  {
    github: String,
    linkedin: String,
    portfolio: String,
  },
  { _id: false }
);

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    summary: { type: String },
    education: [EducationSchema],
    skills: [{ type: String }],
    work: [WorkSchema],
    links: LinksSchema,
  },
  { timestamps: true }
);

ProfileSchema.index({
  name: 'text',
  summary: 'text',
  'work.description': 'text',
  'education.degree': 'text',
  'education.institution': 'text',
  skills: 'text',
});

const Profile = mongoose.model('Profile', ProfileSchema);
export default Profile;
