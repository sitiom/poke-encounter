import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import logo from "../assets/logo.png";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { CaughtPokemonInfo } from "../types";
import { Anchor } from "@mantine/core";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import route234 from "../assets/route-234.ogg";
import newGame from "../assets/new-game.ogg";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: () => {
      const [parent] = useAutoAnimate();
      const router = useRouterState();
      const player = useGlobalAudioPlayer();

      useEffect(() => {
        console.log(router.location.href);
        console.log(player.src);
        if (router.location.href === "/" && player.src !== newGame) {
          player.load(newGame, {
            autoplay: true,
            loop: true,
          });
          player.play();
        } else if (
          (router.location.href === "/start" ||
            router.location.href === "/search") &&
          player.src !== route234
        ) {
          player.load(route234, {
            autoplay: true,
            loop: true,
          });
          player.play();
        }
      }, [router.location.href, player.src]);

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
          <img
            src="/battle-bg-animated.gif"
            alt="battle-bg"
            className={twMerge(
              "pointer-events-none fixed inset-0 z-[-1] h-full w-full object-cover object-center transition-opacity",
              router.location.href === "/" ? "opacity-50" : "opacity-10",
            )}
          />
          <Link to="/">
            <header className="mt-8 flex flex-col items-center">
              <img src={logo} alt="logo" className="w-52" />
              <div className="text-xl font-semibold">Battle Simulator</div>
            </header>
          </Link>
          <div className="mb-8 flex justify-center">
            {caughtPokemon.length !== 0 &&
              (router.location.href !== "/battle" &&
              router.location.href !== "/" ? (
                <Link to="/">
                  <Anchor className="mx-auto text-lg">
                    Caught: {caughtPokemon.length}
                  </Anchor>
                </Link>
              ) : (
                <div className="text-lg">Caught: {caughtPokemon.length}</div>
              ))}
          </div>
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
