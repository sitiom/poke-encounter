import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { fetchRandomEncounter, fetchRandomPokemon, P } from "./pokemon.js";
import { CaughtPokemon } from "./schema.js";
import "dotenv/config";
import type { CaughtPokemonInfo } from "./types.js";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.get(
  "/pokemon/random",
  async (req: Request<{}, {}, {}, { limit?: string }>, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 1;
    if (limit <= 0) {
      res.status(400).json({ message: "Limit must be greater than 0" });
      return;
    }

    if (limit === 1) {
      res.json(await fetchRandomPokemon());
      return;
    }

    const promises = Array.from({ length: limit }, fetchRandomPokemon);
    const randomPokemons = await Promise.all(promises);
    res.json(randomPokemons);
  },
);

// Endpoint to fetch a random encounter on sinnoh-route-218
// https://pokeapi.co/api/v2/location-area/168/
app.get("/pokemon/random-encounter", async (_req, res) => {
  if (Math.random() < 1) {
    res.json(await fetchRandomEncounter());
    return;
  }
  res.json({ message: "No pokemon encountered" });
});

app.get("/pokemon/:name", async (req, res) => {
  const name = req.params.name;
  const pokemon = await P.getPokemonByName(name);

  res.json(pokemon);
});

app.get("/caught-pokemon", async (_req, res: Response<CaughtPokemonInfo[]>) => {
  const caughtPokemons = await CaughtPokemon.find();
  res.json(caughtPokemons);
});

app.post(
  "/caught-pokemon",
  async (
    req: Request<{}, {}, CaughtPokemonInfo>,
    res: Response<CaughtPokemonInfo>,
  ) => {
    const caughtPokemon = new CaughtPokemon(req.body);
    await caughtPokemon.save();
    res.json(caughtPokemon);
  },
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
