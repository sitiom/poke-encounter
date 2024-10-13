import { Paper, Progress } from "@mantine/core";
import { twMerge } from "tailwind-merge";

interface PokemonInfoProps {
  name: string;
  hp: number;
  totalHp: number;
  className?: string;
}

function PokemonInfo({ name, hp, totalHp, className }: PokemonInfoProps) {
  const titlecasedName = name
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Paper
      withBorder
      className={twMerge(className, "px-4 py-2 w-60")}
      radius="md"
    >
      <h1 className="font-semibold mb-1">{titlecasedName}</h1>
      <Progress
        value={(hp / totalHp) * 100}
        transitionDuration={600}
        color={
          hp / totalHp > 0.5 ? "green" : hp / totalHp > 0.2 ? "yellow" : "red"
        }
      />
      <p className="mt-1 text-right">
        {hp} / {totalHp}
      </p>
    </Paper>
  );
}

export default PokemonInfo;
