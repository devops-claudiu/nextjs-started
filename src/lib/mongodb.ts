import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<MongoClient>;

// Handle missing URI gracefully during build
if (!uri) {
  // During build, create a dummy promise that won't break the build
  clientPromise = Promise.resolve({
    db: (dbName: string) => ({
      collection: (collectionName: string) => ({
        insertOne: () => Promise.resolve({ insertedId: 'dummy-id' }),
        find: () => ({
          sort: () => ({
            toArray: () => Promise.resolve([])
          })
        }),
        countDocuments: () => Promise.resolve(0)
      }),
      command: () => Promise.resolve({ ok: 1 })
    }),
    close: () => Promise.resolve()
  } as any); // Type assertion to avoid complex typing
} else {
  // Normal MongoDB connection when URI is available
  const options = {};

  let client: MongoClient;

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
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;