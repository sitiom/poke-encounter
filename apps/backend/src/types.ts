import type { PokemonType, StatElement } from "pokedex-promise-v2";

interface CaughtPokemonInfo {
  name: string;
  id: number;
  caughtAt: Date;
}

interface PokemonInfo {
  name: string;
  id: number;
  types: PokemonType[];
  cry: string;
  stats: StatElement[];
  species: {
    name: string;
    url: string;
  };
  sprites: {
    front: string;
    back: string;
  };
}

export type { CaughtPokemonInfo, PokemonInfo };
