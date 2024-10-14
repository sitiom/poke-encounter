import { Card, Badge, Image, Text } from "@mantine/core";
import { PokemonInfo } from "../types";
import { twMerge } from "tailwind-merge";
import { useAudioPlayer } from "react-use-audio-player";
import { useEffect } from "react";
import { Table } from "@mantine/core";

interface PokemonCardProps {
  pokemon: PokemonInfo;
  caughtAt?: Date;
  onClick?: (pokemon: PokemonInfo) => void;
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

function PokemonCard({
  pokemon,
  onClick,
  caughtAt,
  selected = false,
}: PokemonCardProps) {
  const titlecasedName = pokemon.name
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  const pokedexNumber = "#" + pokemon.id.toString().padStart(3, "0");

  const { load, playing, stop } = useAudioPlayer();

  useEffect(() => {
    if (selected) {
      load(pokemon.cry, { autoplay: true });
      return;
    }

    if (playing) {
      stop();
    }
  }, [selected]);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={twMerge(
        caughtAt ? "h-[30rem]" : "h-[28rem]",
        "w-80 justify-center transition-colors",
        selected && "border-2 border-primary",
      )}
      onClick={() => {
        if (onClick) {
          onClick(pokemon);
        }
      }}
    >
      <Image
        src={pokemon.sprites.front}
        alt="Sprite"
        className="aspect-square h-48 object-contain"
      />

      <div className="mb-5 mt-9">
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
          {caughtAt && (
            <Table.Tr>
              <Table.Th>Caught at</Table.Th>
              <Table.Td className="text-right">
                {caughtAt.toLocaleTimeString()}
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Card>
  );
}

export default PokemonCard;
