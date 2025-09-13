import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import api from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar"; // ✅ Navbar will be shown

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", form);
      console.log("Login response:", res.data);
      toast.success(" Logged in Successfully");
      navigate("/addTask");
    } catch (error) {
      console.log("Error in login -> ", error);
      toast.error(" Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors">
      {/* ✅ Navbar always visible */}
      <Navbar />

      <div className="flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Welcome Back 👋
              </CardTitle>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Sign in to continue
              </p>
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
                    className="rounded-lg dark:bg-gray-800 dark:text-gray-100"
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
                      className="rounded-lg pr-10 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-lg flex items-center justify-center gap-2 text-base font-medium shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all text-white"
                  >
                    {loading ? (
                      <span className="animate-pulse">Logging in...</span>
                    ) : (
                      <>
                        <LogIn size={18} />
                        Login
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Extra Links */}
              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Don’t have an account?{" "}
                <a
                  href="/register"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  Register
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
