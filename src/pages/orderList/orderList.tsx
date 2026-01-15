import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Route } from "@/routes/orderList.index";
import { Link, Outlet } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";

type OrderItem = {
  itemId: number;
  menuId: string;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  amount: number;
};

type Order = {
  id: number;
  subtotal: number;
  tax: number;
  total: number;
  created_at: string;
  items: OrderItem[];
};

const formatDate = (date: string) => {
  const iso = date.includes("T") ? date : date.replace(" ", "T");
  const parsedIso = parseISO(iso);
  return format(parsedIso, "yyyy/MM/dd HH:mm");
};

export default function OrderList() {
  const { orders } = Route.useLoaderData();

  return (
    <div className="mx-4 mt-6 text-gray-700 sm:mx-6 sm:mt-8 lg:mx-10 lg:mt-10">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-2xl font-bold text-slate-800">注文一覧表</h2>
      </div>

      <div className="col-span-1 rounded-3xl bg-neutral-50 px-5 py-6 pb-30 sm:pt-8 xl:col-span-9 xl:py-10 shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>商品名</TableHead>
              <TableHead>個数</TableHead>
              <TableHead>単位</TableHead>
              <TableHead>単価</TableHead>
              <TableHead>小計</TableHead>
              <TableHead>税額</TableHead>
              <TableHead>合計</TableHead>
              <TableHead>日付</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: Order) =>
              order.items.map((item: OrderItem, index: number) => (
                <TableRow key={`${order.id}-${item.itemId}`}>
                  {index === 0 && (
                    <TableCell
                      rowSpan={order.items.length}
                      className="font-medium"
                    >
                      {order.id}
                    </TableCell>
                  )}
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.unitPrice}</TableCell>
                  {index === 0 && (
                    <>
                      <TableCell rowSpan={order.items.length}>
                        {order.subtotal}
                      </TableCell>
                      <TableCell rowSpan={order.items.length}>
                        {order.tax}
                      </TableCell>
                      <TableCell rowSpan={order.items.length}>
                        {order.total}
                      </TableCell>
                      <TableCell rowSpan={order.items.length}>
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell rowSpan={order.items.length}>
                        <Link
                          to="/orderList/$id"
                          params={{ id: String(order.id) }}
                          className="bg-indigo-600 text-gray-50 px-4 py-1.5 rounded-lg hover:bg-indigo-500"
                        >
                          編集
                        </Link>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Outlet />
    </div>
  );
}
