import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/lib/services";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge, PriorityBadge } from "@/components/TaskBadges";
import { TaskProgress } from "@/components/TaskProgress";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Calendar } from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import { toast } from "sonner";
import type { TaskStatus } from "@/types";

export default function MyTasksPage() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: taskService.getMyTasks,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
      toast.success("Task updated", {
        description: "The task has been successfully updated. View Task",
        style: {
          background: "#d4f8d9",
        },
      });
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-bold">My Tasks</h1>

        {tasks.length === 0 ? (
          <Card className="border-none shadow-sm">
            <CardContent className="py-12 text-center text-muted-foreground">
              No tasks assigned to you yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map((task) => {
              const overdue =
                task.status !== "completed" && isPast(parseISO(task.due_date));
              return (
                <Card
                  key={task.id}
                  className={`border-none shadow-sm hover:shadow-md transition-shadow ${overdue ? "ring-2 ring-destructive/30" : ""}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-heading leading-tight">
                        {task.title}
                      </CardTitle>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span
                          className={
                            overdue ? "text-destructive font-medium" : ""
                          }
                        >
                          {format(parseISO(task.due_date), "MMM d, yyyy")}
                          {overdue && " (Overdue)"}
                        </span>
                      </div>
                      <Select
                        value={task.status}
                        onValueChange={(val) =>
                          statusMutation.mutate({
                            id: task.id,
                            status: val as TaskStatus,
                          })
                        }
                      >
                        <SelectTrigger className="w-auto border-0 p-0 h-auto shadow-none">
                          <StatusBadge status={task.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <TaskProgress task={task} />
                    {task.activities && task.activities.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Activity
                        </p>
                        <ActivityTimeline
                          activities={task.activities.slice(-2)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
