import ListItems from "@/pages/list/ListItems";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/list/$page")({
  loader: ({ params }) => {
    const pageNum = Number(params.page);

    // 例: /list/0 や /list/abc は 404 扱いにする
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      throw notFound();
    }

    return { pageNum };
  },
  component: () => ListItems,
});
