import type { PokemonType, StatElement } from "pokedex-promise-v2";

export interface PokemonInfo {
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
