import {
  Calculator,
  CircleX,
  LayoutList,
  PackagePlus,
  Search,
} from "lucide-react";
import { LineItemRow } from "../../components/registration/LineItem";
import { useActionState, useEffect, useState } from "react";
import {
  categoryOptions,
  menuData,
} from "../../components/registration/menuData";
import type {
  MenuCategory,
  MenuDataType,
} from "../../components/registration/menuData";
import { ErrorMessage } from "../../components/form/ErrorMessage";

export type LineItem = {
  menuId: string | null;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
};
type ActionState = { success: boolean; message: string };
const initialState: ActionState = { success: false, message: "" };

export function Product() {
  const ANIMATION_MS = 200;
  const [lineItemsData, setLineItemsData] = useState<LineItem[]>(() =>
    Array.from({ length: 1 }, () => ({
      menuId: null,
      name: "",
      qty: 0,
      unit: "",
      unitPrice: 0,
    }))
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(
    null
  );
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isSearchOpen]);

  const openSearch = () => {
    setIsSearchOpen(true);
    requestAnimationFrame(() => setIsSearchVisible(true));
  };

  const closeSearch = () => {
    setIsSearchVisible(false);
    setTimeout(() => {
      setIsSearchOpen(false);
    }, ANIMATION_MS);
    setSearchTerm("");
    setActiveRowIndex(null);
  };

  const handleSelectMenu = (menu: MenuDataType) => {
    setLineItemsData((prev) => {
      const isEmptyRow = (row: LineItem) => row.menuId === null;
      const emptyIndex = prev.findIndex(isEmptyRow);
      const emptyRow = {
        menuId: null,
        name: "",
        qty: 0,
        unit: "",
        unitPrice: 0,
      };
      const nextRow =
        menu.id === "custom"
          ? {
              menuId: menu.id,
              name: "",
              qty: 1,
              unit: "",
              unitPrice: 0,
            }
          : {
              menuId: menu.id,
              name: menu.name,
              qty: 1,
              unit: menu.unit,
              unitPrice: menu.price,
            };

      if (activeRowIndex !== null) {
        const updated = prev.map((row, i) =>
          i === activeRowIndex ? nextRow : row
        );

        const wasEmpty = prev[activeRowIndex]?.menuId === null;
        if (wasEmpty) {
          return [...updated, emptyRow];
        } else {
          return updated;
        }
      }

      const updated =
        emptyIndex !== -1
          ? prev.map((row, i) => (i === emptyIndex ? nextRow : row))
          : [...prev, nextRow];

      return [...updated, emptyRow];
    });

    closeSearch();
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleRemoveRow = (rowIndex: number) => {
    setLineItemsData((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== rowIndex);
    });
    setActiveRowIndex(null);
  };

  const filteredMenus = menuData.filter((menu) => {
    if (selectedCategory && menu.category !== selectedCategory) return false;
    const keyword = debouncedSearchTerm.trim().toLocaleLowerCase();
    if (!keyword) return true;
    const result = menu.name.toLowerCase().includes(keyword);
    return result;
  });

  const registeredRowCount = lineItemsData.filter(
    (lineItem) => lineItem.menuId !== null
  ).length;

  const submitItems = lineItemsData
    .filter((row) => row.menuId !== null)
    .map((row) => ({ ...row, amount: row.qty * row.unitPrice }));

  const subtotal = lineItemsData.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );

  const tax = Math.floor(subtotal * 0.1);

  const total = subtotal + tax;

  const gridCols =
    "grid gap-3 grid-cols-[minmax(260px,1fr)_88px_76px_120px_120px_40px]";

  const submit = async (
    _prevState: ActionState,
    _formData: FormData
  ): Promise<ActionState> => {
    try {
      if (submitItems.length === 0) {
        const message = "商品が選択されていません";
        setFeedback({ type: "error", message });
        return { success: false, message };
      }

      const payload = {
        items: submitItems,
        subtotal,
        tax,
        total,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:3002/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = "送信エラー";
        setFeedback({ type: "error", message });
        return { success: false, message };
      }
      setFeedback({ type: "success", message: "登録完了" });

      return { success: true, message: "登録完了" };
    } catch {
      const message = "サーバーエラーが発生しました";
      setFeedback({ type: "error", message });
      return { success: false, message };
    }
  };

  const [, formAction, isPending] = useActionState(submit, initialState);

  return (
    <div className="mx-10 mt-10 text-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <PackagePlus className="pointer-events-none rounded-full h-9 w-9 p-2 text-neutral-100 bg-indigo-500" />
        <h2 className="text-2xl font-bold text-slate-800">商品登録</h2>
      </div>

      <form
        action={formAction}
        className="text-slate-700 grid grid-cols-12 gap-6"
        onSubmit={() => setFeedback(null)}
      >
        {/* 商品検索 */}
        <div className="col-span-9 rounded-3xl py-10 px-5 bg-neutral-50">
          <div className="flex justify-between">
            <div className="flex items-center gap-2 mb-7">
              <LayoutList className="pointer-events-none rounded-lg h-7 w-7 p-1 text-neutral-100 bg-indigo-500" />
              <h3 className="text-xl font-bold text-slate-800">商品検索</h3>
            </div>
            <div>
              <span className="block rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                {registeredRowCount} 件
              </span>
            </div>
          </div>
          <div className="flex border-b border-gray-300 bg-indigo-100 rounded-t-xl">
            <button
              type="button"
              onClick={() => openSearch()}
              className="bg-indigo-600 hover:bg-indigo-500 text-slate-50 font-semibold rounded-xl py-2 px-5 min-w-[50px]"
            >
              追加
            </button>
            <div
              className={`flex-1 text-center py-3 px-2 font-semibold  ${gridCols}`}
            >
              <div className="pr-10">商品選択</div>
              <div className="">数量</div>
              <div className="">単位</div>
              <div className="">単価</div>
              <div className="">金額</div>
              <div className="">削除</div>
            </div>
          </div>
          {lineItemsData.map((lineItem, index) => {
            const menu = menuData.find((entry) => entry.id === lineItem.menuId);
            return (
              <LineItemRow
                key={index}
                value={lineItem}
                menu={menu}
                onChange={(next) => {
                  setLineItemsData((prev) =>
                    prev.map((row, i) => (i === index ? next : row))
                  );
                }}
                onNameClick={
                  lineItem.menuId === "custom"
                    ? undefined
                    : () => {
                        setActiveRowIndex(index);
                        openSearch();
                      }
                }
                onRemove={() => handleRemoveRow(index)}
              />
            );
          })}

          {isSearchOpen && (
            <div
              className={`fixed inset-0 z-50 backdrop-blur-sm bg-black/40 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-opacity duration-[${ANIMATION_MS}ms] ${
                isSearchVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeSearch}
            >
              <div className="relative min-h-full flex items-center justify-center">
                <div
                  className={`absolute bottom-0 w-full h-[90vh] px-20 py-20 bg-slate-200 rounded-t-4xl shadow-lg overflow-y-auto [scrollbar-gutter: stable] transition-transform duration-[${ANIMATION_MS}ms] ${
                    isSearchVisible ? "translate-y-0" : "translate-y-full"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute top-5 right-5 flex justify-end pb-2">
                    <button
                      type="button"
                      onClick={closeSearch}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <CircleX className="h-10 w-10 text-red-400 hover:text-red-600 transition-colors" />
                    </button>
                  </div>
                  {/* 検索バー */}
                  <div className="mb-8 px-20">
                    <div className="flex w-full items-center">
                      <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="search"
                          id="search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="メニュー名を検索"
                          className="w-full rounded-xl border-2 border-gray-300 bg-white hover:bg-neutral-50 px-12 py-2 focus:outline-0"
                        />
                        {searchTerm && (
                          <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                          >
                            <CircleX className="absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-500 hover:rotate-90 hover:scale-110 transition-all" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* カテゴリーフィルター */}
                  <div className="flex flex-wrap justify-center gap-3 px-20 mb-10">
                    {categoryOptions.map((option) => (
                      <button
                        key={option.value ?? "all"}
                        type="button"
                        onClick={() => setSelectedCategory(option.value)}
                        className={`transition-colors rounded-full border px-4 py-2 text-sm font-semibold min-w-20 ${
                          selectedCategory === option.value
                            ? "bg-indigo-600 text-neutral-50"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* メニュー一覧 */}
                  <div className="grid grid-cols-4 gap-4">
                    {filteredMenus.map((menu) => (
                      <div
                        onClick={() => handleSelectMenu(menu)}
                        key={menu.id}
                        id={menu.category}
                        className="col-span-1 flex h-full flex-col min-h-36 px-3 py-4 bg-white border-2 hover:bg-gray-50 border-gray-300 rounded-2xl cursor-pointer"
                      >
                        <h3 className="text-lg font-bold pb-2">{menu.name}</h3>
                        <p className="flex justify-end mt-auto border-t border-gray-100  pt-1 pr-2 text-indigo-700 text-lg font-bold">
                          ￥{menu.price.toLocaleString("ja-JP")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 合計金額 */}
        <div className="col-span-3 rounded-3xl p-10 px-5 bg-neutral-50">
          <div className="flex items-center gap-2 mb-7">
            <Calculator className="pointer-events-none rounded-lg h-7 w-7 p-1 text-neutral-100 bg-indigo-500" />
            <h3 className="text-xl font-bold text-slate-800">合計金額</h3>
          </div>
          <div className="flex items-center justify-between mb-5 text-slate-600 text-sm">
            <p>小計</p>
            <span className="text-slate-800 font-semibold">
              ￥{subtotal.toLocaleString("ja-JP")}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600 text-sm">
            <p>消費税（10%）</p>
            <span className="text-slate-800 font-semibold">
              ￥{tax.toLocaleString("ja-JP")}
            </span>
          </div>
          <div className="flex items-center justify-between py-10 my-10 border-y border-gray-300">
            <h3 className="text-lg font-bold text-slate-800">合計</h3>
            <span className="text-3xl text-indigo-700 font-bold">
              ￥{total.toLocaleString("ja-JP")}
            </span>
          </div>
          <div className="">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-slate-50 shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-500"
            >
              {isPending ? "送信中..." : "登録する"}
            </button>
            {feedback?.type === "error" && (
              <ErrorMessage
                message={feedback.message}
                className="mt-2 text-sm font-semibold"
              />
            )}
            {feedback?.type === "success" && (
              <p className="mt-2 text-sm font-semibold text-emerald-600">
                {feedback.message}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
