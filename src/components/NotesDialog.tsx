'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Task } from '@/types';

interface NotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, notes: string) => void;
  task: Task;
}

export function NotesDialog({ isOpen, onClose, onSave, task }: NotesDialogProps) {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (task) {
      setNotes(task.notes);
    }
  }, [task]);

  const handleSave = () => {
    onSave(task.id, notes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Notes for: <span className="font-normal">{task.description}</span></DialogTitle>
          <DialogDescription>
            Add or edit your notes for this task. Your changes will be saved automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="notes" className="sr-only">Your Notes</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              className="min-h-[200px]"
              placeholder="Type your notes here..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>Save Notes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
