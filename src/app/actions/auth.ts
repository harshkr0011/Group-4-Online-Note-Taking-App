"use server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET || "changeme-in-production";

function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function signupUser({ fullName, email, password }: { fullName: string, email: string, password: string }) {
  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  // Check if user already exists
  const existing = await users.findOne({ email });
  if (existing) {
    return { error: "Email already in use." };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  await users.insertOne({
    fullName,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return { success: true };
}

export async function loginUser({ email, password }: { email: string, password: string }) {
  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  // Find user by email
  const user = await users.findOne({ email });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { error: "Invalid email or password." };
  }

  // Generate JWT
  const token = signJwt({ userId: user._id.toString(), email: user.email });

  // Set JWT as httpOnly cookie (await cookies() for async API)
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return { success: true, userId: user._id.toString(), fullName: user.fullName };
}

export async function loginUserAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  // Find user by email
  const user = await users.findOne({ email });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { error: "Invalid email or password." };
  }

  // Generate JWT
  const token = signJwt({ userId: user._id.toString(), email: user.email });

  // Set JWT as httpOnly cookie (await cookies() for async API)
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  redirect('/dashboard');
}
