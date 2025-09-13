import React, { useEffect, useState } from "react";
import api from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Bot, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    subTasks: [],
  });

  // Fetch todos and normalize subtasks
  const getTodos = async () => {
    try {
      const res = await api.get("/todo");
      const normalizedTodos = res.data.todo.map(todo => ({
        ...todo,
        subTasks: (todo.subTasks || []).map(st => ({
          text: st.text,
          done: st.done || false,
        })),
      }));
      setTodos(normalizedTodos);
    } catch (error) {
      console.error("Error fetching todos: ", error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  // Toggle todo status
  const toggleStatus = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;

    const updatedStatus = todo.status === "completed" ? "pending" : "completed";
    try {
      await api.put(`/todo/update/${id}`, { status: updatedStatus });
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: updatedStatus } : t))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Toggle subtask completion
  const toggleSubTask = async (todoId, subTaskIndex) => {
    const todo = todos.find((t) => t._id === todoId);
    if (!todo) return;

    const updatedSubTasks = todo.subTasks.map((st, i) =>
      i === subTaskIndex ? { ...st, done: !st.done } : st
    );

    try {
      await api.put(`/todo/update/${todoId}`, { subTasks: updatedSubTasks });
      setTodos((prev) =>
        prev.map((t) =>
          t._id === todoId ? { ...t, subTasks: updatedSubTasks } : t
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update subtask status");
    }
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

  // Edit todo
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      status: todo.status,
      subTasks: todo.subTasks || [],
    });
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/todo/update/${editingTodo._id}`, formData);
      toast.success("Todo Updated Successfully!");
      setTodos((prev) =>
        prev.map((t) =>
          t._id === editingTodo._id ? { ...t, ...formData } : t
        )
      );
      setOpen(false);
      setEditingTodo(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to edit todo");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-6 transition-colors">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        My Todos
      </h1>

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
              <Card className="shadow-md rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-indigo-700/40 transition-all h-full flex flex-col justify-between bg-white dark:bg-gray-900">
                <div>
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                      {todo.title}
                      {todo.subTasks?.length > 0 && (
                        <Badge className="bg-indigo-600 flex items-center gap-1">
                          <Bot size={14} />
                          AI
                        </Badge>
                      )}
                    </CardTitle>
                    <Badge
                      className={`${
                        todo.status === "completed"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      } text-white capitalize transition-all`}
                    >
                      {todo.status}
                    </Badge>
                  </CardHeader>

                  <CardContent className="text-gray-600 dark:text-gray-300 space-y-4">
                    <p className="line-clamp-3">{todo.description}</p>

                    {todo.subTasks?.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Subtasks:
                        </p>
                        <ul className="space-y-2">
                          {todo.subTasks.map((sub, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={sub.done || false}
                                onChange={() => toggleSubTask(todo._id, idx)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span
                                className={`${
                                  sub.done
                                    ? "line-through text-gray-400"
                                    : "text-gray-700 dark:text-gray-200"
                                }`}
                              >
                                {sub.text}
                              </span>
                              {sub.done && (
                                <CheckCircle2
                                  size={14}
                                  className="text-green-500"
                                />
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </div>

                <div className="flex items-center justify-between p-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={todo.status === "completed"}
                      onCheckedChange={() => toggleStatus(todo._id)}
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {todo.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>

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
        <DialogContent className="bg-white dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {formData.subTasks?.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  Subtasks
                </p>
                {formData.subTasks.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={sub.text}
                      onChange={(e) => {
                        const updated = [...formData.subTasks];
                        updated[idx].text = e.target.value;
                        setFormData({ ...formData, subTasks: updated });
                      }}
                    />
                    <Switch
                      checked={sub.done || false}
                      onCheckedChange={(checked) => {
                        const updated = [...formData.subTasks];
                        updated[idx].done = checked;
                        setFormData({ ...formData, subTasks: updated });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mt-2">
              <Switch
                checked={formData.status === "completed"}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    status: checked ? "completed" : "pending",
                  })
                }
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
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
