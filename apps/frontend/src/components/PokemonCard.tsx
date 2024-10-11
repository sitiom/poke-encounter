import { Card, Badge, Image, Text } from "@mantine/core";
import { PokemonInfo } from "../types";
import { twMerge } from "tailwind-merge";
import useSound from "use-sound";
import { useEffect } from "react";
import { Howl } from "howler";
import { Table } from "@mantine/core";

interface PokemonCardProps {
  pokemon: PokemonInfo;
  onClick: (pokemon: PokemonInfo) => void;
  selected?: boolean;
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

function PokemonCard({ pokemon, onClick, selected = false }: PokemonCardProps) {
  const titlecasedName = pokemon.name
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  const pokedexNumber = "#" + pokemon.id.toString().padStart(3, "0");
  const [play, { sound, stop }] = useSound(pokemon.cry, {
    interrupt: true,
  });

  useEffect(() => {
    if (selected) {
      play();
      return;
    }

    if (sound instanceof Howl && sound.playing()) {
      stop();
    }
  }, [selected, play]);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={twMerge(
        "w-80 h-[28rem] justify-center transition-colors",
        selected && "border-2 border-primary",
      )}
      onClick={() => {
        onClick(pokemon);
      }}
    >
      <Image
        src={pokemon.sprites.front}
        alt="Sprite"
        className="aspect-square object-contain h-48"
      />

      <div className="mt-9 mb-5">
        <Text fw={500}>
          <span className="font-extrabold">{pokedexNumber}</span>{" "}
          {titlecasedName}
        </Text>
        <div className="space-x-2">
          {pokemon.types.map((type) => (
            <Badge key={type.type.name} color={typeColors[type.type.name]}>
              {type.type.name}
            </Badge>
          ))}
        </div>
      </div>

      <Table horizontalSpacing="md">
        <Table.Tbody>
          <Table.Tr>
            <Table.Th>HP</Table.Th>
            <Table.Td className="text-right">
              {pokemon.stats[0].base_stat}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Attack</Table.Th>
            <Table.Td className="text-right">
              {pokemon.stats[1].base_stat}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Defense</Table.Th>
            <Table.Td className="text-right">
              {pokemon.stats[2].base_stat}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Card>
  );
}

export default PokemonCard;
