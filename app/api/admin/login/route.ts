import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createToken, setAuthCookie } from "@/lib/admin/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const hash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !hash) {
      return NextResponse.json(
        { error: "Admin auth not configured." },
        { status: 500 }
      );
    }

    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createToken();
    await setAuthCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
