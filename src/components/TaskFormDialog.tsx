import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/lib/services";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Task, TaskFormData, TaskStatus, TaskPriority } from "@/types";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
}: TaskFormDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!task;

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: "",
    assigned_to: "",
  });

  const { data: response = [] } = useQuery({
    queryKey: ["members"],
    queryFn: taskService.getMembers,
  });

  const members = response["users"] || [];

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
        assigned_to: task.assigned_to?.id || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: "",
        assigned_to: "",
      });
    }
  }, [task, open]);

  const createMutation = useMutation({
    mutationFn: (data: TaskFormData) => taskService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created");
      onOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TaskFormData) => taskService.update(task!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated", {
        description: "The task has been successfully updated. View Task",
        style: {
          background: "#d4f8d9",
        },
      });

      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {isEditing ? "Edit Task" : "Create Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Task title"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Task description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) =>
                  setFormData((p) => ({ ...p, status: v as TaskStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(v) =>
                  setFormData((p) => ({ ...p, priority: v as TaskPriority }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData((p) => ({ ...p, due_date: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Assign To</Label>
            <Select
              value={String(formData.assigned_to || "")}
              onValueChange={(v) =>
                setFormData((p) => ({ ...p, assigned_to: v }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.name}{" "}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
