import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Register from "./Register";
import Login from "./Login";
import AddTodo from "./AddTodo";
import TodoList from "./TodoList";

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />, // default → login page
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
        path : "/addTask",
        element : <AddTodo />
    }, {

      path : "/todos",
      element : <TodoList />

    }
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
