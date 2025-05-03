// import React from "react";
// import KanbanBoard from "../../components/KanbanBoard";
// import { useLocation } from "react-router-dom";

// const ScreeningSchedule = () => {
//   const state = useLocation();
//   return (
//     <div className="w-full overflow-scroll ">
//       <KanbanBoard state={state} />;
//     </div>
//   );
// };

// export default ScreeningSchedule;
import { useState, useEffect } from "react";
import { useUser,useClerk } from "@clerk/clerk-react";
import { TodoProvider } from "../../context/TodoContext";
import "./App.css";
import TodoForm from "../../components/TodoForm";
import TodoItem from "../../components/TodoItem";

function ScreeningSchedule() {
  const [todos, setTodos] = useState([]);
  const { isSignedIn, isLoaded } = useUser();
 const clerk = useClerk();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clerk.redirectToSignIn();
      // redirectToSignIn(); // Automatically redirects unauthenticated users
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    if (todos && todos.length > 0) {
      setTodos(todos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev]);
  };

  const updateTodo = (id, todo) => {
    setTodos((prev) =>
      prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id
          ? { ...prevTodo, completed: !prevTodo.completed }
          : prevTodo
      )
    );
  };

  // if (!isLoaded) return null; // Avoid flicker or SSR mismatch

  return (
    <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}>
      <div className="bg-slate-950 min-h-screen py-8">
        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">TRACK YOUR PROGRESS</h1>
          <div className="mb-4">
            <TodoForm />
          </div>
          <div className="flex flex-wrap gap-y-3">
            {todos.map((todo) => (
              <div key={todo.id} className="w-full">
                <TodoItem todo={todo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </TodoProvider>
  );
}

export default ScreeningSchedule;
