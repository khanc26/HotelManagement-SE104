import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "./components/ui/button.tsx";
import { HeroUIProvider } from "@heroui/react";

interface ResponseError extends Error {
  response?: {
    status: number;
  };
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const typedError = error as ResponseError;
      
      // // Handle network/CORS errors
      // if (error.message.includes('Unable to connect to the server')) {
      //   console.error('Connection Error:', error);
      //   return; // Don't show toast for network errors
      // }

      if (typedError?.response?.status === 401) {
        toast.error(
          <div>
            <p>Your session has expired. Return to login page?</p>
            <Button
              onClick={() => {
                window.location.href = "/auth/sign-in";
              }}
              className="mt-2"
            >
              Go to Login
            </Button>
          </div>,
          {
            autoClose: false,
            closeOnClick: false,
            draggable: false,
          }
        );
        localStorage.removeItem("access_token");
      } else {
        toast.error(`API Error: ${error.message || "An error occurred"}`);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _, __, mutation) => {
      const { mutationKey } = mutation.options;
      const typedError = error as ResponseError;

      if (typedError?.response?.status === 401) {
        toast.error(
          <div>
            <p>Your session has expired. Return to login page?</p>
            <Button
              onClick={() => {
                window.location.href = "/auth/sign-in";
              }}
              className="mt-2"
            >
              Go to Login
            </Button>
          </div>,
          {
            autoClose: false,
            closeOnClick: false,
            draggable: false,
          }
        );
        localStorage.removeItem("access_token");
      } else {
        toast.error(
          `API Mutation Error${
            mutationKey ? `: ${mutationKey.join(", ")}` : ""
          }`
        );
      }
    },
  }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </QueryClientProvider>
  </StrictMode>
);
