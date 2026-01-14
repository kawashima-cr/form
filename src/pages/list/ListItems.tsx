import { Route } from "@/routes/list.$page";
import { Link } from "@tanstack/react-router";

export default function ListItems() {
  const { pageNum } = Route.useLoaderData();

  return (
    <div>
      <h1>/list/{pageNum}</h1>

      <div style={{ display: "flex", gap: 8 }}>
        {pageNum > 1 && (
          <Link to="/list/$page" params={{ page: String(pageNum - 1) }}>
            前へ
          </Link>
        )}

        <Link to="/list/$page" params={{ page: String(pageNum + 1) }}>
          次へ
        </Link>
      </div>
    </div>
  );
}
