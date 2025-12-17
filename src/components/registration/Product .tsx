import { Calculator, LayoutList, PackagePlus, Trash2 } from "lucide-react";

export function Product() {
  return (
    <div className="mx-10 mt-10 text-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <PackagePlus className="pointer-events-none rounded-full h-9 w-9 p-2 text-neutral-100 bg-indigo-500" />
        <h2 className="text-2xl font-bold text-slate-800">商品登録</h2>
      </div>

      <div className="text-slate-700 grid grid-cols-12 gap-6">
        {/* 商品検索 */}
        <div className="col-span-9 rounded-3xl py-10 px-5 bg-neutral-50">
          <div className="col-span-9 flex items-center gap-2 mb-7">
            <LayoutList className="pointer-events-none rounded-lg h-7 w-7 p-1 text-neutral-100 bg-indigo-500" />
            <h3 className="text-xl font-bold text-slate-800">商品検索</h3>
          </div>
          <div className="text-center grid grid-cols-12 gap-4 border-b border-gray-300 py-3 px-4 font-semibold bg-indigo-50 rounded-t-xl">
            <div className="col-span-5">商品選択</div>
            <div className="col-span-1">数量</div>
            <div className="col-span-1">単位</div>
            <div className="col-span-2">単価</div>
            <div className="col-span-2">金額</div>
            <div className="col-span-1">削除</div>
          </div>

          <div className="grid grid-cols-12 gap-4 border-b border-gray-300 py-3 px-1 items-center">
            <div className="col-span-5">
              <input
                id="address"
                name="address"
                type="text"
                className="w-full rounded-2xl border border-zinc-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                // value={formValues.address}
                // onChange={handleChange}
                placeholder="エアコン（壁掛設置）／一般"
              />
            </div>
            <div className="col-span-1">
              <input
                id="address"
                name="address"
                type="number"
                className="w-full rounded-2xl border border-zinc-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                // value={formValues.address}
                // onChange={handleChange}
                placeholder="1"
              />
            </div>
            <div className="col-span-1">
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
            <div className="col-span-2">
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
            <div className="col-span-2">
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
            <div className="col-span-1">
              <button
                type="button"
                className="cursor-pointer flex items-center"
              >
                <Trash2 className="w-10 h-10 p-2 text-slate-500" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 border-b border-gray-300 py-3 px-1 items-center">
            <div className="col-span-5">
              <input
                id="address"
                name="address"
                type="text"
                className="w-full rounded-2xl border border-zinc-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                // value={formValues.address}
                // onChange={handleChange}
                placeholder="エアコン（壁掛設置）／一般"
              />
            </div>
            <div className="col-span-1">
              <input
                id="address"
                name="address"
                type="number"
                className="w-full rounded-2xl border border-zinc-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                // value={formValues.address}
                // onChange={handleChange}
                placeholder="1"
              />
            </div>
            <div className="col-span-1">
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
            <div className="col-span-2">
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
            <div className="col-span-2">
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
            <div className="col-span-1">
              <button
                type="button"
                className="cursor-pointer flex items-center"
              >
                <Trash2 className="w-10 h-10 p-2 text-slate-500" />
              </button>
            </div>
          </div>
          {/* <div>
            <button className="flex items-center rounded-md bg-indigo-600 px-6 py-1 mt-4 text-base font-semibold text-slate-100 shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-500">
              行を追加
              <SquarePlus className="w-10 h-10 p-2 text-slate-100" />
            </button>
          </div> */}
        </div>

        {/* 合計金額 */}
        <div className="col-span-3 rounded-3xl p-10 px-5 bg-neutral-50">
          <div className="col-span-2 flex items-center gap-2 mb-7">
            <Calculator className="pointer-events-none rounded-lg h-7 w-7 p-1 text-neutral-100 bg-indigo-500" />
            <h3 className="text-xl font-bold text-slate-800">合計金額</h3>
          </div>
          <div className="flex items-center justify-between mb-5 text-slate-600 text-sm">
            <p>小計</p>
            <span className="text-slate-800 font-semibold">￥110,000</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 text-sm">
            <p>消費税（10%）</p>
            <span className="text-slate-800 font-semibold">￥1,100</span>
          </div>
          <div className="flex items-center justify-between py-10 my-10 border-y border-gray-300">
            <h3 className="text-lg font-bold text-slate-800">合計</h3>
            <span className="text-3xl text-indigo-700 font-bold">
              ￥111,100
            </span>
          </div>
          <div className="">
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-500"
            >
              登録する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
