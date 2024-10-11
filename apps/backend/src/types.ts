import type { PokemonType } from "pokedex-promise-v2";

export interface PokemonInfo {
  name: string;
  id: number;
  types: PokemonType[];
  cry: string;
  species: {
    name: string;
    url: string;
  };
  sprites: {
    front: string;
    back: string;
  };
}
