import Router from "./router/Router";
import "./App.css";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
};

export default App;
