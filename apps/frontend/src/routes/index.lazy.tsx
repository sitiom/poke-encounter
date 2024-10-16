import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useQueries, useSuspenseQuery } from "@tanstack/react-query";
import { Pokemon } from "pokeapi-js-wrapper";
import PokemonCard from "../components/PokemonCard";
import { Button } from "@mantine/core";
import { CaughtPokemonInfo, PokemonInfo } from "../types";
import axios from "axios";
import { useSortable } from "@dnd-kit/react/sortable";

export const Route = createLazyFileRoute("/")({
  component: CaughtPokemons,
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
      <div className="flex flex-wrap justify-center gap-10">
        {results.map(({ data, isLoading, isSuccess }, index) => {
          let caughtAt = isSuccess
            ? caughtPokemon.find((pokemon) => pokemon._id === data._id)!
                .caughtAt
            : undefined;
          if (typeof caughtAt === "string") {
            caughtAt = new Date(caughtAt);
          }
          return isLoading ? null : (
            <SortablePokemonCard
              key={data!._id}
              pokemon={data!}
              caughtAt={caughtAt!}
              index={index}
            />
          );
        })}
      </div>
      <Link to="/start">
        <Button
          variant="filled"
          size="xl"
          className="mx-auto my-10 transition-colors"
          radius="xl"
        >
          {caughtPokemon.length === 0 ? "Start " : "Continue"}
        </Button>
      </Link>
    </div>
  );
}

interface SortablePokemonCardProps {
  pokemon: PokemonInfo;
  caughtAt: Date;
  index: number;
}

const SortablePokemonCard = ({
  pokemon,
  caughtAt,
  index,
}: SortablePokemonCardProps) => {
  const { ref } = useSortable({ id: pokemon._id, index });

  return <PokemonCard ref={ref} pokemon={pokemon} caughtAt={caughtAt} />;
};
