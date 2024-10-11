import { Button } from "@mantine/core";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import PokemonCard from "../components/PokemonCard";
import usePokemonStore from "../store/usePokemonStore";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { selectedPokemon, setSelectedPokemon } = usePokemonStore();
  const pokemons = Route.useLoaderData();
  const navigate = useNavigate();

  if (!Array.isArray(pokemons)) {
    return null;
  }

  return (
    <div className="flex flex-col items-center pb-10">
      <div className="flex justify-center gap-10">
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
        onClick={() => {
          navigate({ to: "/search" });
        }}
        variant="light"
        size="lg"
        className="mt-10 mx-auto transition-colors"
        radius="xl"
        disabled={!selectedPokemon}
      >
        Go!
      </Button>
    </div>
  );
}
