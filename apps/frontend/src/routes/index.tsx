import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { CaughtPokemonInfo} from "../types";

export const Route = createFileRoute("/")({
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
});
