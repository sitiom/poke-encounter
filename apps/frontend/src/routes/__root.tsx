import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import logo from "../assets/logo.png";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: () => {
      const [parent] = useAutoAnimate();
      return (
        <>
          <header className="flex my-8 flex-col items-center">
            <img src={logo} alt="logo" className="w-52" />
            <div className="font-semibold text-xl">
              React + Express Battle Simulator
            </div>
          </header>
          <div className="container mx-auto px-12" ref={parent}>
            <Outlet />
          </div>
          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </>
      );
    },
  },
);
