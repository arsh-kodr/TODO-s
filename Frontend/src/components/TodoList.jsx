import React, { useEffect, useState } from "react";
import api from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", status: "pending" });

  // Fetch todos
  const getTodos = async () => {
    try {
      const res = await api.get("/todo");
      setTodos(res.data.todo);
    } catch (error) {
      console.error("Error in fetching todos: ", error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  // Toggle status (only frontend)
  const toggleStatus = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id
          ? { ...todo, status: todo.status === "completed" ? "pending" : "completed" }
          : todo
      )
    );
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todo/delete/${id}`);
      toast.success("Todo deleted!");
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete todo");
    }
  };

  // Open modal with selected todo
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({ title: todo.title, description: todo.description, status: todo.status });
    setOpen(true);
  };

  // Update todo
  const handleUpdate = async () => {
    try {
      const res = await api.put(`/todo/update/${editingTodo._id}`, formData);
      toast.success("Todo Updated Successfully!!");
      setTodos((prev) =>
        prev.map((t) => (t._id === editingTodo._id ? { ...t, ...formData } : t))
      );
      setOpen(false);
      setEditingTodo(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to Edit todo");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        My Todos
      </h1>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-md rounded-2xl border border-gray-200 hover:shadow-lg transition-all h-full flex flex-col justify-between">
                <div>
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {todo.title}
                    </CardTitle>
                    <Badge
                      className={`${
                        todo.status === "completed"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      } text-white`}
                    >
                      {todo.status}
                    </Badge>
                  </CardHeader>

                  <CardContent className="text-gray-600 space-y-4">
                    <p>{todo.description}</p>
                  </CardContent>
                </div>

                {/* Footer with actions */}
                <div className="flex items-center justify-between p-4 border-t">
                  {/* Status Switch */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={todo.status === "completed"}
                      onCheckedChange={() => toggleStatus(todo._id)}
                    />
                    <span className="text-sm text-gray-500">
                      {todo.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleEdit(todo)}
                    >
                      <Pencil size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => deleteTodo(todo._id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.status === "completed"}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, status: checked ? "completed" : "pending" })
                }
              />
              <span className="text-sm text-gray-600">
                {formData.status === "completed" ? "Completed" : "Pending"}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoList;
