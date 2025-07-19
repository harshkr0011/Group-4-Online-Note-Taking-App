
"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ListFilter, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DashboardControls() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const handleSortChange = (newSortBy: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', newSortBy);
        // Default to descending when changing sort type for consistency
        params.set('sortOrder', sortOrder); 
        router.push(`${pathname}?${params.toString()}`);
    };
    
    const toggleSortOrder = () => {
        const params = new URLSearchParams(searchParams.toString());
        const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        params.set('sortOrder', newSortOrder);
        router.push(`${pathname}?${params.toString()}`);
    };


    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <ListFilter className="mr-2 h-4 w-4" />
                        Sort by
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort notes by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => handleSortChange('title')} disabled={sortBy === 'title'}>
                        Title
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleSortChange('updatedAt')} disabled={sortBy === 'updatedAt'}>
                        Last Modified
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleSortChange('createdAt')} disabled={sortBy === 'createdAt'}>
                        Date Created
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="outline" size="icon" onClick={toggleSortOrder}>
                            {sortOrder === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                            <span className="sr-only">Toggle sort order</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Toggle sort order ({sortOrder === 'desc' ? 'Descending' : 'Ascending'})</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Button asChild>
                <Link href="/notes/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Note
                </Link>
            </Button>
        </div>
    );
}
