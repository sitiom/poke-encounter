import { useState } from "react";
import { Button, TextInput } from "@mantine/core";

function App() {
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
