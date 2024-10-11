import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/battle")({
  component: Battle,
});

function Battle() {
  return <div>Hello /battle!</div>;
}
