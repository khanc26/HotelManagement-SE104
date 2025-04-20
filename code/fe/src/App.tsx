import { ToastContainer } from "react-toastify";
import "./App.css";
import Router from "./router/Router";

const App = () => {
  return (
    <>
      <Router />
      <ToastContainer
        aria-label="Notification container"
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