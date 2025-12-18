import { type ChangeEvent, type FormEvent, useState } from "react";
import { UserRoundPlus } from "lucide-react";
import { fetchAddress } from "../../api/postalCode";

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

const initialFormState: CustomerFormData = {
  name: "",
  tel: "",
  postalCode: "",
  address: "",
  issueDate: "",
  expiryDate: "",
  notes: "",
  projectMemo: "",
};

export function Customer2() {
  const [formValues, setFormValues] =
    useState<CustomerFormData>(initialFormState);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchAddress = async () => {
    if (!formValues.postalCode.trim()) {
      setAddressError("郵便番号を入力してください");
      return;
    }

    try {
      setAddressError(null);
      setSearchingAddress(true);

      const postalCode = formValues.postalCode.replace(/-/g, "");
      const result = await fetchAddress(postalCode);

      if (!result) {
        setAddressError("該当する住所が見つかりませんでした");
        return;
      }

      setFormValues((prev) => ({
        ...prev,
        address: `${result.address1}${result.address2}${result.address3}`,
      }));
    } catch (error) {
      console.error(error);
      setAddressError("住所の取得に失敗しました");
    } finally {
      setSearchingAddress(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("送信データ:", formValues);
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-slate-100 p-3">
          <UserRoundPlus className="h-6 w-6 text-gray-500" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Registration</p>
          <h2 className="text-2xl font-bold text-gray-800">お客様情報の登録</h2>
        </div>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            className="block text-sm font-medium text-gray-600"
            htmlFor="name"
          >
            名前
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={formValues.name}
            onChange={handleChange}
            placeholder="山田 太郎"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-600"
            htmlFor="tel"
          >
            TEL
          </label>
          <input
            id="tel"
            name="tel"
            type="tel"
            className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={formValues.tel}
            onChange={handleChange}
            placeholder="090-1234-5678"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-600"
            htmlFor="postalCode"
          >
            郵便番号
          </label>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={formValues.postalCode}
              onChange={handleChange}
              placeholder="1000001"
              maxLength={8}
            />
            <button
              type="button"
              onClick={handleSearchAddress}
              disabled={searchingAddress}
              className="w-full rounded-2xl border border-indigo-500 px-4 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-70 sm:w-48"
            >
              {searchingAddress ? "検索中..." : "郵便番号から検索"}
            </button>
          </div>
          {addressError && (
            <p className="mt-1 text-sm text-red-500">{addressError}</p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-600"
            htmlFor="address"
          >
            住所
          </label>
          <textarea
            id="address"
            name="address"
            className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            rows={3}
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
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={formValues.expiryDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
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
            className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={formValues.notes}
            onChange={handleChange}
            placeholder="その他共有事項を入力してください"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-600"
            htmlFor="projectMemo"
          >
            案件メモ
          </label>
          <textarea
            id="projectMemo"
            name="projectMemo"
            rows={4}
            className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={formValues.projectMemo}
            onChange={handleChange}
            placeholder="商談の背景や次回アクションを記録できます"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-2xl bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-500"
          >
            登録する
          </button>
        </div>
      </form>
    </div>
  );
}
