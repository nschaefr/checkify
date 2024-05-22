import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function ContextProvider({ children }) {
  const [username, setLoggedInUsername] = useState();
  const [id, setId] = useState();

  useEffect(() => {
    // Make a fetch request to the /profile endpoint
    fetch("http://localhost:4040/profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        // Set the user ID and username state variables with the fetched data
        setId(data.id);
        setLoggedInUsername(data.username);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <UserContext.Provider value={{ username, setLoggedInUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
