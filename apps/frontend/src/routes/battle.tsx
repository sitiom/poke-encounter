import { Paper, Text } from "@mantine/core";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import battlebg from "../assets/battle-bg.png";
import encounterMusic from "../assets/encounter.ogg";
import useSound from "use-sound";
import { useEffect } from "react";
import usePokemonStore from "../store/usePokemonStore";

export const Route = createFileRoute("/battle")({
  component: Battle,
  beforeLoad: () => {
    if (usePokemonStore.getState().selectedPokemon === null) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function Battle() {
  const [play] = useSound(encounterMusic);

  useEffect(() => {
    play();
  }, [play]);

  return (
    <Paper shadow="xs" withBorder p="xl">
      <img src={battlebg} alt="battlebg" className="w-full" />
      <Text>Pokemon encounter!</Text>
    </Paper>
  );
}
