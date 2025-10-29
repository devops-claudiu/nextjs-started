import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

function getClientPromise(): Promise<MongoClient> {
  // Don't initialize during build - only when actually called
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect().catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
      });
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    return client.connect();
  }
}

// Export a function that only initializes when called, not during import
export default getClientPromise;