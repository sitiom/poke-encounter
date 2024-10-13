import { create } from "zustand";
import { Pokemon } from "pokeapi-js-wrapper";

type PokemonStore = {
  playerPokemon: Pokemon | null;
  opponentPokemon: Pokemon | null;
  setPlayerPokemon: (pokemon: Pokemon) => void;
  setOpponentPokemon: (pokemon: Pokemon) => void;
};

const usePokemonStore = create<PokemonStore>((set) => ({
  playerPokemon: null,
  opponentPokemon: null,
  setPlayerPokemon: (pokemon) => set({ playerPokemon: pokemon }),
  setOpponentPokemon: (enemyPokemon) => set({ opponentPokemon: enemyPokemon }),
}));

export default usePokemonStore;
