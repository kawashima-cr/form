import { createFileRoute } from "@tanstack/react-router";
import Form from "../pages/form/Form";

export const Route = createFileRoute("/form")({
  component: () => <Form />,
});
