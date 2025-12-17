import { createFileRoute } from "@tanstack/react-router";
import Registration from "../components/registration/Registration";

export const Route = createFileRoute("/registration")({
  component: () => <Registration />,
});
