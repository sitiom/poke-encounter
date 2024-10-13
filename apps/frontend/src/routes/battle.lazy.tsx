import { Card } from "@mantine/core";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import usePokemonStore from "../store/usePokemonStore";
import { Move, calculateDamage } from "../utils/pokemon";
import PokemonInfo from "../components/PokemonInfo";
import { notifications } from "@mantine/notifications";
import { useAudioPlayer } from "react-use-audio-player";
import battlebg from "../assets/battle-bg.png";

export const Route = createLazyFileRoute("/battle")({
  component: Battle,
});

function Battle() {
  const { player, opponent } = Route.useLoaderData();
  const [playerHP, setPlayerHP] = useState<number>(player.stats.hp);
  const [opponentHP, setOpponentHP] = useState<number>(opponent.stats.hp);
  const [battleOver, setBattleOver] = useState<boolean>(false);
  const [selectedMove, setSelectedMove] = useState<Move>(player.moves[0]);

  const { load } = useAudioPlayer();

  useEffect(() => {
    load(opponent.cry, {
      autoplay: true,
    });
  }, []);

  const performAttack = async () => {
    if (battleOver || !selectedMove) return;

    // Both Pokémon are level 1
    const level = 1;

    // Player's turn
    const playerDamage = calculateDamage(level, player, opponent, selectedMove);

    let newOpponentHP = Math.max(opponentHP - playerDamage, 0);
    setOpponentHP(newOpponentHP);
    notifications.show({
      title: `${player.name} used ${selectedMove.name}!`,
      message: `Dealt ${playerDamage} damage to ${opponent.name}!`,
    });

    if (newOpponentHP <= 0) {
      notifications.show({
        color: "green",
        title: "Victory!",
        message: "You win!",
      });
      setBattleOver(true);
      return;
    }

    // Opponent's turn
    const opponentMove =
      opponent.moves[Math.floor(Math.random() * opponent.moves.length)];
    const opponentDamage = calculateDamage(
      level,
      opponent,
      player,
      opponentMove,
    );

    let newPlayerHP = Math.max(playerHP - opponentDamage, 0);
    setPlayerHP(newPlayerHP);
    notifications.show({
      color: "red",
      title: `${opponent.name} used ${opponentMove.name}!`,
      message: `Dealt ${opponentDamage} damage to ${player.name}!`,
    });

    if (newPlayerHP <= 0) {
      notifications.show({
        color: "red",
        title: "Defeat!",
        message: "You lose!",
      });

      setBattleOver(true);
    }
  };

  const handleMoveSelection = (moveName: string) => {
    const move = player.moves.find((m) => m.name === moveName)!;
    setSelectedMove(move);
  };

  return (
    <Card
      shadow="xs"
      withBorder
      p="lg"
      className="max-w-[63.75rem] mx-auto"
      radius="md"
      color=""
    >
      <div className="relative">
        <div className="relative">
          <img
            src={battlebg}
            alt="battlebg"
            className="w-full rounded-md border-2 border-neutral-600"
          />
          <img
            src={
              usePokemonStore.getState().playerPokemon!.sprites.other.showdown
                .back_default!
            }
            alt={player.name}
            className="absolute left-[23%] bottom-[16%] w-[13%]"
          />
          <img
            src={
              usePokemonStore.getState().opponentPokemon!.sprites.other.showdown
                .front_default!
            }
            alt={opponent.name}
            className="absolute right-[26%] top-[25%] w-[13%]"
          />
        </div>
        <div className="flex gap-2 justify-center my-2">
          <PokemonInfo
            name={player.name}
            hp={playerHP}
            totalHp={player.stats.hp}
            className="md:absolute md:right-[15%] md:bottom-[15%]"
          />
          <PokemonInfo
            name={opponent.name}
            hp={opponentHP}
            totalHp={opponent.stats.hp}
            className="md:absolute md:top-[15%] md:left-[15%]"
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <div>
            <h3>Select Move:</h3>
            {player.moves.map((move) => (
              <button
                key={move.name}
                onClick={() => {
                  handleMoveSelection(move.name);
                }}
                disabled={battleOver}
                style={{
                  backgroundColor:
                    selectedMove?.name === move.name ? "lightblue" : "",
                }}
              >
                {move.name} ({move.type}, Power: {move.power})
              </button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={performAttack} disabled={battleOver || !selectedMove}>
        Attack
      </button>
    </Card>
  );
}
