import { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NamedAPIResource } from "pokeapi-js-wrapper";

function App() {
  const [limit, setLimit] = useState(3);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["random", limit],
    queryFn: async () => {
      const { data } = await axios.get<NamedAPIResource | NamedAPIResource[]>(
        "http://localhost:3000/pokemon/random",
        {
          params: {
            limit,
          },
        }
      );
      console.log(data);
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error!</div>;
  }

  if (data instanceof Array) {
    return (
      <ul>
        {data.map((pokemon) => (
          <li key={pokemon.name}>{pokemon.name}</li>
        ))}
      </ul>
    );
  }
  return (
    <>
      <Button
        className="bg-red-950 text-white"
        onClick={() => {
          alert("Hello");
        }}
      >
        Hello, World!
      </Button>
    </>
  );
}

export default App;
