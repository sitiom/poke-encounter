import { Schema, model } from "mongoose";
import type { CaughtPokemonInfo } from "./types";

const caughtPokemonSchema = new Schema<CaughtPokemonInfo>({
  name: { type: String, required: true },
  id: { type: Number, required: true },
  caughtAt: { type: Date, required: true, default: Date.now },
});

const CaughtPokemon = model<CaughtPokemonInfo>(
  "CaughtPokemon",
  caughtPokemonSchema,
);

export { CaughtPokemon };
