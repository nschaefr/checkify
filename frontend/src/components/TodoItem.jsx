import { useEffect, useState } from "react";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";

function TodoItem(props) {
  const [editMode, setEditMode] = useState(false);
  const [editClicked, setEditClicked] = useState();
  const { name, id, category, checked, setTodos } = props;
  const [check, setCheck] = useState(checked);
  const [newName, setNewName] = useState(name);

  const deleteTodo = async (id) => {
    try {
      // Make a DELETE request to the server to delete the todo with the specified id
      const res = await fetch("http://localhost:4040/delete/" + id, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete todo.");
      }
      const data = await res.json();
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (id, _check) => {
    try {
      // Make a PUT request to the server to update the todo with the specified id
      const res = await fetch("http://localhost:4040/update/" + id, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          checked: _check,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to update todo.");
      }
      const data = await res.json();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheck = (_check) => {
    // Update the checked status of the todo
    updateTodo(id, _check);
    setCheck(_check);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    // Exit edit mode if the new name is not empty
    if (newName !== "") setEditMode(false);
    // Update the todo with the new name
    updateTodo(id);
  };

  useEffect(() => {
    // Enable edit mode whenever editMode state changes
    setEditMode(true);
  }, [editMode]);

  return (
    <div
      className={`flex flex-row items-center w-full mb-3 px-3 rounded-md${
        check ? "bg-[#FFFFFF]" : "bg-[#FFFFFF]"
      }`}
    >
      <div className="mr-3 mt-[-20px]" onClick={() => handleCheck(!check)}>
        <Checkbox
          checked={check}
          icon={<CircleOutlinedIcon />}
          checkedIcon={<CircleIcon sx={{ color: "#063773" }} />}
        />
      </div>
      <div
        className="flex font-normal flex-col w-full"
        onClick={() => setEditClicked(true)}
      >
        <div
          className={`w-11/12 overflow-x-auto ${check ? "text-[#d5d6db]" : ""}`}
        >
          {!editMode && <div className="w-full">{newName}</div>}
          {editMode && (
            <form onSubmit={(ev) => handleSubmit(ev)}>
              <input
                className="bg-white w-full rounded-md focus:outline-none"
                type="text"
                onChange={(ev) => setNewName(ev.target.value)}
                value={newName}
                disabled={!editMode}
              />
            </form>
          )}
        </div>
        <div
          className={`font-light text-[#8e93b1] w-11/12 ${
            check ? "text-[#d5d6db]" : ""
          }`}
        >
          {category}
        </div>
      </div>
      <button className="ml-auto mr-4" onClick={() => deleteTodo(id)}>
        <DeleteIcon className="text-[#F82C00] hover:text-[#c70000] ml-5" />
      </button>
    </div>
  );
}

export default TodoItem;
