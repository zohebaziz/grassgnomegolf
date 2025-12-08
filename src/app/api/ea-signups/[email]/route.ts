import { NextResponse } from "next/server";
import { deleteEmail } from "@/service/mongo/email.service";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await deleteEmail(email);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
