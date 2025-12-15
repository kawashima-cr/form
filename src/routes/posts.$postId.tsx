/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$postId")({
  component: () => {
    const { postId } = Route.useParams();
    return <h1>Post ID: {postId}</h1>;
  },
});
