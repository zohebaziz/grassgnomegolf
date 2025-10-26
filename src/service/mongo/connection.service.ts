
import { MongoClient, ServerApiVersion } from 'mongodb';
export const mongoUri = process.env.MONGO_URI!!
export const mongoEnvType = process.env.MONGO_ENV_TYPE ?? "dev"

export const mongoClient = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function testConnection() {
  try {
    await mongoClient.connect();
    await mongoClient.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await mongoClient.close();
  }
}
