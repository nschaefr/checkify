import { useState, useEffect, useContext } from "react";
import { UserContext } from "./utils/UserContext";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";

function LoginForm() {
  const { setLoggedInUsername, setId } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValidPassword, setPasswordValidation] = useState(null);
  const [isValidUsername, setUsernameValidation] = useState(null);
  const [isValidAccount, setAccountValidation] = useState(null);
  const [isLongEnoughP, setLongEnoughP] = useState(null);
  const [isLongEnoughU, setLongEnoughU] = useState(null);
  const validPassword = "^(.){8,}$";
  const validUsername = "^(.){1,}$";

  const validatePassword = (password) => {
    // Check if the password matches the valid password pattern
    if (password && password.match(validPassword)) {
      setPassword(password);
      setPasswordValidation(true);
    } else {
      setPasswordValidation(false);
    }
  };

  const validateUsername = (username) => {
    // Check if the username matches the valid username pattern
    if (username && username.match(validUsername)) {
      setUsername(username);
      setUsernameValidation(true);
    } else {
      setUsernameValidation(false);
    }
  };

  async function submitHandler() {
    try {
      // Make a POST request to the server to log in
      const response = await fetch("http://localhost:4040/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      const data = await response.json();
      // If login is successful, set the logged-in username and user ID
      if (data.valid) {
        setLoggedInUsername(username);
        setId(data.id);
      } else {
        setAccountValidation(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleLogin = (ev) => {
    ev.preventDefault();
    // Validate the username and password before submitting
    if (isValidPassword) {
      if (isValidUsername) {
        void submitHandler();
      } else {
        setLongEnoughU(false);
      }
    } else {
      setLongEnoughP(false);
    }
  };

  useEffect(() => {
    // Reset validation states when username or password changes
    setLongEnoughP(null);
    setLongEnoughU(null);
    setAccountValidation(null);
  }, [username, password]);

  return (
    <div className="bg-[#FFFFFF] text-[#021833] w-[800px] rounded-lg m-12 shadow-lg flex flex-col items-center md:items-start mb-28 md:bg-wave-pattern md:bg-cover">
      <div className="p-12 w-[400px] md:ml-auto">
        <form className="text-center" onSubmit={(ev) => handleLogin(ev)}>
          <div className="mb-2 font-bold text-lg flex items-center justify-center">
            <p className="mr-2 text-3xl">CHECKIFY</p>
            <LibraryAddCheckIcon fontSize="medium" />
          </div>
          <div className="text-md leading-[22px]">
            Login with your already existing username or register with a new
            one.
          </div>
          <input
            className="outline outline-1 outline-[#aeb0bf] py-2 px-4 text-md mt-8 rounded-lg"
            type="name"
            onChange={(ev) => validateUsername(ev.target.value)}
            placeholder="Username"
          ></input>
          {isLongEnoughU === false && (
            <p className="mt-1 text-[#F82C00] text-sm">
              Username cannot be empty.
            </p>
          )}
          <input
            className="mt-4 outline outline-1 outline-[#aeb0bf] py-2 px-4 text-md rounded-lg"
            type="password"
            onChange={(ev) => validatePassword(ev.target.value)}
            placeholder="Password"
          ></input>
          {isValidAccount === false && (
            <p className="mt-1 text-[#F82C00] text-sm">Incorrect password.</p>
          )}
          {isLongEnoughP === false && (
            <p className="mt-1 text-[#F82C00] text-sm">
              Password should have at least 8 characters.
            </p>
          )}
          <div className="mt-7 flex flex-row justify-center">
            <button
              className="flex flex-row items-center bg-[#063773] hover:bg-[#052d5e] text-white font-medium py-2 px-4 rounded-xl"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
