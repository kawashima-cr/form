import { useMemo, useState } from "react";
import { Route } from "@/routes/orderList.$id";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
};

type LoaderData = {
  order: Order;
  items: OrderItem[];
};

type Feedback = {
  type: "success" | "error";
  message: string;
};

const calcSubtotal = (items: OrderItem[]) =>
  items.reduce((sum, item) => {
    const taxFreeUnit = Math.round(item.unitPrice / (1 + item.taxRate / 100));
    return sum + item.qty * taxFreeUnit;
  }, 0);

const calcTotal = (items: OrderItem[]) =>
  items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

export default function OrderEdit() {
  const { order, items: initialItems } = Route.useLoaderData() as LoaderData;
  const [items, setItems] = useState<OrderItem[]>(initialItems);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const subtotal = useMemo(() => calcSubtotal(items), [items]);
  const total = useMemo(() => calcTotal(items), [items]);
  const tax = total - subtotal;

  const updateItem = <K extends keyof OrderItem>(
    index: number,
    key: K,
    value: OrderItem[K]
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleSave = async () => {
    if (items.length === 0) {
      setFeedback({ type: "error", message: "商品がありません" });
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    try {
      const payload = {
        items: items.map((item) => ({
          menuId: item.menuId,
          name: item.name,
          qty: item.qty,
          unit: item.unit,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          amount: item.qty * item.unitPrice,
        })),
        subtotal,
        tax,
        total,
      };

      const response = await fetch(
        `http://localhost:3002/orders/${order.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        setFeedback({ type: "error", message: "更新に失敗しました" });
        return;
      }
      setFeedback({ type: "success", message: "更新完了" });
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "更新に失敗しました" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-4 mt-6 text-gray-700 sm:mx-6 sm:mt-8 lg:mx-10 lg:mt-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold text-slate-800">注文編集</h2>
        <span className="text-sm text-slate-500">注文ID: {order.id}</span>
      </div>

      <div className="col-span-1 rounded-3xl bg-neutral-50 px-5 py-6 sm:pt-8 xl:py-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>商品名</TableHead>
              <TableHead>個数</TableHead>
              <TableHead>単位</TableHead>
              <TableHead>単価</TableHead>
              <TableHead>税率</TableHead>
              <TableHead>金額</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.itemId}>
                <TableCell>
                  <input
                    className="w-full rounded-md border border-gray-300 px-2 py-1"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <input
                    className="w-20 rounded-md border border-gray-300 px-2 py-1 text-right"
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(index, "qty", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell>
                  <input
                    className="w-20 rounded-md border border-gray-300 px-2 py-1"
                    value={item.unit}
                    onChange={(e) => updateItem(index, "unit", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <input
                    className="w-24 rounded-md border border-gray-300 px-2 py-1 text-right"
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(index, "unitPrice", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell>
                  <input
                    className="w-20 rounded-md border border-gray-300 px-2 py-1 text-right"
                    type="number"
                    min={0}
                    value={item.taxRate}
                    onChange={(e) =>
                      updateItem(index, "taxRate", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  {(item.qty * item.unitPrice).toLocaleString("ja-JP")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 flex flex-col items-end gap-2 text-sm text-slate-600">
          <div>小計: ￥{subtotal.toLocaleString("ja-JP")}</div>
          <div>税額: ￥{tax.toLocaleString("ja-JP")}</div>
          <div className="text-base font-semibold text-slate-800">
            合計: ￥{total.toLocaleString("ja-JP")}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {feedback && (
            <span
              className={
                feedback.type === "success"
                  ? "text-emerald-600"
                  : "text-red-600"
              }
            >
              {feedback.message}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-70"
          >
            {isSaving ? "更新中..." : "更新する"}
          </button>
        </div>
      </div>
    </div>
  );
}
