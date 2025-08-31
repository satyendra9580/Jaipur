import mongoose from 'mongoose';

export default async function connectDB(uri) {
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  mongoose.set('strictQuery', true);
  const isProd = process.env.NODE_ENV === 'production';

  // Register listeners BEFORE connecting so we don't miss early events
  mongoose.connection.on('connected', () => console.log('MongoDB connected'));
  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

  await mongoose.connect(uri, {
    autoIndex: !isProd,
  });

  return mongoose;
}
