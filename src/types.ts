import type { PokemonType } from "pokeapi-js-wrapper";

export interface PokemonInfo {
  name: string;
  id: number;
  types: PokemonType[];
  species: {
    name: string;
    url: string;
  };
  sprites: {
    front: string;
    back: string;
  };
}
