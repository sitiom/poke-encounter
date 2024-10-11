import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import grassWalking from "../assets/grass-walking.gif";
import routeImage from "../assets/route-218.jpg";
import { Card, Group, Badge, Button, Text } from "@mantine/core";
import { useState } from "react";
import usePokemonStore from "../store/usePokemonStore";
import { notifications } from "@mantine/notifications";
import { PokemonInfo } from "../types";
import axios from "axios";

export const Route = createLazyFileRoute("/search")({
  component: Search,
});

function Search() {
  const [loading, setLoading] = useState(false);
  const { selectedPokemon } = usePokemonStore();
  const navigate = useNavigate();

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="w-80 mx-auto"
    >
      <Card.Section>
        <img src={loading ? grassWalking : routeImage} alt="grass-walking" />
      </Card.Section>

      {!loading ? (
        <>
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>Currently at Route 218</Text>
            <Badge color="pink">Sinnoh</Badge>
          </Group>

          <Text size="sm" c="dimmed">
            Despite its shortness, this road is revered by fishing enthusiasts
            as a great, yet little known, fishing spot. <br /> <br />
            Heading west from Jubilife City, the route follows a short path over
            land before reaching a body of water with a small island in the
            middle.
          </Text>
        </>
      ) : (
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>Searching...</Text>
          <Badge color="pink">Route 218</Badge>
        </Group>
      )}

      <Button
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={async () => {
          setLoading(true);
          const { data } = await axios.get<PokemonInfo | { message: string }>(
            "http://localhost:3000/pokemon/random-encounter",
          );

          // Artificially wait for 1 second
          await new Promise((resolve) => setTimeout(resolve, 2000));

          if ("message" in data) {
            notifications.show({
              title: "No pokemon found",
              message: "Keep searching!",
              color: "red",
            });
          } else {
            notifications.show({
              title: "Pokemon found",
              message: `You found a ${data.name}!`,
              color: "green",
            });
            navigate({ to: "/battle", replace: true });
          }
          setLoading(false);
        }}
        disabled={selectedPokemon === null}
        loading={loading}
      >
        {selectedPokemon ? "Search for Pokemon" : "Select a Pokemon first"}
      </Button>
    </Card>
  );
}
