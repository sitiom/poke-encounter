import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="dark">
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
