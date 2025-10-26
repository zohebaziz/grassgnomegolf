import { mongoClient, mongoEnvType } from "./connection.service";
import { Email } from "../../model/email.interface";

const dbName = 'gnolf'
const collectionName = `emails_${mongoEnvType}`;

export async function createEmail(email: Email): Promise<void> {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);
    await collection.insertOne(email);
  } finally {
    await mongoClient.close();
  }
}

export async function getEmails(): Promise<Email[]> {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);
    const emails = await collection.find().toArray();
    return emails.map(({ email }) => ({ email }));
  } finally {
    await mongoClient.close();
  }
}
