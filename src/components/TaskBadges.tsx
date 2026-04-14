import type { TaskStatus, TaskPriority } from '@/types';
import { Badge } from '@/components/ui/badge';

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-status-pending/15 text-status-pending border-status-pending/30' },
  in_progress: { label: 'In Progress', className: 'bg-status-in-progress/15 text-status-in-progress border-status-in-progress/30' },
  review: { label: 'Review', className: 'bg-status-review/15 text-status-review border-status-review/30' },
  completed: { label: 'Completed', className: 'bg-status-completed/15 text-status-completed border-status-completed/30' },
};

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-priority-high/15 text-priority-high border-priority-high/30' },
  medium: { label: 'Medium', className: 'bg-priority-medium/15 text-priority-medium border-priority-medium/30' },
  low: { label: 'Low', className: 'bg-priority-low/15 text-priority-low border-priority-low/30' },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status];
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = priorityConfig[priority];
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}
