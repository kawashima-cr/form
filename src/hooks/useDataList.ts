import { useState, useEffect, useCallback } from "react";
import type { FormDataType } from "../components/pages/form/Form.schema";

type SavedFormData = {
  id: number;
  createdAt: string;
  updatedAt?: string;
} & FormDataType;

type UseDataListOptions = {
  autoFetch?: boolean;
};

export default function useDataList(options?: UseDataListOptions) {
  const { autoFetch = false } = options || {};

  const [dataList, setDataList] = useState<SavedFormData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/data");
      const result = await response.json();

      if (result.success) {
        setDataList(result.data);
        return result.data as SavedFormData[];
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

  const updateData = useCallback(async (id: number, payload: FormDataType) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:3001/api/data/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "更新に失敗しました");
      }

      const updatedItem = result.data as SavedFormData;
      setDataList((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } finally {
      setIsUpdating(false);
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
    isUpdating,
    error,
    fetchData,
    updateData,
  };
}
