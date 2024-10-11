import { create } from "zustand";
import { PokemonInfo } from "../types";

type PokemonStore = {
  selectedPokemon: PokemonInfo | null;
  setSelectedPokemon: (pokemon: PokemonInfo) => void;
};

const usePokemonStore = create<PokemonStore>((set) => ({
  selectedPokemon: null,
  setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
}));

export default usePokemonStore;
