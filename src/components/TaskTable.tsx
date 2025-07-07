'use client'
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, PlusCircle, Edit, Trash2, ChevronDown, FileText } from 'lucide-react';
import type { Author, Task } from '@/types';
import { PomodoroTimer } from './PomodoroTimer';
import { TaskDialog } from './TaskDialog';
import { NotesDialog } from './NotesDialog';
import { format, isPast } from 'date-fns';

interface TaskTableProps {
  author: Author;
  onUpdateAuthor: (author: Author) => void;
}

export function TaskTable({ author, onUpdateAuthor }: TaskTableProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [viewingNotesTask, setViewingNotesTask] = useState<Task | null>(null);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = author.tasks.filter(t => t.id !== taskId);
    onUpdateAuthor({ ...author, tasks: updatedTasks });
  };
  
  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      const updatedTasks = author.tasks.map(t =>
        t.id === editingTask.id ? { 
            ...t, 
            ...taskData,
            subtasks: taskData.subtasks.map((st, i) => ({
                id: t.subtasks[i]?.id || `sub-${t.id}-${Date.now()}-${i}`,
                description: st.description,
                completed: t.subtasks[i]?.completed || false
            }))
        } : t
      );
      onUpdateAuthor({ ...author, tasks: updatedTasks });
    } else {
      const newTaskId = `task-${Date.now()}`;
      const newTask: Task = {
        ...taskData,
        id: newTaskId,
        subtasks: taskData.subtasks.map((st, i) => ({ ...st, id: `sub-${newTaskId}-${i}`, completed: false })),
      };
      onUpdateAuthor({ ...author, tasks: [...author.tasks, newTask] });
    }
    setIsTaskDialogOpen(false);
    setEditingTask(null);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const updatedTasks = author.tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(subtask =>
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
          ),
        };
      }
      return task;
    });
    onUpdateAuthor({ ...author, tasks: updatedTasks });
  };
  
  const handleSaveNotes = (taskId: string, notes: string) => {
    const updatedTasks = author.tasks.map(task =>
        task.id === taskId ? { ...task, notes } : task
    );
    onUpdateAuthor({ ...author, tasks: updatedTasks });
    setIsNotesDialogOpen(false);
  }
  
  const getPriorityBadgeVariant = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
      default:
        return 'outline';
    }
  };

  return (
    <>
       <div className="flex justify-end mb-4">
        <Button onClick={handleAddTask} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Task Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Timer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {author.tasks.map(task => (
              <Collapsible asChild key={task.id}>
                <>
                  <TableRow className={isPast(new Date(task.deadline)) && !task.subtasks.every(st => st.completed) ? 'bg-destructive/10' : ''} data-state={task.subtasks.every(st => st.completed) ? 'completed' : 'pending'}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {task.subtasks.length > 0 && (
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
                            </Button>
                          </CollapsibleTrigger>
                        )}
                        <span className="font-medium">{task.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={isPast(new Date(task.deadline)) ? 'text-destructive font-medium' : ''}>
                        {format(new Date(task.deadline), 'PP')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <PomodoroTimer />
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => { setViewingNotesTask(task); setIsNotesDialogOpen(true); }}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Notes</span>
                        </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Task actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditTask(task)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                              <AlertDialogTrigger className="w-full">
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                  </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete the task and all its subtasks.
                                      </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteTask(task.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Continue</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {task.subtasks.length > 0 && (
                    <CollapsibleContent asChild>
                       <TableRow>
                          <TableCell colSpan={5} className="p-0">
                            <div className="p-4 pl-16 bg-muted/50">
                                <h4 className="font-semibold mb-2">Subtasks</h4>
                                <div className="space-y-2">
                                  {task.subtasks.map(subtask => (
                                    <div key={subtask.id} className="flex items-center gap-2">
                                      <Checkbox
                                        id={`subtask-${subtask.id}`}
                                        checked={subtask.completed}
                                        onCheckedChange={() => handleToggleSubtask(task.id, subtask.id)}
                                      />
                                      <label
                                        htmlFor={`subtask-${subtask.id}`}
                                        className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                                      >
                                        {subtask.description}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                            </div>
                          </TableCell>
                       </TableRow>
                    </CollapsibleContent>
                  )}
                </>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </div>
      {isTaskDialogOpen && <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => { setIsTaskDialogOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
      />}
       {isNotesDialogOpen && viewingNotesTask && <NotesDialog
        isOpen={isNotesDialogOpen}
        onClose={() => { setIsNotesDialogOpen(false); setViewingNotesTask(null); }}
        onSave={handleSaveNotes}
        task={viewingNotesTask}
      />}
    </>
  );
}
