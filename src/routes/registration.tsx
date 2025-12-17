import { createFileRoute } from "@tanstack/react-router";
import Registration from "../components/pages/registration/Registration";

export const Route = createFileRoute("/registration")({
  component: () => <Registration />,
});
