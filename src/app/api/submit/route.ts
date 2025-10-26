import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "emails.json");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const emails = JSON.parse(data);

    if (emails.includes(email)) {
      return NextResponse.json({ message: "Already submitted" });
    }

    emails.push(email);
    await fs.writeFile(filePath, JSON.stringify(emails, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
