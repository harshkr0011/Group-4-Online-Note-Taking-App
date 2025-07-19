
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import type { Note } from "@/models/Note";
import clientPromise from "@/lib/mongodb";
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";

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

function serializeNote(note: any): Note {
  return {
    ...note,
    id: note._id.toString(),
    _id: undefined,
    password: undefined,
    createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : note.createdAt,
    updatedAt: note.updatedAt instanceof Date ? note.updatedAt.toISOString() : note.updatedAt,
    dueDate: note.dueDate ? (note.dueDate instanceof Date ? note.dueDate.toISOString() : note.dueDate) : undefined,
  } as Note;
}

export async function getNotes({ tag, searchQuery, sortBy = 'updatedAt', sortOrder = 'desc' }: { tag?: string; searchQuery?: string; sortBy?: string; sortOrder?: string; }): Promise<Note[]> {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("notes");
  const filter: any = { archived: { $ne: true }, userId };
  if (tag) filter.tags = tag;
  if (searchQuery) {
    filter.$or = [
      { title: { $regex: searchQuery, $options: "i" } },
      { content: { $regex: searchQuery, $options: "i" } },
      { tags: { $regex: searchQuery, $options: "i" } },
    ];
  }
  const sort: { [key: string]: 1 | -1 } = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  const notes = await collection.find(filter).sort(sort).toArray();
  return notes.map(serializeNote);
}

export async function getArchivedNotes(): Promise<Note[]> {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("notes");
  const notes = await collection.find({ archived: true, userId }).sort({ updatedAt: -1 }).toArray();
  return notes.map(serializeNote);
}

export async function getAllTags(): Promise<string[]> {
  const userId = await getUserIdFromToken();
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("notes");
  const notes = await collection.find({ userId, archived: { $ne: true } }).toArray();
  const allTags = new Set<string>();
  notes.forEach((note: any) => note.tags?.forEach((tag: string) => allTags.add(tag)));
  return Array.from(allTags).sort();
}

export async function getNoteById(id: string): Promise<Note | null> {
  const userId = await getUserIdFromToken();
  if (!ObjectId.isValid(id)) return null;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("notes");
  const note = await collection.findOne({ _id: new ObjectId(id), userId });
  if (!note) return null;
  return serializeNote(note);
}

export async function saveNote(id: string | null, title: string, content: string, tags: string | string[], dueDate?: Date): Promise<string> {
  const userId = await getUserIdFromToken();
  const now = new Date();
  const tagsArray = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(Boolean);
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("notes");
  if (id && ObjectId.isValid(id)) {
    await collection.updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { title, content, tags: tagsArray, dueDate, updatedAt: now } }
    );
    revalidatePath('/dashboard');
    revalidatePath('/archived');
    revalidatePath(`/notes/${id}`);
    revalidatePath('/calendar');
    return id;
  } else {
    const result = await collection.insertOne({
      title,
      content,
      tags: tagsArray,
      createdAt: now,
      updatedAt: now,
      archived: false,
      locked: false,
      dueDate,
      userId,
    });
    revalidatePath('/dashboard');
    revalidatePath('/calendar');
    return result.insertedId.toString();
  }
}

export async function deleteNote(id: string): Promise<void> {
  const userId = await getUserIdFromToken();
  if (!ObjectId.isValid(id)) return;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("notes");
  await collection.deleteOne({ _id: new ObjectId(id), userId });
  revalidatePath('/dashboard');
  revalidatePath('/archived');
  revalidatePath('/calendar');
}

export async function archiveNote(id: string): Promise<void> {
  const userId = await getUserIdFromToken();
  if (!ObjectId.isValid(id)) return;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("notes");
  await collection.updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { archived: true, updatedAt: new Date(), pinned: false } }
  );
  revalidatePath('/dashboard');
  revalidatePath('/archived');
  revalidatePath(`/notes/${id}`);
  revalidatePath('/calendar');
  redirect('/dashboard');
}

export async function unarchiveNote(id: string): Promise<void> {
  const userId = await getUserIdFromToken();
  if (!ObjectId.isValid(id)) return;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("notes");
  await collection.updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { archived: false, updatedAt: new Date() } }
  );
  revalidatePath('/dashboard');
  revalidatePath('/archived');
  revalidatePath('/calendar');
}

export async function lockNote(id: string, password: string): Promise<void> {
  const userId = await getUserIdFromToken();
  if (!ObjectId.isValid(id)) return;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("notes");
  await collection.updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { locked: true, password, updatedAt: new Date() } }
  );
  revalidatePath('/dashboard');
  revalidatePath(`/notes/${id}`);
}

export async function unlockNote(id: string, password: string): Promise<boolean> {
  const userId = await getUserIdFromToken();
  if (!ObjectId.isValid(id)) return false;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("notes");
  const note = await collection.findOne({ _id: new ObjectId(id), userId });
  if (note && note.password === password) {
    return true;
  }
  return false;
}

export async function pinNote(id: string): Promise<void> {
  const userId = await getUserIdFromToken();
  if (!ObjectId.isValid(id)) return;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("notes");
  await collection.updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { pinned: true, updatedAt: new Date() } }
  );
  revalidatePath('/dashboard');
}

export async function unpinNote(id: string): Promise<void> {
  const userId = await getUserIdFromToken();
  if (!ObjectId.isValid(id)) return;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("notes");
  await collection.updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { pinned: false, updatedAt: new Date() } }
  );
  revalidatePath('/dashboard');
}
