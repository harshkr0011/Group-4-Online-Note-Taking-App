
import * as React from "react";
import { NoteEditor } from "./note-editor";
import { getNoteById } from "@/app/actions/notes";
import { notFound } from "next/navigation";
import { Note } from "@/models/Note";
import { cookies } from 'next/headers';

// The page is a server component that fetches data
export default async function NoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const isNew = resolvedParams.id === 'new';
  const cookieStore = await cookies();
  const settingsCookie = cookieStore.get('feathernote-settings');
  const settings = settingsCookie ? JSON.parse(settingsCookie.value) : {};


  let note: Note | null = null;

  if (isNew) {
    note = {
      title: '',
      content: '',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      archived: false,
      locked: false,
      password: '',
      dueDate: undefined,
    };
  } else {
    const fetchedNote = await getNoteById(resolvedParams.id);
    if (!fetchedNote) {
      notFound();
    }
    // The note is already serialized by the server action
    note = fetchedNote;
  }
  
  return <NoteEditor note={note} />;
}
