import type { PokemonType, StatElement } from "pokeapi-js-wrapper";

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
