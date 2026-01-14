import OrderList from "@/pages/orderList/orderList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/orderList")({
  loader: async () => {
    const res = await fetch("http://localhost:3002/orders");
    if (!res.ok) throw new Error("fetch error");

    const json = await res.json();
    return { orders: json.data ?? [] };
  },
  component: OrderList,
});
