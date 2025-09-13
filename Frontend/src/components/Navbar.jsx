// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import api from "../api/api";
import { toast } from "react-toastify";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, setTheme } = useTheme();

  // Check auth status
  const checkAuth = async () => {
    try {
      const res = await api.get("/api/auth/me", { withCredentials: true });
      if (res.data.user) setIsLoggedIn(true);
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout");
    }
  };

  const navItems = isLoggedIn
    ? [
        { path: "/todos", label: "Todos" },
        { path: "/addTask", label: "Add Todo" },
      ]
    : [
        { path: "/login", label: "Login" },
        { path: "/register", label: "Register" },
      ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            TodoApp
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item, i) => (
            <motion.div key={item.path} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
              <Link to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={cn(
                    "text-sm font-medium rounded-full px-5 transition-all",
                    location.pathname === item.path
                      ? "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-300 hover:text-indigo-600"
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            </motion.div>
          ))}

          {isLoggedIn && (
            <Button variant="destructive" size="sm" className="flex items-center gap-1" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </Button>
          )}

          {/* Dark Mode Switch */}
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            <Moon className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-6 space-y-6 bg-white dark:bg-gray-900">
              <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">Menu</h2>
              <div className="flex flex-col gap-3">
                {navItems.map((item, i) => (
                  <motion.div key={item.path} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
                    <Link to={item.path} onClick={() => setOpen(false)} className={cn(
                      "block py-2 px-4 rounded-lg text-sm font-medium transition-all",
                      location.pathname === item.path
                        ? "bg-indigo-600 text-white dark:bg-indigo-500"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                {isLoggedIn && (
                  <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                )}
              </div>

              {/* Dark Mode Switch - Mobile */}
              <div className="flex items-center gap-3 mt-6">
                <Sun className="h-5 w-5 text-yellow-500" />
                <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
                <Moon className="h-5 w-5 text-gray-400" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
