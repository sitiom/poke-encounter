import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useState } from "react";
import PokemonCard from "../components/PokemonCard";
import { PokemonInfo } from "../types";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const [limit] = useState(3);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["random", limit],
    queryFn: async () => {
      const { data } = await axios.get<PokemonInfo | PokemonInfo[]>(
        "http://localhost:3000/pokemon/random",
        {
          params: {
            limit,
          },
        },
      );
      console.log(data);
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img src="/pikachu-loading.gif" alt="loading" className="w-96" />
        <p className="font-semibold text-3xl">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return <div>Error!</div>;
  }

  // Return null if data is not an array
  if (!Array.isArray(data)) {
    return null;
  }

  return (
    <>
      <div className="flex justify-center gap-10">
        {data.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>
    </>
  );
}
