import { Trash2 } from "lucide-react";
export const gridCols =
  "grid gap-3 grid-cols-[minmax(260px,1fr)_88px_76px_120px_120px_40px]";

export function LineItemRow() {
  return (
    <div>
      <div
        className={`${gridCols} items-center border-b border-gray-300 py-3 px-2`}
      >
        <div className="flex">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-slate-50 rounded-xl py-3 px-1 mr-1 max-h-[50px] min-w-[50px]">
            検索
          </button>
          <input
            id="address"
            name="address"
            type="text"
            className="w-full rounded-2xl border border-zinc-300 py-3 px-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            // value={formValues.address}
            // onChange={handleChange}
            placeholder="エアコン（壁掛設置）／一般"
          />
        </div>
        <div className="">
          <input
            id="address"
            name="address"
            type="number"
            className="w-full rounded-2xl border border-zinc-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            // value={formValues.address}
            // onChange={handleChange}
            placeholder="100"
          />
        </div>
        <div className="">
          <input
            id="address"
            name="address"
            type="text"
            className="w-full rounded-2xl border border-zinc-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            // value={formValues.address}
            // onChange={handleChange}
            placeholder="個"
          />
        </div>
        <div className="">
          <input
            id="address"
            name="address"
            type="text"
            className="w-full rounded-2xl border border-zinc-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            // value={formValues.address}
            // onChange={handleChange}
            placeholder="5,000"
          />
        </div>
        <div className="">
          <input
            id="address"
            name="address"
            type="text"
            className="w-full rounded-2xl border border-zinc-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            // value={formValues.address}
            // onChange={handleChange}
            placeholder="10,000"
          />
        </div>
        <div className="">
          <button type="button" className="cursor-pointer flex items-center">
            <Trash2 className="w-10 h-10 p-2 text-slate-500 rounded-xl hover:bg-gray-200 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
