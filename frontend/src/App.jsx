import Routes from "./Routes.jsx";
import { ContextProvider } from "./components/utils/UserContext.jsx";

function App() {
  return (
    <ContextProvider>
      <Routes />
    </ContextProvider>
  );
}

export default App;
