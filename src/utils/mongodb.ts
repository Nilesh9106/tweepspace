import { Config } from '@/config';
import mongoose from 'mongoose';

const connection: { connected?: number } = {};

export const dbConnect = async () => {
  if (connection.connected) {
    console.log('Already connected to MongoDB');
    return;
  }
  const db = await mongoose.connect(Config.MONGODB_URI);
  console.log(`Connected to MongoDB: ${db.connection.host}`);
  connection.connected = db.connections[0].readyState;
};
