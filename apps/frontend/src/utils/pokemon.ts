import { Pokedex, Pokemon } from "pokeapi-js-wrapper";
import {
  CaughtPokemonInfo,
  Move,
  PokemonBattleInfo,
  PokemonStats,
} from "../types";
import { isAxiosError } from "axios";
import axios from "axios";

const P = new Pokedex();

const extractPokemonData = async (
  data: Pokemon,
): Promise<PokemonBattleInfo> => {
  const stats: PokemonStats = {
    hp: data.stats.find((s) => s.stat.name === "hp")!.base_stat,
    attack: data.stats.find((s) => s.stat.name === "attack")!.base_stat,
    defense: data.stats.find((s) => s.stat.name === "defense")!.base_stat,
    special_attack: data.stats.find((s) => s.stat.name === "special-attack")!
      .base_stat,
    special_defense: data.stats.find((s) => s.stat.name === "special-defense")!
      .base_stat,
    speed: data.stats.find((s) => s.stat.name === "speed")!.base_stat,
  };

  const cry = data.cries.latest as string;

  const types = data.types.map((t) => t.type.name);

  const movesPromises = data.moves.map(async (moveEntry) => {
    let moveData;
    do {
      try {
        moveData = await P.getMoveByName(moveEntry.move.name);
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          continue;
        }
        throw error;
      }
    } while (!moveData);
    // Find english name
    const englishName = moveData.names.find(
      (name) => name.language.name === "en",
    )!.name;

    if (moveData.power && moveData.power !== null) {
      return {
        name: englishName,
        power: moveData.power,
        type: moveData.type.name,
        damage_class: moveData.damage_class.name,
      } as Move;
    } else {
      return null;
    }
  });

  const allMoves = await Promise.all(movesPromises);

  const moves = allMoves
    .filter((move): move is Move => move !== null)
    .slice(0, 4);

  return {
    name: data.name,
    cry: cry,
    stats: stats,
    types: types,
    moves: moves,
  };
};

const getTypeEffectiveness = (moveType: string, targetTypes: string[]) => {
  // Simplified type chart
  const typeChart: { [key: string]: { [key: string]: number } } = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: {
      fire: 0.5,
      water: 0.5,
      grass: 2,
      ice: 2,
      bug: 2,
      rock: 0.5,
      dragon: 0.5,
      steel: 2,
    },
    water: {
      fire: 2,
      water: 0.5,
      grass: 0.5,
      ground: 2,
      rock: 2,
      dragon: 0.5,
    },
    electric: {
      water: 2,
      electric: 0.5,
      grass: 0.5,
      ground: 0,
      flying: 2,
      dragon: 0.5,
    },
    grass: {
      fire: 0.5,
      water: 2,
      grass: 0.5,
      poison: 0.5,
      ground: 2,
      flying: 0.5,
      bug: 0.5,
      rock: 2,
      dragon: 0.5,
      steel: 0.5,
    },
    ice: {
      fire: 0.5,
      water: 0.5,
      grass: 2,
      ice: 0.5,
      ground: 2,
      flying: 2,
      dragon: 2,
      steel: 0.5,
    },
    fighting: {
      normal: 2,
      ice: 2,
      rock: 2,
      dark: 2,
      steel: 2,
      poison: 0.5,
      flying: 0.5,
      psychic: 0.5,
      bug: 0.5,
      ghost: 0,
      fairy: 0.5,
    },
    poison: {
      grass: 2,
      poison: 0.5,
      ground: 0.5,
      rock: 0.5,
      ghost: 0.5,
      steel: 0,
      fairy: 2,
    },
    ground: {
      fire: 2,
      electric: 2,
      grass: 0.5,
      poison: 2,
      flying: 0,
      bug: 0.5,
      rock: 2,
      steel: 2,
    },
    flying: {
      electric: 0.5,
      grass: 2,
      fighting: 2,
      bug: 2,
      rock: 0.5,
      steel: 0.5,
    },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: {
      fire: 0.5,
      grass: 2,
      fighting: 0.5,
      poison: 0.5,
      flying: 0.5,
      psychic: 2,
      ghost: 0.5,
      dark: 2,
      steel: 0.5,
      fairy: 0.5,
    },
    rock: {
      fire: 2,
      ice: 2,
      fighting: 0.5,
      ground: 0.5,
      flying: 2,
      bug: 2,
      steel: 0.5,
    },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: {
      fire: 0.5,
      water: 0.5,
      electric: 0.5,
      ice: 2,
      rock: 2,
      fairy: 2,
      steel: 0.5,
    },
    fairy: {
      fire: 0.5,
      fighting: 2,
      poison: 0.5,
      dragon: 2,
      dark: 2,
      steel: 0.5,
    },
  };

  let multiplier = 1;

  targetTypes.forEach((targetType) => {
    if (typeChart[moveType] && typeChart[moveType][targetType]) {
      multiplier *= typeChart[moveType][targetType];
    }
  });

  return multiplier;
};

const calculateDamage = (
  level: number,
  attacker: PokemonBattleInfo,
  defender: PokemonBattleInfo,
  move: Move,
) => {
  // Determine attack and defense stats based on move damage class
  const attackStat =
    move.damage_class === "physical"
      ? attacker.stats.attack
      : attacker.stats.special_attack;
  const defenseStat =
    move.damage_class === "physical"
      ? defender.stats.defense
      : defender.stats.special_defense;

  // Type effectiveness
  const typeEffectiveness = getTypeEffectiveness(move.type, defender.types);

  // STAB (Same Type Attack Bonus)
  const stab = attacker.types.includes(move.type) ? 1.5 : 1;

  // Random factor (simplified to 1 for consistency)
  const randomFactor = 1;

  const modifier = stab * typeEffectiveness * randomFactor;

  const damage = Math.floor(
    (((2 * level) / 5 + 2) * move.power * (attackStat / defenseStat)) / 50 + 2,
  );

  return { damage: Math.floor(damage * modifier), typeEffectiveness };
};

const saveCaughtPokemon = async (pokemon: CaughtPokemonInfo) => {
  // POST http://localhost:3000/caught-pokemon
  // Body: { name: pokemon.name, id: pokemon.id, caughtAt: new Date() }
  const response = await axios.post<CaughtPokemonInfo>(
    "http://localhost:3000/caught-pokemon",
    {
      name: pokemon.name,
      id: pokemon.id,
      caughtAt: new Date(),
    },
  );

  return response;
};

export {
  extractPokemonData,
  getTypeEffectiveness,
  calculateDamage,
  saveCaughtPokemon,
};
export type { PokemonBattleInfo, Move };
