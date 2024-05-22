import { useContext } from "react";
import { UserContext } from "./components/utils/UserContext";
import LoginPage from "./pages/LoginPage";
import TodoPage from "./pages/TodoPage";

function Routes() {
  const { username } = useContext(UserContext);

  if (username) {
    return (
      <div>
        <TodoPage />
      </div>
    );
  }

  return (
    <div>
      <LoginPage />
    </div>
  );
}

export default Routes;
