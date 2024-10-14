import { createFileRoute, redirect } from "@tanstack/react-router";
import usePokemonStore from "../store/usePokemonStore";
import { extractPokemonData } from "../utils/pokemon";

export const Route = createFileRoute("/battle")({
  beforeLoad: () => {
    if (
      usePokemonStore.getState().playerPokemon === null ||
      usePokemonStore.getState().opponentPokemon === null
    ) {
      throw redirect({
        to: "/",
      });
    }
  },
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData({
      queryKey: ["player", usePokemonStore.getState().playerPokemon!],
      queryFn: async () => {
        return extractPokemonData(usePokemonStore.getState().playerPokemon!);
      },
    });
    queryClient.ensureQueryData({
      queryKey: ["opponent", usePokemonStore.getState().opponentPokemon!],
      queryFn: async () => {
        return extractPokemonData(usePokemonStore.getState().opponentPokemon!);
      },
    });
  },
  pendingComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <img src="/pikachu-loading.gif" alt="loading" className="w-96" />
        <p className="text-3xl font-semibold">Loading...</p>
      </div>
    );
  },
});
