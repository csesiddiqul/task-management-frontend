import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/lib/services";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge, PriorityBadge } from "@/components/TaskBadges";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader } from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import type { Task, TaskStatus } from "@/types";

export default function TaskListPage() {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("5");

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", search, statusFilter, priorityFilter, page, perPage],
    queryFn: () =>
      taskService.getAll({
        search,
        status: statusFilter !== "all" ? statusFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
        page,
        per_page: perPage,
      }),
  });

  const tasks = data?.["data"] || [];
  const currentPage = data?.["meta"]?.["current_page"] || 1;
  const lastPage = data?.["meta"]?.["last_page"] || 1;

  const deleteMutation = useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated", {
        description: "The task has been successfully updated. View Task",
        style: {
          background: "#d4f8d9",
        },
      });
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-heading font-bold">Tasks</h1>

          <Button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> New Task
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-[250px]"
          />

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter}
            onValueChange={(v) => {
              setPriorityFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {tasks.map((task) => {
                      const overdue =
                        task.status !== "completed" &&
                        isPast(parseISO(task.due_date));

                      return (
                        <TableRow
                          key={task.id}
                          className={overdue ? "bg-destructive/5" : ""}
                        >
                          <TableCell>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {task.description}
                            </p>
                          </TableCell>

                          <TableCell>{task.assigned_to?.name || "—"}</TableCell>

                          <TableCell>
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
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>

                          <TableCell>
                            <PriorityBadge priority={task.priority} />
                          </TableCell>

                          <TableCell>
                            {format(parseISO(task.due_date), "MMM d, yyyy")}
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setEditingTask(task);
                                setShowForm(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                toast("Confirm Delete", {
                                  description:
                                    "This task will be permanently deleted.",
                                  action: {
                                    label: "Delete",
                                    onClick: () =>
                                      deleteMutation.mutate(task.id),
                                  },
                                  cancel: {
                                    label: "No",
                                    onClick: () => {},
                                  },

                                  style: {
                                    background: "#f8d4d4",
                                  },
                                })
                              }
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {tasks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          No tasks found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center p-4 gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show</span>

                    <Select
                      value={String(perPage)}
                      onValueChange={(v) => {
                        setPerPage(v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>

                    <span className="text-sm text-muted-foreground">
                      entries
                    </span>
                  </div>

                  {/* RIGHT SIDE (PAGINATION) */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Prev
                    </Button>

                    <span className="text-sm">
                      Page {currentPage} of {lastPage}
                    </span>

                    <Button
                      variant="outline"
                      disabled={currentPage === lastPage}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* FORM */}
        <TaskFormDialog
          open={showForm}
          onOpenChange={setShowForm}
          task={editingTask}
        />
      </div>
    </DashboardLayout>
  );
}
