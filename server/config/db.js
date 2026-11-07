import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let replSetInstance = null;

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }

    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri.trim() === '') {
      if (!replSetInstance) {
        console.log('ℹ️  No external MONGODB_URI detected. Launching integrated MongoDB Replica Set...');
        replSetInstance = await MongoMemoryReplSet.create({
          replSet: { count: 1, storageEngine: 'wiredTiger' }
        });
      }
      mongoUri = replSetInstance.getUri();
      console.log(`✅ Integrated MongoDB Replica Set active at: ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`🚀 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (replSetInstance) {
      await replSetInstance.stop();
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};
