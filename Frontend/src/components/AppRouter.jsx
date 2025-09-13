import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import Register from "./Register";
import Login from "./Login";
import AddTodo from "./AddTodo";
import TodoList from "./TodoList";
import Navbar from "../components/Navbar";
import api from "../api/api";

const AppRouter = () => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/api/auth/me", { withCredentials: true });
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) return null; 

  const ProtectedRoute = ({ children }) => (isAuth ? children : <Navigate to="/login" />);

  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    {
      path: "/addTask",
      element: (
        <ProtectedRoute>
          <Navbar />
          <AddTodo />
        </ProtectedRoute>
      ),
    },
    {
      path: "/todos",
      element: (
        <ProtectedRoute>
          <Navbar />
          <TodoList />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
