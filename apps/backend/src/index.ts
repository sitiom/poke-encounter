import express from "express";
import cors from "cors";
import type { Request } from "express";
import { fetchRandomEncounter, fetchRandomPokemon } from "./pokemon.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
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
app.get("/pokemon/random-encounter", async (req, res) => {
  if (Math.random() < 0.43) {
    res.json(await fetchRandomEncounter());
    return;
  }
  res.json({ message: "No pokemon encountered" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
