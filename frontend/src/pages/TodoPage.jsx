import React from "react";
import TodoList from "../components/TodoList";

function TodoPage() {
  return (
    <div className="h-dvh flex flex-col items-center w-full bg-wave-pattern-1 bg-cover">
      <TodoList />
    </div>
  );
}

export default TodoPage;
