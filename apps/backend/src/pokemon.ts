import Pokedex, { type Pokemon } from "pokedex-promise-v2";
import type { PokemonInfo } from "./types.js";

const P = new Pokedex();
const pokemonsList = await P.getPokemonsList();

const fetchRandomPokemon = async (): Promise<PokemonInfo> => {
  let pokemon;
  do {
    const randomIndex = Math.floor(Math.random() * pokemonsList.count);
    pokemon = await P.getPokemonByName(pokemonsList.results[randomIndex].name);
  } while (
    pokemon.sprites.other.showdown.front_default === null ||
    pokemon.sprites.other.showdown.back_default === null ||
    pokemon.moves.length === 0
  );

  return {
    name: pokemon.name,
    species: {
      name: pokemon.species.name,
      url: pokemon.species.url,
    },
    cry: pokemon.cries.latest,
    types: pokemon.types,
    id: pokemon.id,
    sprites: {
      front: pokemon.sprites.other.showdown.front_default,
      back: pokemon.sprites.other.showdown.back_default,
    },
    stats: pokemon.stats,
  };
};

// Fetch a random encounter on sinnoh-route-218
const fetchRandomEncounter = async (): Promise<Pokemon> => {
  const locationArea = await P.getLocationAreaByName(168);

  let pokemon;
  do {
    const randomIndex = Math.floor(
      Math.random() * locationArea.pokemon_encounters.length,
    );
    pokemon = await P.getPokemonByName(
      locationArea.pokemon_encounters[randomIndex].pokemon.name,
    );
  } while (
    pokemon.sprites.other.showdown.front_default === null ||
    pokemon.sprites.other.showdown.back_default === null ||
    pokemon.moves.length === 0
  );

  return pokemon;
};

export { fetchRandomPokemon, fetchRandomEncounter, P };
