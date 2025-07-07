'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export function PomodoroTimer() {
  const { toast } = useToast();
  const [minutes, setMinutes] = useState(WORK_MINUTES);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsBreak(currentIsBreak => {
      setMinutes(currentIsBreak ? BREAK_MINUTES : WORK_MINUTES);
      return currentIsBreak;
    });
    setSeconds(0);
  }, []);

  const clearTimerInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          }
          setMinutes(prevMinutes => {
            if (prevMinutes > 0) {
              setSeconds(59);
              return prevMinutes - 1;
            }
            // Timer finished
            clearTimerInterval();
            toast({
                title: isBreak ? "Break's over!" : "Time for a break!",
                description: isBreak ? "Time to get back to work." : "Great work! Take a 5-minute break.",
            });
            setIsActive(false);
            setIsBreak(prev => !prev);
            return 0;
          });
          return 59;
        });
      }, 1000);
    } else {
      clearTimerInterval();
    }
    
    return () => clearTimerInterval();
  }, [isActive, toast, isBreak]);
  
  useEffect(() => {
    resetTimer();
  }, [isBreak, resetTimer]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="font-mono text-lg font-semibold tabular-nums text-muted-foreground">
        <span>{String(minutes).padStart(2, '0')}</span>:
        <span>{String(seconds).padStart(2, '0')}</span>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTimer}>
        {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        <span className="sr-only">{isActive ? 'Pause' : 'Start'} timer</span>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setIsActive(false); resetTimer()}}>
        <RotateCcw className="h-4 w-4" />
        <span className="sr-only">Reset timer</span>
      </Button>
    </div>
  );
}
