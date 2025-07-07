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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task, Subtask } from '@/types';
import { PlusCircle, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id'>) => void;
  task: Task | null;
}

export function TaskDialog({ isOpen, onClose, onSave, task }: TaskDialogProps) {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [deadline, setDeadline] = useState<Date | undefined>(new Date());
  const [subtasks, setSubtasks] = useState<Omit<Subtask, 'id' | 'completed'>[]>([]);

  useEffect(() => {
    if (task) {
      setDescription(task.description);
      setPriority(task.priority);
      setDeadline(new Date(task.deadline));
      setSubtasks(task.subtasks);
    } else {
      setDescription('');
      setPriority('Medium');
      setDeadline(new Date());
      setSubtasks([]);
    }
  }, [task, isOpen]);

  const handleSubtaskChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = { ...newSubtasks[index], description: value };
    setSubtasks(newSubtasks);
  };

  const handleAddSubtask = () => {
    if (subtasks.length < 4) {
      setSubtasks([...subtasks, { description: '' }]);
    }
  };

  const handleRemoveSubtask = (index: number) => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  };
  
  const handleSave = () => {
    if (!description || !deadline) return;
    onSave({
      description,
      priority,
      deadline: deadline.toISOString(),
      notes: task?.notes || '',
      subtasks: subtasks.map(st => ({...st, completed: false})),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            Fill in the details for your task. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">Priority</Label>
            <Select onValueChange={(v: 'Low' | 'Medium' | 'High') => setPriority(v)} defaultValue={priority}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
           <div className="grid grid-cols-4 items-start gap-4">
             <Label className="text-right pt-2">Subtasks</Label>
             <div className="col-span-3 space-y-2">
                {subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input placeholder={`Subtask ${index + 1}`} value={subtask.description} onChange={(e) => handleSubtaskChange(index, e.target.value)} />
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveSubtask(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
                {subtasks.length < 4 && (
                    <Button variant="outline" size="sm" onClick={handleAddSubtask}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Subtask (up to 4)
                    </Button>
                )}
             </div>
           </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>Save Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
