"use server";
import clientPromise from "@/lib/mongodb";
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import type { UserSettings, GlobalTag, ActivityLog, Attachment, SharedNote, UserProfile, Reminder, CalendarEvent } from "@/models/ExtraModels";

const JWT_SECRET = process.env.JWT_SECRET || "changeme-in-production";

async function getUserIdFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) throw new Error('Not authenticated');
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    throw new Error('Invalid or expired token');
  }
}

// SETTINGS
export async function saveUserSettings(settings: Partial<UserSettings>) {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  await db.collection("settings").updateOne(
    { userId },
    { $set: { ...settings, userId } },
    { upsert: true }
  );
}

export async function getUserSettings(): Promise<UserSettings | null> {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  const doc = await db.collection("settings").findOne({ userId });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest as UserSettings;
}

// GLOBAL TAGS
export async function addGlobalTag(name: string) {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  await db.collection("tags").insertOne({ name, createdBy: userId, createdAt: new Date().toISOString() });
}

export async function getGlobalTags(): Promise<GlobalTag[]> {
  const client = await clientPromise;
  const db = client.db();
  const docs = await db.collection("tags").find().toArray();
  return docs.map(({ _id, ...rest }) => rest as GlobalTag);
}

// ACTIVITY LOGS
export async function logActivity(action: string, details?: Record<string, any>) {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  await db.collection("activityLogs").insertOne({ userId, action, timestamp: new Date().toISOString(), details });
}

export async function getUserActivityLogs(): Promise<ActivityLog[]> {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  const docs = await db.collection("activityLogs").find({ userId }).sort({ timestamp: -1 }).toArray();
  return docs.map(({ _id, ...rest }) => rest as ActivityLog);
}

// ATTACHMENTS
export async function addAttachment(attachment: Omit<Attachment, "userId" | "uploadedAt">) {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  await db.collection("attachments").insertOne({ ...attachment, userId, uploadedAt: new Date().toISOString() });
}

export async function getUserAttachments(): Promise<Attachment[]> {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  const docs = await db.collection("attachments").find({ userId }).toArray();
  return docs.map(({ _id, ...rest }) => rest as Attachment);
}

// SHARED NOTES
export async function shareNote(noteId: string, sharedWith: string[], permissions: Record<string, 'read' | 'write' | 'admin'>) {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  await db.collection("sharedNotes").updateOne(
    { noteId, ownerId: userId },
    { $set: { noteId, ownerId: userId, sharedWith, permissions, createdAt: new Date().toISOString() } },
    { upsert: true }
  );
}

export async function getSharedNotes(): Promise<SharedNote[]> {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  const docs = await db.collection("sharedNotes").find({ $or: [{ ownerId: userId }, { sharedWith: userId }] }).toArray();
  return docs.map(({ _id, ...rest }) => rest as SharedNote);
}

// USER PROFILES
export async function saveUserProfile(profile: Partial<UserProfile>) {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  await db.collection("profiles").updateOne(
    { userId },
    { $set: { ...profile, userId } },
    { upsert: true }
  );
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  const doc = await db.collection("profiles").findOne({ userId });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest as UserProfile;
}

// REMINDERS
export async function addReminder(reminder: Omit<Reminder, "userId" | "createdAt">) {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  await db.collection("reminders").insertOne({ ...reminder, userId, createdAt: new Date().toISOString() });
}

export async function getUserReminders(): Promise<Reminder[]> {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  const docs = await db.collection("reminders").find({ userId }).toArray();
  return docs.map(({ _id, ...rest }) => rest as Reminder);
}

// CALENDAR EVENTS
export async function addCalendarEvent(event: Omit<CalendarEvent, "userId" | "createdAt">) {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  await db.collection("calendarEvents").insertOne({ ...event, userId, createdAt: new Date().toISOString() });
}

export async function getUserCalendarEvents(): Promise<CalendarEvent[]> {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  const docs = await db.collection("calendarEvents").find({ userId }).toArray();
  return docs.map(({ _id, ...rest }) => rest as CalendarEvent);
} 