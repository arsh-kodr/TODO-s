import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "../api/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const AddTodo = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value) => {
    setForm({ ...form, status: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.status) {
      toast.error("⚠️ Please fill all fields before submitting!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/todo/create", form);
      console.log("Todo added:", res.data);
      toast.success("✅ Todo Created Successfully!");
      setForm({ title: "", description: "", status: "" });
      navigate("/todos");
    } catch (err) {
      console.error("Error adding todo:", err);
      toast.error("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950 p-4 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Add New Task
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Create and manage your todos with ease 
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter task title"
                  value={form.title}
                  onChange={handleChange}
                  disabled={loading}
                  className="rounded-lg transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  name="description"
                  placeholder="Enter task description..."
                  value={form.description}
                  onChange={handleChange}
                  disabled={loading}
                  className="rounded-lg transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                  rows={4}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  onValueChange={handleStatusChange}
                  value={form.status}
                  disabled={loading}
                >
                  <SelectTrigger className="rounded-lg dark:bg-gray-800 dark:text-gray-100">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:text-gray-100">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit */}
              <motion.div whileTap={{ scale: loading ? 1 : 0.95 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-lg flex items-center justify-center gap-2 text-base font-medium shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      Add Task
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddTodo;
