import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { PokemonInfo } from "../types";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: ["random", 3],
      queryFn: async () => {
        const { data } = await axios.get<PokemonInfo | PokemonInfo[]>(
          "http://localhost:3000/pokemon/random",
          {
            params: {
              limit: 3,
            },
          },
        );
        console.log(data);
        return data;
      },
    }),
  pendingComponent: () => (
    <div className="flex flex-col items-center justify-center">
      <img src="/pikachu-loading.gif" alt="loading" className="w-96" />
      <p className="font-semibold text-3xl">Loading...</p>
    </div>
  ),
});
