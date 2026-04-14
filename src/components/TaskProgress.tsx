import type { Task } from '@/types';
import { Progress } from '@/components/ui/progress';

const statusProgress: Record<string, number> = {
  pending: 0,
  in_progress: 40,
  review: 75,
  completed: 100,
};

export function TaskProgress({ task }: { task: Task }) {
  const value = statusProgress[task.status] ?? 0;
  return (
    <div className="space-y-1">
      <Progress value={value} className="h-2" />
      <p className="text-xs text-muted-foreground text-right">{value}%</p>
    </div>
  );
}
