import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { CaughtPokemonInfo, PokemonInfo } from "../types";
import { useQueries, useSuspenseQuery } from "@tanstack/react-query";
import { Pokemon } from "pokeapi-js-wrapper";
import PokemonCard from "../components/PokemonCard";

export const Route = createFileRoute("/caught-pokemons")({
  component: CaughtPokemons,
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

function CaughtPokemons() {
  const { data: caughtPokemon } = useSuspenseQuery<CaughtPokemonInfo[]>({
    queryKey: ["caughtPokemon"],
    queryFn: async () => {
      const { data } = await axios.get<CaughtPokemonInfo[]>(
        "http://localhost:3000/caught-pokemon",
      );
      return data;
    },
  });

  const results = useQueries({
    queries: caughtPokemon.map((pokemon) => ({
      queryKey: ["pokemon", pokemon._id],
      queryFn: async (): Promise<PokemonInfo> => {
        const { data } = await axios.get<Pokemon>(
          `http://localhost:3000/pokemon/${pokemon.name}`,
        );
        return {
          _id: pokemon._id!,
          name: data.name,
          species: {
            name: data.species.name,
            url: data.species.url,
          },
          cry: data.cries.latest,
          types: data.types,
          id: data.id,
          sprites: {
            front: data.sprites.other.showdown.front_default!,
            back: data.sprites.other.showdown.back_default!,
          },
          stats: data.stats,
        };
      },
    })),
  });

  return (
    <div className="mb-10 flex flex-col items-center">
      <div className="grid grid-cols-3 gap-10">
        {results.map(({ data, isLoading, isSuccess }) => {
          let caughtAt = isSuccess
            ? caughtPokemon.find((pokemon) => pokemon._id === data._id)!
                .caughtAt
            : undefined;
          if (typeof caughtAt === "string") {
            caughtAt = new Date(caughtAt);
          }
          return isLoading ? null : (
            <PokemonCard key={data!._id} pokemon={data!} caughtAt={caughtAt} />
          );
        })}
      </div>
    </div>
  );
}
