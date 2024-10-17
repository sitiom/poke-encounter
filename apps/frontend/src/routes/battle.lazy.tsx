import { Card, Button } from "@mantine/core";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import usePokemonStore from "../store/usePokemonStore";
import {
  Move,
  calculateDamage,
  extractPokemonData,
  saveCaughtPokemon,
} from "../utils/pokemon";
import PokemonInfo from "../components/PokemonInfo";
import { notifications } from "@mantine/notifications";
import { useAudioPlayer, useGlobalAudioPlayer } from "react-use-audio-player";
import { SegmentedControl } from "@mantine/core";
import battlebg from "../assets/battle-bg.png";
import victory from "../assets/victory.ogg";
import hit from "../assets/hit.ogg";
import hitNotEffective from "../assets/hit-not-effective.ogg";
import hitSuperEffective from "../assets/hit-super-effective.ogg";
import pokeballStruggling from "../assets/pokeball-struggling.gif";
import { twMerge } from "tailwind-merge";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Pokemon } from "pokeapi-js-wrapper";

export const Route = createLazyFileRoute("/battle")({
  component: Battle,
});

function Battle() {
  const { data: player } = useSuspenseQuery({
    queryKey: ["player", usePokemonStore.getState().playerPokemon!],
    queryFn: async () => {
      return extractPokemonData(usePokemonStore.getState().playerPokemon!);
    },
  });

  const { data: opponent } = useSuspenseQuery({
    queryKey: ["opponent", usePokemonStore.getState().opponentPokemon!],
    queryFn: async () => {
      return extractPokemonData(usePokemonStore.getState().opponentPokemon!);
    },
  });
  const [playerHP, setPlayerHP] = useState<number>(player.stats.hp);
  const [opponentHP, setOpponentHP] = useState<number>(opponent.stats.hp);
  const [playerAnimating, setPlayerAnimating] = useState(false);
  const [opponentAnimating, setOpponentAnimating] = useState(false);
  const [battleOver, setBattleOver] = useState(false);
  const [selectedMove, setSelectedMove] = useState<Move>(player.moves[0]);
  const [attacking, setAttacking] = useState(false);
  const [catching, setCatching] = useState(false);
  const [caught, setCaught] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: async (pokemon: Pokemon) => {
      const { data } = await saveCaughtPokemon({
        name: pokemon.name,
        id: pokemon.id,
        caughtAt: new Date(),
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["caughtPokemon"], (old: any) => [...old, data]);
    },
  });

  useEffect(() => {
    setPlayerHP(player.stats.hp);
    setOpponentHP(opponent.stats.hp);
  }, [player, opponent]);

  const titlecasedName = player.name
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  const { load } = useAudioPlayer();
  const { load: loadGlobal } = useGlobalAudioPlayer();

  useEffect(() => {
    load(opponent.cry, {
      autoplay: true,
    });
  }, []);

  const playerAttack = async (level: number): Promise<{ playerHP: number }> => {
    const playerDamage = calculateDamage(level, player, opponent, selectedMove);

    let newOpponentHP = Math.max(opponentHP - playerDamage.damage, 0);
    setOpponentHP(newOpponentHP);
    notifications.show({
      title: `${player.name} used ${selectedMove.name}!`,
      message: `Dealt ${playerDamage.damage} damage to ${opponent.name}! ${
        playerDamage.typeEffectiveness > 1
          ? "It's super effective!"
          : playerDamage.typeEffectiveness < 1
            ? "It's not very effective..."
            : ""
      }`,
    });
    load(
      playerDamage.typeEffectiveness > 1
        ? hitSuperEffective
        : playerDamage.typeEffectiveness < 1
          ? hitNotEffective
          : hit,
      {
        autoplay: true,
      },
    );
    setPlayerAnimating(true);

    if (newOpponentHP <= 0) {
      load(opponent.cry, {
        autoplay: true,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (newOpponentHP <= 0) {
      notifications.show({
        color: "green",
        title: "Victory!",
        message: "You win!",
      });
      setBattleOver(true);
      loadGlobal(victory, {
        autoplay: true,
        loop: true,
      });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      usePokemonStore.setState({ opponentPokemon: null });
      navigate({ to: "/search" });
    }
  };

  const opponentAttack = async (level: number) => {
    let opponentMove =
      opponent.moves[Math.floor(Math.random() * opponent.moves.length)];
    // Default move if no move is found
    if (opponentMove === undefined) {
      opponentMove = {
        name: "Tackle",
        power: 40,
        type: "normal",
        damage_class: "physical",
      };
    }
    const opponentDamage = calculateDamage(
      level,
      opponent,
      player,
      opponentMove,
    );

    let newPlayerHP = Math.max(playerHP - opponentDamage.damage, 0);
    setPlayerHP(newPlayerHP);
    notifications.show({
      color: "red",
      title: `${opponent.name} used ${opponentMove.name}!`,
      message: `Dealt ${opponentDamage.damage} damage to ${player.name}! ${
        opponentDamage.typeEffectiveness > 1
          ? "It's super effective!"
          : opponentDamage.typeEffectiveness < 1
            ? "It's not very effective..."
            : ""
      }`,
    });
    load(
      opponentDamage.typeEffectiveness > 1
        ? hitSuperEffective
        : opponentDamage.typeEffectiveness < 1
          ? hitNotEffective
          : hit,
      {
        autoplay: true,
      },
    );
    setOpponentAnimating(true);

    if (newPlayerHP <= 0) {
      load(player.cry, {
        autoplay: true,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (newPlayerHP <= 0) {
      notifications.show({
        color: "red",
        title: "Defeat!",
        message: "You lose!",
      });
      setBattleOver(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      usePokemonStore.setState({ playerPokemon: null, opponentPokemon: null });
      navigate({ to: "/" });
      return { playerHP: newPlayerHP };
    }
  };

  const performAttack = async () => {
    setAttacking(true);

    // Both Pokémon are level 1
    const level = 50;

    const { playerHP } = await playerAttack(level);
    if (playerHP > 0 || !battleOver) {
      await opponentAttack(level);
    }

    setAttacking(false);
  };

  const handleMoveSelection = (moveName: string) => {
    const move = player.moves.find((m) => m.name === moveName)!;
    setSelectedMove(move);
  };

  const performCapture = async () => {
    setCatching(true);
    const catchRate = 100 - 50 * (opponentHP / opponent.stats.hp);
    const random = Math.random() * 100;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (random < catchRate) {
      setCatching(false);
      setCaught(true);

      const opponentPokemon = usePokemonStore.getState().opponentPokemon!;
      saveMutation.mutate(opponentPokemon);

      notifications.show({
        color: "green",
        title: "Success!",
        message: `You captured ${opponent.name}!`,
      });
      load(opponent.cry, {
        autoplay: true,
      });
      loadGlobal(victory, {
        autoplay: true,
        loop: true,
      });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setCaught(false);
      usePokemonStore.setState({ opponentPokemon: null });
      navigate({ to: "/search" });
      return;
    }

    notifications.show({
      color: "red",
      title: "Failure!",
      message: `You failed to capture ${opponent.name}!`,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCatching(false);
    await opponentAttack(1);
  };

  return (
    <Card
      shadow="xs"
      withBorder
      p="lg"
      className="mx-auto my-6 max-w-[63.75rem]"
      radius="md"
      color=""
    >
      <div className="relative">
        <div className="relative">
          <img
            src={battlebg}
            alt="battlebg"
            className="w-full rounded-md border-2 border-neutral-600 transition-opacity"
          />
          <img
            src={
              usePokemonStore.getState().playerPokemon!.sprites.other.showdown
                .back_default!
            }
            alt={player.name}
            className={twMerge(
              playerAnimating && "animate-tackle-right",
              opponentAnimating && "animate-damaged",
              "absolute bottom-[16%] left-[23%] w-[13%] transition-opacity",
              playerHP === 0 && "opacity-0",
            )}
            onAnimationEnd={() => setPlayerAnimating(false)}
          />
          <img
            src={
              catching || caught
                ? pokeballStruggling
                : usePokemonStore.getState().opponentPokemon!.sprites.other
                    .showdown.front_default!
            }
            alt={opponent.name}
            className={twMerge(
              opponentAnimating && "animate-tackle-left",
              playerAnimating && "animate-damaged",
              "absolute right-[26%] top-[25%] w-[13%] transition-opacity",
              (catching || caught) && "right-[32%] top-[45%] w-[4%]",
              (opponentHP === 0 || caught) && "opacity-0",
            )}
            onAnimationEnd={() => setOpponentAnimating(false)}
          />
        </div>
        <div className="my-2 flex justify-center gap-2">
          <PokemonInfo
            name={player.name}
            hp={playerHP}
            totalHp={player.stats.hp}
            className="md:absolute md:bottom-[15%] md:right-[15%]"
          />
          <PokemonInfo
            name={opponent.name}
            hp={opponentHP}
            totalHp={opponent.stats.hp}
            className="md:absolute md:left-[15%] md:top-[15%]"
          />
        </div>
      </div>
      <div className="mx-auto">
        <h3 className="mb-2 text-center text-md">
          What will {titlecasedName} do?
        </h3>
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <SegmentedControl
            value={selectedMove.name}
            size="md"
            className="flex flex-wrap"
            onChange={(value) => {
              handleMoveSelection(value);
            }}
            data={player.moves.map((move) => move.name)}
          />
          <div className="flex items-center gap-2">
            <Button
              onClick={performAttack}
              disabled={
                battleOver || !selectedMove || attacking || catching || caught
              }
              loading={attacking && !battleOver}
            >
              Go!
            </Button>
            <p>or</p>
            <Button
              onClick={performCapture}
              disabled={
                battleOver || !selectedMove || attacking || catching || caught
              }
              loading={catching && !battleOver}
            >
              Catch pokemon
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
