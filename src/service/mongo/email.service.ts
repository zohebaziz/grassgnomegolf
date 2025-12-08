import { mongoClient, mongoEnvType } from "./connection.service";
import { Email } from "../../model/email.interface";

const dbName = 'gnolf'
const collectionName = `emails_${mongoEnvType}`;
const backupCollectionName = `archived_emails_${mongoEnvType}`;

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

export async function deleteEmail(email: string): Promise<void> {
  const session = mongoClient.startSession();
  try {
    await session.withTransaction(async () => {
      const db = mongoClient.db(dbName);
      const mainCollection = db.collection(collectionName);
      const backupCollection = db.collection(backupCollectionName);

      const emailToDelete = await mainCollection.findOne({ email });

      if (emailToDelete) {
        await backupCollection.insertOne(emailToDelete);
        await mainCollection.deleteOne({ email });
      }
    });
  } finally {
    await session.endSession();
    await mongoClient.close();
  }
}
