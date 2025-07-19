
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getArchivedNotes, unarchiveNote, deleteNote } from "@/app/actions/notes";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { revalidatePath } from "next/cache";

async function UnarchiveButton({ noteId }: { noteId: string }) {
    const unarchiveAction = async () => {
        "use server";
        await unarchiveNote(noteId);
        revalidatePath('/archived');
    };
    return (
        <form action={unarchiveAction}>
            <Button size="sm" variant="outline" type="submit">
                <ArchiveRestore className="mr-2 h-4 w-4" />
                Unarchive
            </Button>
        </form>
    );
}

async function DeleteButton({ noteId }: { noteId: string }) {
    const deleteAction = async () => {
        "use server";
        await deleteNote(noteId);
        revalidatePath('/archived');
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                 <form action={deleteAction}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the note from the archive.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit">Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default async function ArchivedPage() {
    const notes = await getArchivedNotes();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-2xl font-semibold font-headline">Archived Notes</h1>
            </div>
            {notes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {notes.map(note => (
                        <Card key={note.id} className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="font-headline">{note.title}</CardTitle>
                                <CardDescription>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                 <div className="text-sm text-muted-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: note.content }} />
                                  {note.tags && note.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-4">
                                        {note.tags.map(tag => (
                                            <Badge key={tag} variant="secondary">{tag}</Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <UnarchiveButton noteId={note.id!} />
                                <DeleteButton noteId={note.id!} />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                 <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[400px]">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h3 className="text-2xl font-bold tracking-tight font-headline">No archived notes</h3>
                        <p className="text-sm text-muted-foreground">
                           Your archived notes will appear here.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
