
"use client";

import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronUp, Feather, Home, NotebookPen, Search, Tag, User, Settings, Archive, Calendar } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react";
import { getAllTags } from "../actions/notes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const VISIBLE_TAGS_COUNT = 3;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    async function fetchTags() {
      const allTags = await getAllTags();
      setTags(allTags);
    }
    fetchTags();
  }, [pathname]); // Refetch tags when navigation changes

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchQuery) {
      router.push(`/dashboard?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path: string) => {
    // Special handling for dashboard to include note editing pages
    if (path === '/dashboard') {
        const isNoteEditPage = /^\/notes\/[a-zA-Z0-9]+$/.test(pathname);
        return pathname === '/dashboard' || pathname.startsWith('/dashboard?') || isNoteEditPage;
    }
    return pathname.startsWith(path);
  }
  
  const getHeaderTitle = () => {
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard?')) return 'Dashboard';
    if (pathname.startsWith('/notes/new')) return 'New Note';
    if (/^\/notes\/[a-zA-Z0-9]+$/.test(pathname)) return 'Edit Note';
    if (pathname.startsWith('/settings')) return 'Settings';
    if (pathname.startsWith('/profile')) return 'Profile';
    if (pathname.startsWith('/archived')) return 'Archived Notes';
    if (pathname.startsWith('/calendar')) return 'Calendar';
    return 'FeatherNote';
  }

  const displayedTags = showAllTags ? tags : tags.slice(0, VISIBLE_TAGS_COUNT);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
                <Feather className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold font-headline">FeatherNote</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
            <div className="p-2">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search notes..." 
                        className="pl-8" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <SidebarGroup>
                    <SidebarGroupLabel>Notes</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href="/dashboard">
                                <SidebarMenuButton isActive={isActive('/dashboard')}>
                                    <Home />
                                    <span>All Notes</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                            <Link href="/calendar">
                                <SidebarMenuButton isActive={isActive('/calendar')}>
                                    <Calendar />
                                    <span>Calendar</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href="/notes/new">
                                <SidebarMenuButton isActive={isActive('/notes/new')}>
                                    <NotebookPen />
                                    <span>New Note</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href="/archived">
                                <SidebarMenuButton isActive={isActive('/archived')}>
                                    <Archive />
                                    <span>Archived</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                 <SidebarGroup>
                    <SidebarGroupLabel>Tags</SidebarGroupLabel>
                    <SidebarMenu>
                        {displayedTags.map(tag => (
                            <SidebarMenuItem key={tag}>
                                <Link href={`/dashboard?tag=${encodeURIComponent(tag)}`}>
                                    <SidebarMenuButton>
                                        <Tag />
                                        <span className="capitalize">{tag}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                         {tags.length > VISIBLE_TAGS_COUNT && (
                            <SidebarMenuItem>
                                <Button variant="ghost" className="w-full justify-start h-8" onClick={() => setShowAllTags(!showAllTags)}>
                                    {showAllTags ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                                    {showAllTags ? 'Show Less' : `Show ${tags.length - VISIBLE_TAGS_COUNT} More`}
                                </Button>
                            </SidebarMenuItem>
                        )}
                         {tags.length === 0 && (
                            <p className="px-3 text-xs text-muted-foreground">No tags yet.</p>
                        )}
                    </SidebarMenu>
                 </SidebarGroup>
            </ScrollArea>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/profile">
                        <SidebarMenuButton isActive={isActive('/profile')}>
                            <User />
                            <span>Profile</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="/settings">
                        <SidebarMenuButton isActive={isActive('/settings')}>
                            <Settings />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-background/70 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold font-headline">{getHeaderTitle()}</h1>
            </div>
            <div className="flex items-center gap-4">
               <UserNav />
            </div>
        </header>
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
