import {
  createLazyFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import grassWalking from "../assets/grass-walking.gif";
import routeImage from "../assets/route-218.jpg";
import { Card, Group, Badge, Button, Text } from "@mantine/core";
import { useState } from "react";
import usePokemonStore from "../store/usePokemonStore";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { Pokemon } from "pokeapi-js-wrapper";
import encounterMusic from "../assets/encounter.ogg";
import { useGlobalAudioPlayer } from "react-use-audio-player";

export const Route = createLazyFileRoute("/search")({
  component: Search,
});

function Search() {
  const [loading, setLoading] = useState(false);
  const { playerPokemon, opponentPokemon } = usePokemonStore();
  const navigate = useNavigate();
  const { load } = useGlobalAudioPlayer();
  const router = useRouter();

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="mx-auto w-80"
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
          const { data: enemyPokemon } = await axios.get<
            Pokemon | { message: string }
          >("http://localhost:3000/pokemon/random-encounter");

          // Artificially wait for 1 second
          await new Promise((resolve) => setTimeout(resolve, 2000));

          if ("message" in enemyPokemon) {
            notifications.show({
              title: "No pokemon found",
              message: "Keep searching!",
              color: "red",
            });
            setLoading(false);
            return;
          }
          notifications.show({
            title: "Pokemon found",
            message: `You found a ${enemyPokemon.name}!`,
            color: "green",
          });
          usePokemonStore.setState({ opponentPokemon: enemyPokemon });
          setLoading(false);
          load(encounterMusic, { autoplay: true, loop: true });
          router.invalidate();
          navigate({ to: "/battle", replace: true });
        }}
        disabled={playerPokemon === null || opponentPokemon !== null}
        loading={loading}
      >
        {playerPokemon ? "Search for Pokemon" : "Select a Pokemon first"}
      </Button>
    </Card>
  );
}
