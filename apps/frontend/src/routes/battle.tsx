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
  loader: async () => {
    const player = extractPokemonData(
      usePokemonStore.getState().playerPokemon!,
    );
    const opponent = extractPokemonData(
      usePokemonStore.getState().opponentPokemon!,
    );

    const result = await Promise.all([player, opponent]);

    return { player: result[0], opponent: result[1] };
  },
  pendingComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <img src="/pikachu-loading.gif" alt="loading" className="w-96" />
        <p className="font-semibold text-3xl">Loading...</p>
      </div>
    );
  },
});
