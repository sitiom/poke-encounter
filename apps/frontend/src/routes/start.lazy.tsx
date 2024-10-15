import { Button } from "@mantine/core";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import PokemonCard from "../components/PokemonCard";
import usePokemonStore from "../store/usePokemonStore";
import { PokemonInfo } from "../types";
import { useState } from "react";
import axios from "axios";
import { Pokemon } from "pokeapi-js-wrapper";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createLazyFileRoute("/start")({
  component: Index,
});

function Index() {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonInfo | null>(
    null,
  );
  const { data: pokemons } = useSuspenseQuery<PokemonInfo[]>({
    queryKey: ["random", 3],
    queryFn: async () => {
      const { data } = await axios.get<PokemonInfo[]>(
        "http://localhost:3000/pokemon/random",
        {
          params: {
            limit: 3,
          },
        },
      );
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const navigate = useNavigate();

  if (!Array.isArray(pokemons)) {
    return null;
  }

  return (
    <div className="flex flex-col items-center pb-10">
      <h2 className="mb-5 text-xl font-semibold">
        Select your starter pokemon
      </h2>
      <div className="flex flex-wrap justify-center gap-10">
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.name}
            pokemon={pokemon}
            onClick={(selectedPokemon) => {
              setSelectedPokemon(selectedPokemon);
            }}
            selected={selectedPokemon?.name === pokemon.name}
          />
        ))}
      </div>
      <Button
        onClick={async () => {
          const { data: pokemon } = await axios.get<Pokemon>(
            `http://localhost:3000/pokemon/${selectedPokemon!.name}`,
          );
          usePokemonStore.setState({ playerPokemon: pokemon });
          navigate({ to: "/search", replace: true });
        }}
        variant="light"
        size="lg"
        className="mx-auto mt-10 transition-colors"
        radius="xl"
        disabled={!selectedPokemon}
      >
        Go!
      </Button>
    </div>
  );
}
