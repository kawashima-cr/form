import { Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import type { MenuDataType } from "./menuData";
import type { LineItem } from "../../pages/registration/Product ";
const gridCols =
  "grid gap-3 grid-cols-[minmax(260px,1fr)_88px_76px_120px_120px_40px]";

type LineItemRowProps = {
  onChange: (next: LineItem) => void;
  value: LineItem;
  menu?: MenuDataType;
  onRemove: React.MouseEventHandler<HTMLButtonElement>;
};

export function LineItemRow(props: LineItemRowProps) {
  const handleQtyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextQty = Number(event.target.value);
    props.onChange({
      ...props.value,
      qty: Number.isNaN(nextQty) ? 0 : nextQty,
    });
  };

  const unitPrice = props.menu?.price ?? 0;
  const amount = props.menu ? unitPrice * props.value.qty : null;

  return (
    <div>
      <div
        className={`${gridCols} items-center border-b border-gray-300 py-3 px-2`}
      >
        <div className="flex">
          <input
            id="name"
            name="name"
            type="text"
            className="w-full rounded-2xl border border-zinc-300 py-3 px-2 focus:outline-none"
            value={props.menu?.name ?? ""}
            readOnly
            placeholder="エアコン（壁掛設置）／一般"
          />
        </div>
        <div className="">
          <input
            id="qty"
            name="qty"
            type="number"
            className="w-full rounded-2xl border border-zinc-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={props.value.qty}
            onChange={handleQtyChange}
            placeholder="100"
          />
        </div>
        <div className="">
          <input
            id="unit"
            name="unit"
            type="text"
            className="w-full rounded-2xl border border-zinc-300 p-3  focus:outline-none"
            value={props.menu?.unit ?? ""}
            readOnly
            placeholder="個"
          />
        </div>
        <div className="">
          <input
            id="unitPrice"
            name="unitPrice"
            type="text"
            className="w-full rounded-2xl border border-zinc-300 p-3  focus:outline-none"
            value={props.menu ? unitPrice.toLocaleString("ja-JP") : ""}
            readOnly
            placeholder="5,000"
          />
        </div>
        <div className="">
          <input
            id="amount"
            name="amount"
            type="text"
            className="w-full rounded-2xl border border-zinc-300 p-3  focus:outline-none"
            value={amount != null ? amount.toLocaleString("ja-JP") : ""}
            readOnly
            placeholder="10,000"
          />
        </div>
        <div className="">
          <button
            onClick={props.onRemove}
            type="button"
            className="cursor-pointer flex items-center"
          >
            <Trash2 className="w-10 h-10 p-2 text-slate-500 rounded-xl hover:bg-gray-200 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
