import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import logo from "../assets/logo.png";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { CaughtPokemonInfo } from "../types";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: () => {
      const [parent] = useAutoAnimate();
      const { data: caughtPokemon } = useSuspenseQuery<CaughtPokemonInfo[]>({
        queryKey: ["caughtPokemon"],
        queryFn: async () => {
          const { data } = await axios.get<CaughtPokemonInfo[]>(
            "http://localhost:3000/caught-pokemon",
          );
          return data;
        },
      });

      return (
        <>
          <header className="my-8 flex flex-col items-center">
            <img src={logo} alt="logo" className="w-52" />
            <div className="text-xl font-semibold">Battle Simulator</div>
            <div className="text-xl font-semibold">
              Caught: {caughtPokemon.length}
            </div>
          </header>
          <div className="container mx-auto px-8" ref={parent}>
            <Outlet />
          </div>
          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </>
      );
    },
    loader: async ({ context: { queryClient } }) => {
      queryClient.ensureQueryData({
        queryKey: ["caughtPokemon"],
        queryFn: async () => {
          const { data } = await axios.get<CaughtPokemonInfo[]>(
            "http://localhost:3000/caught-pokemon",
          );
          return data;
        },
      });
    },
  },
);
