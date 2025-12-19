import { UserRoundPlus } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";

type CustomerFormData = {
  name: string;
  tel: string;
  postalCode: string;
  address: string;
  issueDate: string;
  expiryDate: string;
  notes: string;
  projectMemo: string;
};

const initialCustomerState: CustomerFormData = {
  name: "",
  tel: "",
  postalCode: "",
  address: "",
  issueDate: "",
  expiryDate: "",
  notes: "",
  projectMemo: "",
};

export function Customer() {
  const [formValues, setFormValues] =
    useState<CustomerFormData>(initialCustomerState);
  const [searchingAddress, setSearchingAddress] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // TODO
      console.log("送信データ:", formValues);
    } catch (error) {
      console.error("送信エラー：", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchAddress = async () => {
    setSearchingAddress(true);
    try {
      // TODO
    } catch (error) {
      console.error("住所検索エラー", error);
    } finally {
      setSearchingAddress(false);
    }
  };

  return (
    <div className="mx-10 text-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <UserRoundPlus className="pointer-events-none rounded-full h-9 w-9 p-2 text-neutral-100 bg-indigo-500" />
        <h2 className="text-2xl font-bold text-slate-800">お客様情報の登録</h2>
      </div>
      <div className="rounded-3xl p-10 bg-neutral-50 ">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex gap-6">
            <div className="flex gap-6 flex-1">
              <div className="flex-1">
                <label
                  className="block text-sm font-medium text-slate-600"
                  htmlFor="name"
                >
                  名前
                  <span className="text-red-600"> *</span>
                  <span className="text-red-600 text-[10px]">必須</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formValues.name}
                  onChange={handleChange}
                  placeholder="山田 太郎"
                />
              </div>

              <div className="flex-1">
                <label
                  className="block text-sm font-medium text-slate-600"
                  htmlFor="tel"
                >
                  電話番号
                </label>
                <input
                  type="text"
                  name="tel"
                  id="tel"
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formValues.tel}
                  onChange={handleChange}
                  placeholder="090-1234-5678"
                />
              </div>
            </div>

            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="postalCode"
              >
                郵便番号
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formValues.postalCode}
                  onChange={handleChange}
                  placeholder="1000001"
                  maxLength={8}
                />
                <button
                  type="button"
                  onClick={handleSearchAddress}
                  disabled={searchingAddress}
                  className="mt-1 w-full text-nowrap rounded-2xl border border-indigo-500 px-3 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-70 sm:w-48"
                >
                  {searchingAddress ? "検索中..." : "郵便番号から検索"}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-600"
              htmlFor="address"
            >
              住所
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={formValues.address}
              onChange={handleChange}
              placeholder="東京都千代田区千代田1-1"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="issueDate"
              >
                発行日
              </label>
              <input
                id="issueDate"
                name="issueDate"
                type="date"
                min="1900-01-01"
                max="2099-12-31"
                className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formValues.issueDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="expiryDate"
              >
                有効期限
              </label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="date"
                min="1900-01-01"
                max="2099-12-31"
                className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formValues.expiryDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex  gap-6">
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="notes"
              >
                備考欄
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formValues.notes}
                onChange={handleChange}
                placeholder="その他共有事項を入力してください"
              />
            </div>

            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="projectMemo"
              >
                案件メモ
              </label>
              <textarea
                id="projectMemo"
                name="projectMemo"
                rows={3}
                className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formValues.projectMemo}
                onChange={handleChange}
                placeholder="商談の背景や次回アクションを記録できます"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-md w-50 bg-indigo-600 px-8 py-3 text-base font-semibold text-slate-50 shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-500"
            >
              {isLoading ? "登録中..." : "登録する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
