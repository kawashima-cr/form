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
import { Switch } from "@/components/ui/switch";

export type LineItem = {
  menuId: string | null;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
  taxFreeUnitPrice: number;
  taxRate: 8 | 10;
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
      taxFreeUnitPrice: 0,
      taxRate: 10,
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
  const [modalTaxRate, setModalTaxRate] = useState<8 | 10>(10);

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
        taxFreeUnitPrice: 0,
        taxRate: 10 as const,
      };
      const nextRow =
        menu.id === "custom"
          ? {
              menuId: menu.id,
              name: "",
              qty: 1,
              unit: "",
              unitPrice: 0,
              taxFreeUnitPrice: 0,
              taxRate: modalTaxRate,
            }
          : {
              menuId: menu.id,
              name: menu.name,
              qty: 1,
              unit: menu.unit,
              unitPrice: Math.floor(menu.price * (1 + modalTaxRate * 0.01)),
              taxFreeUnitPrice: menu.price,
              taxRate: modalTaxRate,
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

  const onTaxRateToggle = (rowIndex: number, newRate: 8 | 10) => {
    setLineItemsData((prev) =>
      prev.map((row, i) => {
        if (i !== rowIndex) return row;
        return {
          ...row,
          taxRate: newRate,
          unitPrice: Math.floor(row.taxFreeUnitPrice * (newRate * 0.01 + 1)),
        };
      })
    );
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
    .map((row) => ({
      menuId: row.menuId,
      name: row.name,
      qty: row.qty,
      unit: row.unit,
      unitPrice: row.unitPrice,
      taxRate: row.taxRate,
      amount: row.qty * row.unitPrice,
    }));

  // 税抜き小計
  const subtotal = lineItemsData.reduce(
    (sum, item) => sum + item.qty * item.taxFreeUnitPrice,
    0
  );

  const total = lineItemsData.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );

  const tax = total - subtotal;

  const gridCols =
    "lg:grid lg:gap-3 lg:grid-cols-[minmax(260px,1fr)_88px_60px_100px_100px_52px_32px]";

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
    <div className="mx-4 mt-6 text-gray-700 sm:mx-6 sm:mt-8 lg:mx-10 lg:mt-10">
      <div className="flex items-center gap-2 mb-3">
        <PackagePlus className="pointer-events-none rounded-full h-9 w-9 p-2 text-neutral-100 bg-indigo-500" />
        <h2 className="text-2xl font-bold text-slate-800">商品登録</h2>
      </div>

      <form
        action={formAction}
        className="grid grid-cols-1 gap-6 text-slate-700 xl:grid-cols-12"
        onSubmit={() => setFeedback(null)}
      >
        {/* 商品検索 */}
        <div className="col-span-1 rounded-3xl bg-neutral-50 px-5 py-6 pb-30 sm:pt-8 xl:col-span-9 xl:py-10">
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
          <div className="flex flex-col gap-2 rounded-t-xl border-b border-gray-300 bg-indigo-100 sm:flex-row sm:items-center">
            <div className="hidden w-full lg:block">
              <div
                className={`flex-1 text-center py-3 px-2 font-semibold ${gridCols}`}
              >
                <div className="">商品選択</div>
                <div className="">数量</div>
                <div className="">単位</div>
                <div className="">税込単価</div>
                <div className="">税込金額</div>
                <div className="">税率</div>
                <div className="">削除</div>
              </div>
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
                taxRate={lineItem.taxRate}
                rowIndex={index}
                onTaxRateToggle={onTaxRateToggle}
              />
            );
          })}
          <div className="grid place-items-center">
            <button
              type="button"
              onClick={() => openSearch()}
              className="mt-6 w-full sm:w-120 rounded-xl bg-indigo-600 px-3 py-3 font-semibold text-slate-50 hover:bg-indigo-500"
            >
              追加
            </button>
          </div>

          {/* モーダル */}
          {isSearchOpen && (
            <div
              className={`fixed inset-0 z-50 backdrop-blur-sm bg-black/40 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-opacity duration-[${ANIMATION_MS}ms] ${
                isSearchVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeSearch}
            >
              <div className="relative min-h-full flex items-center justify-center">
                <div
                  className={`absolute bottom-0 h-[90vh] w-full rounded-t-4xl bg-slate-200 px-6 py-8 shadow-lg transition-transform duration-[${ANIMATION_MS}ms] [scrollbar-gutter: stable] sm:px-10 sm:py-12 lg:px-20 lg:py-20 overflow-y-auto ${
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
                  <div className="mb-6 px-6 sm:mb-8 sm:px-10 lg:px-20">
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
                  <div className="mb-8 flex flex-wrap justify-center gap-3 px-6 sm:mb-10 sm:px-10 lg:px-20">
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
                  {/* 税率トグル */}
                  <div className="flex justify-end mb-4 px-5">
                    <Switch
                      checked={modalTaxRate === 10}
                      onCheckedChange={(checked) =>
                        setModalTaxRate(checked ? 10 : 8)
                      }
                    />
                  </div>

                  {/* メニュー一覧 */}
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {filteredMenus.map((menu) => (
                      <div
                        onClick={() => handleSelectMenu(menu)}
                        key={menu.id}
                        id={menu.category}
                        className="col-span-1 flex h-full flex-col min-h-36 px-3 py-4 bg-white border-2 hover:bg-gray-50 border-gray-300 rounded-2xl cursor-pointer"
                      >
                        <h3 className="text-lg font-bold pb-2">{menu.name}</h3>
                        <div className="mt-auto border-t border-gray-100 pt-2 pr-2 flex justify-end items-end">
                          <p className="text-xs font-semibold text-slate-500 mr-4 pb-0.5">
                            税抜 ￥{menu.price.toLocaleString("ja-JP")}
                          </p>
                          <p className="text-lg font-bold text-indigo-700">
                            税込 ￥
                            {Math.floor(
                              menu.price * (1 + modalTaxRate * 0.01)
                            ).toLocaleString("ja-JP")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 合計金額 */}
        <div className="col-span-1 rounded-3xl bg-neutral-50 px-5 py-6 sm:py-8 xl:col-span-3 xl:py-10">
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
            <p className="flex items-center">
              消費税
              {/* <Switch
                checked={taxRate === 10}
                onCheckedChange={(checked) => setTaxRate(checked ? 10 : 8)}
                className="ml-4"
              /> */}
            </p>
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
