
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Save, Loader2, Download, Archive, Lock, Unlock, Calendar as CalendarIcon, X } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { saveNote, archiveNote, lockNote, unlockNote } from "@/app/actions/notes";
import { Note } from "@/models/Note";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useSettings } from "@/components/settings-provider";
import { useDebouncedCallback } from "use-debounce";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";


const WysiwygEditor = dynamic(() => import('./wysiwyg-editor'), { ssr: false });

interface NoteEditorProps {
    note: Note | null;
}

export function NoteEditor({ note: initialNote }: NoteEditorProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { settings } = useSettings();

  const [isSaving, setIsSaving] = React.useState(false);
  const [isArchiving, setIsArchiving] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isLocking, setIsLocking] = React.useState(false);
  const [isUnlocking, setIsUnlocking] = React.useState(false);
  
  const [note, setNote] = React.useState(initialNote);
  const [tags, setTags] = React.useState(initialNote?.tags?.join(', ') || '');
  const [dueDate, setDueDate] = React.useState<Date | undefined>(initialNote?.dueDate ? new Date(initialNote.dueDate) : undefined);
  const [password, setPassword] = React.useState('');
  const [unlockPassword, setUnlockPassword] = React.useState('');
  const [isNoteUnlocked, setIsNoteUnlocked] = React.useState(!initialNote?.locked);
  const [isLockDialogOpen, setIsLockDialogOpen] = React.useState(false);

  React.useEffect(() => {
    setNote(initialNote);
    setTags(initialNote?.tags?.join(', ') || '');
    setDueDate(initialNote?.dueDate ? new Date(initialNote.dueDate) : undefined);
    setIsNoteUnlocked(!initialNote?.locked);
  }, [initialNote]);

  const handleSave = React.useCallback(async () => {
    if (!note) return;
    setIsSaving(true);
    try {
      const savedNoteId = await saveNote(note.id || null, note.title, note.content, tags, dueDate);
      toast({
        title: "Note Saved!",
        description: "Your note has been successfully saved.",
      });
      if (!note.id && savedNoteId) {
          router.push(`/notes/${savedNoteId}`);
      } else {
        router.refresh();
      }
    } catch (error) {
       toast({
        title: "Error saving note",
        description: "Could not save the note. Please try again.",
        variant: "destructive",
      });
    } finally {
        setIsSaving(false);
    }
  }, [note, tags, dueDate, router, toast]);

  const debouncedSave = useDebouncedCallback(handleSave, 1500);

  const handleContentChange = (content: string) => {
    setNote(prevNote => prevNote ? { ...prevNote, content } : null);
    if (settings.autoSave) {
        debouncedSave();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(prevNote => prevNote ? { ...prevNote, title: e.target.value } : null);
    if (settings.autoSave) {
        debouncedSave();
    }
  };

  // Keyboard shortcut for saving
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (settings.keyboardShortcuts && (event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSave, settings.keyboardShortcuts]);

  if (!note) {
      React.useEffect(() => {
          router.push('/dashboard');
      }, [router]);
      return null;
  }

  const isNew = !note.id;

  const handleArchiveConfirm = async () => {
    if (isNew) return;
    setIsArchiving(true);
    try {
        await archiveNote(note.id!);
        toast({
            title: "Note Archived",
            description: "Your note has been moved to the archive.",
        });
        router.push('/dashboard');
    } catch (error) {
         toast({
            title: "Error archiving note",
            description: "Could not archive the note. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsArchiving(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const elementToRender = document.createElement("div");
    elementToRender.innerHTML = `<h1>${note.title}</h1>${note.content}`;
    elementToRender.style.padding = "20px";
    elementToRender.style.background = "white";
    elementToRender.style.color = "black";
    elementToRender.style.width = "800px";

    document.body.appendChild(elementToRender);
    
    try {
        const canvas = await html2canvas(elementToRender, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps= pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${note.title || 'note'}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
            title: "Error generating PDF",
            description: "Could not create the PDF file. Please try again.",
            variant: "destructive",
        });
    } finally {
        document.body.removeChild(elementToRender);
        setIsDownloading(false);
    }
  };

  const handleLockConfirm = async () => {
      if(isNew || !password) return;
      setIsLocking(true);
      try {
          await lockNote(note.id!, password);
          toast({ title: "Note Locked", description: "Your note is now password protected." });
          setIsLockDialogOpen(false);
          setPassword('');
          router.refresh();
      } catch (error) {
           toast({
              title: "Error Locking Note",
              description: "Could not lock the note. Please try again.",
              variant: "destructive",
          });
      } finally {
          setIsLocking(false);
      }
  }

  const handleUnlockConfirm = async () => {
      if(isNew || !unlockPassword) return;
      setIsUnlocking(true);
      try {
          const success = await unlockNote(note.id!, unlockPassword);
          if (success) {
            toast({ title: "Note Unlocked", description: "You can now edit the note." });
            setIsNoteUnlocked(true);
            setUnlockPassword('');
          } else {
             toast({ title: "Incorrect Password", description: "The password you entered is incorrect.", variant: "destructive" });
          }
      } catch (error) {
          toast({
              title: "Error Unlocking Note",
              description: "Could not unlock the note. Please try again.",
              variant: "destructive",
          });
      } finally {
          setIsUnlocking(false);
      }
  }


  return (
    <div className="flex flex-col gap-4">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage className="font-headline">{isNew ? 'New Note' : note.title}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        
      {!isNoteUnlocked ? (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Lock /> This note is locked</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Enter the password to unlock and edit this note.</p>
                <div className="flex gap-2">
                    <Input 
                        id="unlock-password" 
                        type="password"
                        placeholder="Enter password..."
                        value={unlockPassword}
                        onChange={(e) => setUnlockPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUnlockConfirm()}
                    />
                    <Button onClick={handleUnlockConfirm} disabled={isUnlocking}>
                        {isUnlocking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Unlock className="mr-2 h-4 w-4" />}
                        Unlock
                    </Button>
                </div>
            </CardContent>
        </Card>
      ) : (
        <>
        <Card>
            <CardHeader>
            <CardTitle className="font-headline sr-only">{isNew ? 'New Note' : `Editing: ${note.title}`}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="title" className="text-lg font-semibold font-headline">Title</Label>
                    <Input 
                    id="title" 
                    placeholder="Enter a title for your note..." 
                    value={note.title}
                    onChange={handleTitleChange}
                    className="text-base" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="content" className="text-lg font-semibold font-headline">Content</Label>
                    <div className="bg-background rounded-md border border-input min-h-[400px]">
                    <WysiwygEditor
                        value={note.content} 
                        onChange={handleContentChange} 
                    />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="tags" className="text-lg font-semibold font-headline">Tags</Label>
                        <Input 
                        id="tags" 
                        placeholder="Add comma-separated tags..." 
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="text-base" />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, index) => (
                                <Badge key={`${tag}-${index}`} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                     <div className="grid gap-2">
                        <Label className="text-lg font-semibold font-headline">Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={setDueDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                         {dueDate && (
                            <Button variant="ghost" size="sm" className="w-fit" onClick={() => setDueDate(undefined)}>
                                <X className="mr-2 h-4 w-4" />
                                Clear Date
                            </Button>
                         )}
                    </div>
                </div>
            </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
            <Button onClick={handleDownloadPdf} variant="outline" disabled={isDownloading || isNew} size="sm">
                {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Download PDF
            </Button>
            {
            !isNew && (
                <>
                <Dialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
                    <DialogTrigger asChild>
                         <Button variant="outline" disabled={isLocking} size="sm">
                            <Lock className="mr-2 h-4 w-4" />
                            Lock Note
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Set a password to lock this note</DialogTitle>
                            <DialogDescription>
                                This will require a password to view or edit this note in the future. Make sure you save this password, as it cannot be recovered.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2 py-4">
                            <Label htmlFor="lock-password">Password</Label>
                            <Input 
                                id="lock-password" 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsLockDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleLockConfirm} disabled={isLocking || !password}>
                                 {isLocking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                                Lock Note
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" disabled={isArchiving} size="sm">
                            {isArchiving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Archive className="mr-2 h-4 w-4" />}
                            Archive
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to archive this note?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will move the note to the archive. You can restore it later.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleArchiveConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </>
            )
            }
            <Button onClick={handleSave} disabled={isSaving} size="sm">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Note
            </Button>
        </div>
        </>
      )}
    </div>
  );
}
