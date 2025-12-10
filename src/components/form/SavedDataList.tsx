import { useState } from "react";
import type { FormDataType } from "../pages/form/Form.schema";

type SavedFormData = FormDataType & {
  id: number;
  createdAt: string;
};

type SavedDataListProps = {
  onLoadData: (data: FormDataType) => void;
};

export function SavedDataList(props: SavedDataListProps) {
  const [savedDataList, setSavedDataList] = useState<SavedFormData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showList, setShowList] = useState(false);

  const fetchSavedData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/data");
      const result = await response.json();

      if (result.success) {
        setSavedDataList(result.data);
        setShowList(true);
      }
    } catch (error) {
      console.error("取得エラー:", error);
      alert("データの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectData = (selectedData: SavedFormData) => {
    // 親コンポーネントにデータを渡す
    props.onLoadData({
      company: selectedData.company || "",
      postalCode: selectedData.postalCode || "",
      prefecture: selectedData.prefecture || "",
      city: selectedData.city || "",
      address: selectedData.address || "",
      building: selectedData.building || "",
      tel: selectedData.tel || "",
      emails: selectedData.emails || [""],
      contractDate: selectedData.contractDate || "",
      contractStatus: selectedData.contractStatus || "initial",
      cancellationDate: selectedData.cancellationDate || "",
    });
    setShowList(false);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-end mb-2">
        {!showList ? (
          <button
            type="button"
            onClick={fetchSavedData}
            disabled={isLoading}
            className="
            bg-blue-50 hover:bg-blue-100 transition-all w-60
            text-lg px-4 py-2 border-2 border-blue-500 rounded-sm
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          >
            📂 保存データを読み込む
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowList(false)}
            className="
            bg-rose-50 hover:bg-rose-200 transition-all w-60
            text-lg px-4 py-2 border-2 border-rose-500 rounded-sm
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          >
            📁 保存データを閉じる
          </button>
        )}
      </div>

      {/* データ一覧表示 */}
      {showList && (
        <div
          className="
            mt-4 border-2 border-gray-300 rounded p-4 
            bg-white shadow-lg max-h-96 overflow-y-auto
          "
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold">保存されたデータ一覧</h3>
            <button
              type="button"
              onClick={() => setShowList(false)}
              className="
                text-gray-700 bg-rose-50 hover:bg-rose-200 transition-colors 
                rounded cursor-pointer inline-block align-text-top
                text-2xl font-bold w-8 h-8
              "
            >
              ×
            </button>
          </div>

          {savedDataList.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              保存されたデータがありません
            </p>
          ) : (
            <ul className="space-y-2">
              {savedDataList.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelectData(item)}
                  className="
                    border border-gray-200 rounded p-3 
                    cursor-pointer hover:bg-blue-50 
                    transition-colors
                  "
                >
                  <div className="text-sm mb-1">
                    <span className="font-semibold">会社名:</span>{" "}
                    {item.company}
                  </div>
                  <div className="text-sm mb-1">
                    <span className="font-semibold">メール:</span>{" "}
                    {item.emails.join(", ")}
                  </div>
                  <div className="text-xs text-gray-500">
                    作成日: {new Date(item.createdAt).toLocaleString("ja-JP")}
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    クリックして読み込む
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
