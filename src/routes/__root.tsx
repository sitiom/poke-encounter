import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import logo from "../assets/logo.png";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => {
    const [parent] = useAutoAnimate();
    return (
      <>
        <QueryClientProvider client={queryClient}>
          <MantineProvider defaultColorScheme="dark">
            <header className="flex my-8 flex-col items-center">
              <img src={logo} alt="logo" className="w-52" />
              <div className="font-semibold text-xl">
                React + Express Battle Simulator
              </div>
            </header>
            <div className="container w-full mx-auto px-12" ref={parent}>
              <Outlet />
            </div>
            <TanStackRouterDevtools />
            <ReactQueryDevtools />
          </MantineProvider>
        </QueryClientProvider>
      </>
    );
  },
});
