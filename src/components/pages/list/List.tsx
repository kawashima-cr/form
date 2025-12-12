import { CircleX, RefreshCcw, Search, SquarePen } from "lucide-react";
import { useMemo, useState } from "react";
import { contractStatusLabelMap } from "../form/Form.constants";
import useDataList from "../../../hooks/useDataList";

export default function List() {
  const { dataList, error, fetchData, isLoading } = useDataList({
    autoFetch: true,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return dataList;

    return dataList.filter((data) => {
      const idMatch = String(data.id).includes(keyword);
      const companyMatch = data.company.toLowerCase().includes(keyword);
      const postalMatch = data.postalCode.toLowerCase().includes(keyword);
      const addressMatch = [
        data.prefecture,
        data.city,
        data.address,
        data.building,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
      const telMatch = data.tel.toLowerCase().includes(keyword);
      const emailMatch = data.emails.some((email) =>
        email.toLowerCase().includes(keyword)
      );
      const contractStatusLabel =
        contractStatusLabelMap[data.contractStatus] || "";
      const contractMatch =
        data.contractStatus.toLowerCase().includes(keyword) ||
        contractStatusLabel.toLowerCase().includes(keyword);

      return (
        idMatch ||
        companyMatch ||
        postalMatch ||
        addressMatch ||
        telMatch ||
        emailMatch ||
        contractMatch
      );
    });
  }, [dataList, searchTerm]);

  const editData = () => {
    // 編集機能
  };

  // ローディング中
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  // エラー時
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          再読み込み
        </button>
      </div>
    );
  }

  // データなし
  if (dataList.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">保存されたデータがありません</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          再読み込み
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-8 bg-neutral-50 rounded-2xl text-gray-800">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-3xl font-bold">データ一覧</h2>
        <button
          type="button"
          onClick={fetchData}
          className="group px-4 py-2 border border-zinc-300 hover:border-zinc-400 rounded-2xl text-gray-800 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
        >
          <RefreshCcw className="inline-block h-5 w-5 text-gray-700 group-hover:-rotate-45 transition-all" />
          <p className="text-xs text-gray-600">更新</p>
        </button>
      </div>

      {/* 検索バー */}
      <div className="mb-12 grid place-items-center">
        <form
          className="flex w-full items-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="relative flex-1 mr-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="会社名、住所、電話番号などで検索"
              className="w-full rounded-full border border-gray-100 bg-white px-12 py-2 shadow/20 hover:shadow-md focus:outline-0"
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm("")}>
                <CircleX className="absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-500 hover:rotate-90 hover:scale-110 transition-all" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 詳細情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {filteredData.map((data) => (
          <div
            key={data.id}
            className="border border-zinc-200 shadow-xs transition-all hover:shadow rounded-3xl p-4 bg-white"
          >
            <div className="mb-3 flex justify-between data-start items-center ">
              <h3 className="text-xl text-gray-800 font-semibold">
                {data.company}
              </h3>
              <span className="text-xs text-gray-500 mr-4">ID: {data.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="inline-flex">
                <p className="font-semibold text-gray-600">郵便番号:</p>
                <p className="ml-2 text-gray-800">{data.postalCode}</p>
              </div>

              <div className="inline-flex">
                <p className="font-semibold text-gray-600">電話:</p>
                <p className="ml-2 text-gray-800">{data.tel}</p>
              </div>

              <div className="col-span-2 inline-flex">
                <p className="font-semibold text-gray-600 text-nowrap">住所:</p>
                <p className="ml-2 text-gray-800">
                  {data.prefecture}
                  {data.city}
                  {data.address}
                  {data.building && ` ${data.building}`}
                </p>
              </div>

              <div className="col-span-2 inline-flex">
                <p className="font-semibold text-gray-600">メール:</p>
                <div className="ml-2 text-gray-800">
                  {data.emails.map((email, idx) => (
                    <div key={idx} className="text-blue-700">
                      {email}
                    </div>
                  ))}
                </div>
              </div>

              <div className="inline-flex">
                <p className="font-semibold text-gray-600">契約日:</p>
                <p className="ml-2 text-gray-800">{data.contractDate}</p>
              </div>

              <div className="inline-flex">
                <p className="font-semibold text-gray-600">契約状態:</p>
                <p className="ml-2 text-gray-800">
                  {contractStatusLabelMap[data.contractStatus]}
                </p>
              </div>

              {data.cancellationDate && (
                <div className="col-spam-2 inline-flex">
                  <p className="font-semibold text-gray-600">解約日:</p>
                  <p className="ml-2 text-gray-800">{data.cancellationDate}</p>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t border-gray-200 items-center">
              <div className="text-xs text-gray-600">
                作成日: {new Date(data.createdAt).toLocaleString("ja-JP")}
              </div>
              <button
                type="button"
                onClick={editData}
                className="text-xs text-gray-600 rounded-full mr-4 cursor-pointer hover:bg-gray-100 px-2 py-1"
              >
                <SquarePen className="inline-block h-4 w-4 text-gray-500" />
                編集
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-gray-600">
        全 {filteredData.length} 件
      </div>
    </div>
  );
}
