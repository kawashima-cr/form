import { createFileRoute, notFound } from "@tanstack/react-router";
import OrderEdit from "@/pages/orderEdit/OrderEdit";

export const Route = createFileRoute("/orderList/$id")({
  loader: async ({ params }) => {
    const id = Number(params.id);
    if (!Number.isInteger(id)) throw notFound();

    const res = await fetch(`http://localhost:3002/orders/${id}`);
    if (!res.ok) throw notFound();

    const json = await res.json();
    if (!json.success) throw new Error("fetch error");

    return { order: json.order, items: json.items };
  },
  component: OrderEdit,
});
