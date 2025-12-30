import { Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import type { MenuDataType } from "./menuData";
import type { LineItem } from "../../pages/registration/Product ";

type LineItemRowProps = {
  onChange: (next: LineItem) => void;
  value: LineItem;
  menu?: MenuDataType;
  onNameClick?: React.MouseEventHandler<HTMLInputElement>;
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

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange({
      ...props.value,
      name: event.target.value,
    });
  };

  const handleUnitChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange({
      ...props.value,
      unit: event.target.value,
    });
  };

  const handleUnitPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPrice = Number(event.target.value);
    props.onChange({
      ...props.value,
      unitPrice: Number.isNaN(nextPrice) ? 0 : nextPrice,
    });
  };
  const gridCols =
    "grid gap-3 grid-cols-[minmax(260px,1fr)_88px_76px_120px_120px_40px]";
  const isCustom = props.value.menuId === "custom";
  const isNameEmpty = props.value.name.trim() === "";
  const baseInputClass =
    "w-full rounded-2xl border focus:outline-none read-only:focus:border-zinc-300 read-only:focus:ring-0 read-only:focus:ring-transparent";
  const textInputBorderClass = isCustom
    ? "border-indigo-500 text-zinc-800 focus:ring-1 focus:ring-indigo-500"
    : "border-zinc-300 text-zinc-500";
  const qtyInputBorderClass = isCustom
    ? "border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    : "border-zinc-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";
  const editableCursorClass = isCustom ? "cursor-text" : "cursor-default";
  const hideNumberSpinClass = isCustom
    ? "appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    : "";
  const nameHoverClass = isCustom
    ? ""
    : "hover:bg-gray-100 hover:text-indigo-600";

  const unitPrice = props.value.unitPrice;
  const amount = unitPrice * props.value.qty;

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
            className={`${baseInputClass} py-3 px-2 ${nameHoverClass} ${textInputBorderClass} ${editableCursorClass}`}
            value={props.value.name}
            readOnly={props.value.menuId !== "custom"}
            onChange={handleNameChange}
            onClick={props.onNameClick}
          />
        </div>
        <div className="">
          <input
            id="qty"
            name="qty"
            type="number"
            className={`${baseInputClass} p-3 text-zinc-800 ${qtyInputBorderClass}`}
            value={props.value.qty === 0 ? "" : props.value.qty}
            onChange={handleQtyChange}
            readOnly={!isCustom && isNameEmpty}
          />
        </div>
        <div className="">
          <input
            id="unit"
            name="unit"
            type="text"
            className={`${baseInputClass} p-3 ${textInputBorderClass} ${editableCursorClass}`}
            value={props.value.unit}
            readOnly={props.value.menuId !== "custom"}
            onChange={handleUnitChange}
          />
        </div>
        <div className="">
          <input
            id="unitPrice"
            name="unitPrice"
            type="number"
            className={`${baseInputClass} p-3 ${textInputBorderClass} ${editableCursorClass} ${hideNumberSpinClass}`}
            value={props.value.unitPrice}
            readOnly={props.value.menuId !== "custom"}
            onChange={handleUnitPriceChange}
          />
        </div>
        <div className="">
          <input
            id="amount"
            name="amount"
            type="text"
            className={`${baseInputClass} border-zinc-300 p-3 text-zinc-600`}
            value={amount.toLocaleString("ja-JP")}
            readOnly
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
