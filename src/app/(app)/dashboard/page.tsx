
import { getNotes } from "@/app/actions/notes";
import Link from "next/link";
import { NoteCard } from "./note-card";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DashboardControls } from "./dashboard-controls";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedSearchParams = await searchParams;
    const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '';
    const tag = typeof resolvedSearchParams.tag === 'string' ? resolvedSearchParams.tag : '';
    const sortBy = typeof resolvedSearchParams.sortBy === 'string' ? resolvedSearchParams.sortBy : 'updatedAt';
    const sortOrder = typeof resolvedSearchParams.sortOrder === 'string' ? resolvedSearchParams.sortOrder : 'desc';
    
    const notes = await getNotes({ searchQuery: q, tag, sortBy, sortOrder });
    
    const filterActive = q || tag;

    const getEmptyStateMessage = () => {
        if (q) return `No notes found for "${q}".`;
        if (tag) return `No notes found with the tag "${tag}".`;
        return "Get started by creating a new note.";
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-2xl font-semibold font-headline">{tag ? `Notes tagged with "${tag}"` : 'All Notes'}</h1>
                 <DashboardControls />
            </div>
            {notes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {notes.map(note => (
                       <NoteCard key={note.id} note={note} />
                    ))}
                </div>
            ) : (
                 <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[400px]">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h3 className="text-2xl font-bold tracking-tight font-headline">You have no notes</h3>
                        <p className="text-sm text-muted-foreground">
                           {getEmptyStateMessage()}
                        </p>
                        <Button className="mt-4" asChild>
                             <Link href="/notes/new">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Note
                            </Link>
                        </Button>
                         {filterActive && (
                            <Button variant="outline" className="mt-2" asChild>
                                <Link href="/dashboard">Clear filter</Link>
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
