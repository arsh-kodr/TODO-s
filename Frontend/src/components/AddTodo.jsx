import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "../api/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const AddTodo = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value) => {
    setForm({ ...form, status: value });
  };

  const  handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.status) {
      alert("Please fill all fields ");
      return;
    }
     try {
    const res = await api.post("/todo/create", form);
    console.log("Todo added :", res.data);
    toast.success("Todo Created Successfully!")
    setForm({ title: "", description: "", status: "" });
    navigate("/todos")
    
  } catch (err) {
    console.error("Error adding todo:", err);
    toast.error("Something went wrong");
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-lg rounded-2xl bg-white border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Add New Task
            </CardTitle>
            <p className="text-gray-500 text-sm mt-1">
              Create and manage your todos easily 
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
             
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter task title"
                  value={form.title}
                  onChange={handleChange}
                  className="rounded-lg"
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
                  className="rounded-lg"
                  rows={4}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select onValueChange={handleStatusChange} value={form.status}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending"> Pending</SelectItem>
                    <SelectItem value="completed"> Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full py-2 rounded-lg flex items-center justify-center gap-2 text-base font-medium shadow-sm bg-indigo-600 hover:bg-indigo-700 transition-all text-white"
              >
                <PlusCircle size={18} />
                Add Task
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddTodo;
