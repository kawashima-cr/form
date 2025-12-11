import { useState, useEffect, useCallback } from "react";
import type { FormDataType } from "../components/pages/form/Form.schema";

type SavedFormData = {
  id: number;
  createdAt: string;
} & FormDataType;

type UseDataListOptions = {
  autoFetch?: boolean; // 自動で取得するか（List用）
};

export default function useDataList(options?: UseDataListOptions) {
  const { autoFetch = false } = options || {};

  const [dataList, setDataList] = useState<SavedFormData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/data");
      const result = await response.json();

      if (result.success) {
        setDataList(result.data);
        return result.data;
      } else {
        setError("データの取得に失敗しました");
        return null;
      }
    } catch (error) {
      console.error("取得エラー:", error);
      setError("サーバーとの通信に失敗しました");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    dataList,
    isLoading,
    error,
    fetchData,
  };
}
