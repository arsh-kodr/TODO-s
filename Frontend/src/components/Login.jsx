import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import api from "../api/api";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // TODO: connect with backend /api/auth/login
    try {
      const res = api.post("/api/auth/login", form);
      console.log(res);
      toast.success("Logged in Successfully");
      navigate("/addTask")
    } catch (error) {
      console.log("Error in login -> ", error);
      toast.error("Something Went Wrong")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-4"
      >
        <Card className="shadow-md rounded-2xl bg-white border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Welcome Back
            </CardTitle>
            <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="rounded-lg"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-2 rounded-lg flex items-center justify-center gap-2 text-base font-medium shadow-sm bg-indigo-600 hover:bg-indigo-700 transition-all text-white"
              >
                <LogIn size={18} />
                Login
              </Button>
            </form>

            {/* Extra Links */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-indigo-600 font-medium hover:underline"
              >
                Register
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
