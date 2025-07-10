'use client';

import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartTooltipContent } from '@/components/ui/chart';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import type { Author } from '@/types';

interface MonthlyProgressProps {
  author: Author;
}

export function MonthlyProgress({ author }: MonthlyProgressProps) {
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const tasksInMonth = author.tasks.filter(task =>
      isWithinInterval(new Date(task.deadline), { start: monthStart, end: monthEnd })
    );

    const completedTasks = tasksInMonth.filter(task => {
        if (task.subtasks.length === 0) return false; // Or based on another completion criteria
        return task.subtasks.every(st => st.completed)
    }).length;

    const totalTasks = tasksInMonth.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const chartData = [
      { name: 'Progress', value: progress, fill: 'hsl(var(--primary))' },
    ];

    return { completedTasks, totalTasks, progress, chartData };
  }, [author]);
  
  const monthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <Card className="mb-4 md:mb-6">
      <CardHeader>
        <CardTitle>{monthName} Progress</CardTitle>
        <CardDescription>
          You've completed {monthlyStats.completedTasks} of {monthlyStats.totalTasks} tasks this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={50}>
          <BarChart layout="vertical" data={monthlyStats.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-1 gap-1.5">
                              <span className="text-sm font-bold">{`${Math.round(payload[0].value as number)}% complete`}</span>
                            </div>
                          </div>
                        )
                      }
                      return null
                }}
            />
            <Bar dataKey="value" radius={[50, 50, 50, 50]} background={{ fill: 'hsl(var(--muted))', radius: 50 }} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
