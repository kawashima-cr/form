import { Calculator, LayoutList, PackagePlus } from "lucide-react";
import { gridCols, LineItemRow } from "../../components/registration/LineItem";

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
          <div className="flex justify-between">
            <div className="flex items-center gap-2 mb-7">
              <LayoutList className="pointer-events-none rounded-lg h-7 w-7 p-1 text-neutral-100 bg-indigo-500" />
              <h3 className="text-xl font-bold text-slate-800">商品検索</h3>
            </div>
            <div>
              <span className="block rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                3 件
              </span>
            </div>
          </div>
          <div>
            <div
              className={`text-center border-b border-gray-300 py-3 px-2 font-semibold bg-indigo-50 rounded-t-xl ${gridCols}`}
            >
              <div className="">商品選択</div>
              <div className="">数量</div>
              <div className="">単位</div>
              <div className="">単価</div>
              <div className="">金額</div>
              <div className="">削除</div>
            </div>
          </div>

          <LineItemRow />
          <LineItemRow />
          <LineItemRow />
          <LineItemRow />
        </div>

        {/* 合計金額 */}
        <div className="col-span-3 rounded-3xl p-10 px-5 bg-neutral-50">
          <div className="flex items-center gap-2 mb-7">
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
              className="w-full rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-slate-50 shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-500"
            >
              登録する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
