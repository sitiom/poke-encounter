import { Card, Group, Badge, Button, Image, Text } from "@mantine/core";
import { PokemonInfo } from "../types";

interface PokemonCardProps {
  pokemon: PokemonInfo;
}

const typeColors: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

function PokemonCard({ pokemon }: PokemonCardProps) {
  const titlecasedName = pokemon.name
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  const pokedexNumber = "#" + pokemon.id.toString().padStart(3, "0");

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="w-80">
      <Image
        src={pokemon.sprites.front}
        alt="Sprite"
        className="aspect-square object-contain"
      />

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>
          {pokedexNumber} {titlecasedName}
        </Text>
        <div className="space-x-2">
          {pokemon.types.map((type) => (
            <Badge key={type.type.name} color={typeColors[type.type.name]}>
              {type.type.name}
            </Badge>
          ))}
        </div>
      </Group>

      <Text size="sm" c="dimmed" className="mb-2">
        With Fjord Tours you can explore more of the magical fjord landscapes
        with tours and activities on and around the fjords of Norway
      </Text>

      <Button
        color="blue"
        fullWidth
        className="mt-auto"
        radius="md"
        onClick={() => alert(pokemon.id)}
      >
        Choose Pokemon
      </Button>
    </Card>
  );
}

export default PokemonCard;
