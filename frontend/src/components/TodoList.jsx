import { useState, useEffect, useContext } from "react";
import { UserContext } from "./utils/UserContext";
import TodoItem from "./TodoItem";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";

function TodoList() {
  const { setLoggedInUsername, setId } = useContext(UserContext);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("");
  const [tab, setTab] = useState("all");
  const [categoryArray, setCategoryArray] = useState([]);
  const check = false;

  const getTodos = async () => {
    try {
      // Fetch all todos from the server
      const res = await fetch("http://localhost:4040/todo", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch todos.");
      }
      const data = await res.json();
      setTodos(data);
      const categories = data.map((todo) => todo.category);
      setCategoryArray([...new Set(categories)]);
    } catch (err) {
      console.error("Error fetching todos.", err);
    }
  };

  const addTodo = async () => {
    try {
      // Send a POST request to add a new todo
      const res = await fetch("http://localhost:4040/new", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: input,
          category: category,
          checked: check,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to add todo.");
      }
      const data = await res.json();
      // Clear input fields and refresh the todo list
      setInput("");
      setCategory("");
      getTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    // Validate input and category before adding a new todo
    if (category && input !== "") {
      addTodo();
    } else window.alert("Missing category and/or taskname.");
  };

  const handleLogout = async () => {
    try {
      // Send a POST request to log out the user
      const res = await fetch("http://localhost:4040/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to log out.");
      }
      // Clear logged in user information
      setLoggedInUsername(null);
      setId(null);
    } catch (err) {
      console.error("Error logging out.", err);
    }
  };

  useEffect(() => {
    // Fetch todos when the component mounts
    getTodos();
  }, []);

  useEffect(() => {
    // Update category array to include only categories that have todos
    const updatedCategoryArray = categoryArray.filter((category) =>
      todos.some((todo) => todo.category === category)
    );
    setCategoryArray(updatedCategoryArray);
  }, [todos]);

  useEffect(() => {
    // Check if the current tab category still has todos
    if (tab !== "all" && !todos.some((todo) => todo.category === tab)) {
      // If no todos exist in the current category, set tab to "all"
      setTab("all");
    }
  }, [categoryArray]);

  return (
    <div className="max-w-full md:w-[700px] bg-[#FFFFFF] pt-4 pb-4 m-20 rounded-lg shadow-lg divide-y">
      <div className="divide-y mb-6 w-full">
        <div className="flex w-full">
          <div className="flex w-11/12 overflow-x-auto">
            <div
              className="flex items-center px-5 mb-3.5"
              onClick={() => setTab("all")}
            >
              <div
                className={`font-medium text-lg underline-offset-[17.5px] decoration-[2.5px] decoration-[#063773] cursor-pointer ${
                  tab === "all" ? "text-[#27374D] underline" : "text-[#aeb0bf]"
                }`}
              >
                All
              </div>
              <div className="bg-[#f8f8fb] ml-1.5 text-[#aeb0bf] text-[15px] font-medium rounded-full px-1">
                {todos.length}
              </div>
            </div>
            <div className="flex items-center mb-3.5">
              <div className={`flex font-medium text-lg`}>
                {categoryArray.map((category, index) => (
                  <div className="flex mr-5" key={index}>
                    <div
                      onClick={() => setTab(category)}
                      className={`${
                        tab === `${category}`
                          ? "text-[#27374D] underline"
                          : "text-[#aeb0bf]"
                      } underline-offset-[17.5px] decoration-[2.5px] decoration-[#063773] cursor-pointer`}
                    >
                      {category}
                    </div>
                    <div className="bg-[#f8f8fb] ml-1.5 text-[#aeb0bf] text-[15px] font-medium rounded-full px-1">
                      {todos.filter((todo) => todo.category == category).length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="ml-auto px-6 cursor-pointer"
            onClick={() => handleLogout()}
          >
            <LogoutIcon fontSize="small" />
          </div>
        </div>
        <div className="pt-7 px-5">
          <div>
            <form onSubmit={(ev) => handleSubmit(ev)}>
              <div className="flex flex-row justify-between">
                <div className="">
                  <input
                    className="w-full rounded-md focus:outline-none pl-1 font-normal text-md"
                    type="text"
                    value={input}
                    placeholder="Something to do..."
                    onChange={(ev) => setInput(ev.target.value)}
                  ></input>
                  <input
                    className="w-full rounded-md focus:outline-none pl-1 font-light text-sm"
                    type="text"
                    value={category}
                    placeholder="Category"
                    onChange={(ev) => setCategory(ev.target.value)}
                    maxLength={"20"}
                  ></input>
                </div>
                <div className="pr-2">
                  <button
                    className="flex flex-row items-center bg-[#063773] hover:bg-[#052d5e] text-white font-medium py-2 px-2 ml-4 rounded-xl"
                    onClick={(ev) => handleSubmit(ev)}
                    type="submit"
                  >
                    <AddIcon />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="pt-6">
        {todos
          .filter((todo) => tab === "all" || todo.category === tab)
          .map((todo) => {
            const { _id, name, category, checked } = todo;
            return (
              <TodoItem
                id={_id}
                name={name}
                category={category}
                checked={checked}
                setTodos={setTodos}
                key={todo._id}
              />
            );
          })}
      </div>
    </div>
  );
}

export default TodoList;
