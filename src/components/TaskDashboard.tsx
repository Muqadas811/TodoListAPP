'use client';

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { initialData } from '@/lib/initial-data';
import type { Author } from '@/types';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TaskTable } from './TaskTable';
import { useToast } from '@/hooks/use-toast';
import { isToday, isTomorrow } from 'date-fns';

export function TaskDashboard() {
  const [authors, setAuthors] = useLocalStorage<Author[]>('taskmaster-data', initialData);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    if(initialData.length > 0 && !selectedAuthorId) {
      setSelectedAuthorId(initialData[0].id);
    }
  }, [selectedAuthorId]);

  useEffect(() => {
    if (isMounted) {
      authors.forEach(author => {
        author.tasks.forEach(task => {
          const deadline = new Date(task.deadline);
          let message = '';
          if (isToday(deadline)) {
            message = `Task "${task.description}" for ${author.name} is due today!`;
          } else if (isTomorrow(deadline)) {
            message = `Task "${task.description}" for ${author.name} is due tomorrow.`;
          }
          
          if (message) {
            toast({
              title: 'Deadline Reminder',
              description: message,
              duration: 5000,
            });
          }
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]); 

  const selectedAuthor = authors.find(a => a.id === selectedAuthorId);

  const handleUpdateAuthor = (updatedAuthor: Author) => {
    setAuthors(prevAuthors =>
      prevAuthors.map(author => (author.id === updatedAuthor.id ? updatedAuthor : author))
    );
  };
  
  if (!isMounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground h-6 w-6"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </div>
                <h1 className="text-xl font-semibold">TaskMaster Pro</h1>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {authors.map(author => (
              <SidebarMenuItem key={author.id}>
                <SidebarMenuButton
                  onClick={() => setSelectedAuthorId(author.id)}
                  isActive={selectedAuthorId === author.id}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={author.avatar} alt={author.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{author.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-card">
          <div>
            <h2 className="text-2xl font-bold">{selectedAuthor ? `${selectedAuthor.name}'s Tasks` : 'Select an Author'}</h2>
            <p className="text-muted-foreground">Manage and track tasks efficiently.</p>
          </div>
          <SidebarTrigger />
        </header>
        <div className="p-4">
          {selectedAuthor ? (
            <TaskTable author={selectedAuthor} onUpdateAuthor={handleUpdateAuthor} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Select an author from the sidebar to view their tasks.
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
