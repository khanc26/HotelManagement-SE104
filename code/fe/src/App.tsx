import Router from "./router/Router";
import "./App.css";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <Router />
      <Toaster />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
