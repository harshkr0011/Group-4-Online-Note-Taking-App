
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Note } from "@/models/Note";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { Lock, Pin, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pinNote, unpinNote } from "@/app/actions/notes";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NoteCardProps {
    note: Note;
}

function PinButton({ noteId, isPinned }: { noteId: string; isPinned: boolean }) {
    const router = useRouter();
    const { toast } = useToast();

    const handlePinToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (isPinned) {
                await unpinNote(noteId);
            } else {
                await pinNote(noteId);
            }
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not update pin status. Please try again.",
                variant: "destructive"
            });
        }
    };
    
    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground group-hover:text-primary"
            onClick={handlePinToggle}
        >
            <Pin className={`h-4 w-4 ${isPinned ? 'fill-primary text-primary' : ''}`} />
        </Button>
    )
}

export function NoteCard({ note }: NoteCardProps) {
    const router = useRouter();
    const [displayDate, setDisplayDate] = useState<string>('');
    const [formattedDueDate, setFormattedDueDate] = useState<string>('');

    useEffect(() => {
        // These will only run on the client, after initial hydration
        setDisplayDate(formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true }));
        if (note.dueDate) {
            setFormattedDueDate(format(new Date(note.dueDate), "MMM dd"));
        }
    }, [note.updatedAt, note.dueDate]);

    const handleTagClick = (e: React.MouseEvent, tag: string) => {
        e.stopPropagation();
        router.push(`/dashboard?tag=${encodeURIComponent(tag)}`);
    };

    return (
        <Link href={`/notes/${note.id}`} key={note.id} className="group">
            <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:scale-105 group-hover:border-primary">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="font-headline pr-2">{note.title}</CardTitle>
                        <div className="flex items-center gap-1">
                            {note.locked && <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                            <PinButton noteId={note.id!} isPinned={note.pinned || false} />
                        </div>
                    </div>
                    <div className={cn("text-sm text-muted-foreground", "flex items-center gap-2")}>
                        <span>{displayDate}</span>
                        {note.dueDate && (
                            <>
                                <span className="text-muted-foreground">&middot;</span>
                                <div className="flex items-center gap-1 text-xs">
                                    <CalendarIcon className="h-3 w-3" />
                                    <span>{formattedDueDate}</span>
                                </div>
                            </>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                     <div className="text-sm text-muted-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: note.content }} />
                </CardContent>
                {note.tags && note.tags.length > 0 && (
                    <CardFooter className="flex flex-wrap gap-2 pt-4">
                        {note.tags.map(tag => (
                             <div key={tag} onClick={(e) => handleTagClick(e, tag)}>
                                <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                                    {tag}
                                </Badge>
                            </div>
                        ))}
                    </CardFooter>
                )}
            </Card>
        </Link>
    );
}
