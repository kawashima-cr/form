import { createFileRoute } from "@tanstack/react-router";
import List from "../components/pages/list/List";

export const Route = createFileRoute("/list")({
  component: () => <List />,
});
