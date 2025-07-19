
"use client";

import React, { useState, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNotes } from "@/app/actions/notes";
import { Note } from "@/models/Note";
import { format } from "date-fns";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [notes, setNotes] = useState<Note[]>([]);
    
    React.useEffect(() => {
        const fetchNotes = async () => {
            const allNotes = await getNotes({});
            setNotes(allNotes.filter(note => note.dueDate));
        };
        fetchNotes();
    }, []);
    
    const notesByDate = useMemo(() => {
        const groupedNotes: { [key: string]: Note[] } = {};
        notes.forEach(note => {
            if (note.dueDate) {
                const day = format(new Date(note.dueDate), 'yyyy-MM-dd');
                if (!groupedNotes[day]) {
                    groupedNotes[day] = [];
                }
                groupedNotes[day].push(note);
            }
        });
        return groupedNotes;
    }, [notes]);
    
    const selectedDay = date ? format(date, 'yyyy-MM-dd') : null;
    const notesForSelectedDay = selectedDay ? (notesByDate[selectedDay] || []) : [];

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-semibold font-headline">Calendar</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardContent className="p-0">
                           <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="p-0 w-full"
                                classNames={{
                                    day: "h-12 w-full text-sm",
                                    head_cell: "text-muted-foreground rounded-md w-full font-normal text-sm",
                                }}
                                components={{
                                    DayContent: ({ date }) => {
                                        const day = format(date, 'yyyy-MM-dd');
                                        const dayHasNotes = notesByDate[day] && notesByDate[day].length > 0;
                                        return (
                                            <div className="relative h-full w-full flex items-center justify-center">
                                                <span>{date.getDate()}</span>
                                                {dayHasNotes && <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-primary" />}
                                            </div>
                                        );
                                    },
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
                 <div className="md:col-span-1">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="font-headline">
                                {date ? format(date, "MMMM dd, yyyy") : 'Select a date'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {notesForSelectedDay.length > 0 ? (
                                <div className="space-y-4">
                                    {notesForSelectedDay.map(note => (
                                        <Link href={`/notes/${note.id}`} key={note.id}>
                                            <div className="p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                                                <p className="font-semibold">{note.title}</p>
                                                <div className="text-sm text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ __html: note.content }} />
                                                 {note.tags && note.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 pt-2">
                                                        {note.tags.map(tag => (
                                                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No notes scheduled for this day.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
