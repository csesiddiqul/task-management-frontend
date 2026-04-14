import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/lib/services";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SummaryCard } from "@/components/SummaryCard";
import { StatusBadge, PriorityBadge } from "@/components/TaskBadges";
import { TaskProgress } from "@/components/TaskProgress";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { ListTodo, Clock, Loader, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, isPast, parseISO } from "date-fns";

export default function AdminDashboard() {
  const { data: data = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getAll,
  });

  const tasks = data?.["data"] || [];

  const counts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const recentActivities = tasks
    .flatMap((t) => t.activities || [])
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 8);

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
        <h1 className="text-2xl font-heading font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Tasks"
            value={counts.total}
            icon={<ListTodo className="h-5 w-5 text-primary" />}
            colorClass="bg-primary/10"
          />
          <SummaryCard
            title="Pending"
            value={counts.pending}
            icon={<Clock className="h-5 w-5 text-status-pending" />}
            colorClass="bg-status-pending/10"
          />
          <SummaryCard
            title="In Progress"
            value={counts.in_progress}
            icon={<Loader className="h-5 w-5 text-status-in-progress" />}
            colorClass="bg-status-in-progress/10"
          />
          <SummaryCard
            title="Completed"
            value={counts.completed}
            icon={<CheckCircle className="h-5 w-5 text-status-completed" />}
            colorClass="bg-status-completed/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-heading">
                Recent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.slice(0, 5).map((task) => {
                    const overdue =
                      task.status !== "completed" &&
                      isPast(parseISO(task.due_date));
                    return (
                      <TableRow
                        key={task.id}
                        className={overdue ? "bg-destructive/5" : ""}
                      >
                        <TableCell className="font-medium">
                          {task.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {task.assigned_to?.name || "—"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={task.status} />
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={task.priority} />
                        </TableCell>
                        <TableCell
                          className={
                            overdue
                              ? "text-destructive font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {format(parseISO(task.due_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="w-32">
                          <TaskProgress task={task} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={recentActivities} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
