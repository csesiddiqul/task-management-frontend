import type { TaskActivity } from '@/types';
import { format } from 'date-fns';

export function ActivityTimeline({ activities }: { activities: TaskActivity[] }) {
  if (!activities.length) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>;
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
          <div>
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>{' '}
              <span className="text-muted-foreground">{activity.action}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(activity.timestamp), 'MMM d, yyyy · h:mm a')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
