import type { PokemonType, StatElement } from "pokeapi-js-wrapper";

interface PokemonInfo {
  _id: string;
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

interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

interface Move {
  name: string;
  power: number;
  type: string;
  damage_class: string;
}

interface PokemonBattleInfo {
  name: string;
  cry: string;
  stats: PokemonStats;
  types: string[];
  moves: Move[];
}

interface CaughtPokemonInfo {
  _id?: string;
  name: string;
  id: number;
  caughtAt: Date | string;
}

export type {
  PokemonInfo,
  PokemonStats,
  Move,
  PokemonBattleInfo,
  CaughtPokemonInfo,
};
