import { createFileRoute } from "@tanstack/react-router";
import Form from "../components/pages/form/Form";

export const Route = createFileRoute("/form")({
  component: () => <Form />,
});
