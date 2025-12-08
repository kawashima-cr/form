import { useState } from "react";
import TextInput from "../../form/InputFieald";
import { formSchema, type FormData } from "./Form.schema";
import { inputFields, prefectures } from "./Form.constants";
import { fetchAddress } from "../../../api/postalCode";

export default function Form() {
  const [data, setData] = useState<FormData>({
    company: "",
    postalCode: "",
    prefecture: "",
    city: "",
    address: "",
    building: "",
    tel: "",
    email: "",
    contractDate: "",
    contractStatus: "initial",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = formSchema.safeParse(data);
    if (!result.success) {
      // TODO
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    console.log("フォーム送信:", data);
  };

  const handleSearchAddress = async () => {
    setErrors({});
    try {
      setLoading(true);
      const result = await fetchAddress(data.postalCode);
      if (result) {
        setData((prev) => ({
          ...prev,
          prefecture: result.address1,
          city: result.address2,
          address: result.address3,
        }));
      }
    } catch (error) {
      console.log(error);
      setErrors((prev) => ({
        ...prev,
        postalCode: "住所の取得に失敗しました",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[400px] my-5 mx-auto">
      <form className="max-w-full text-xl" onSubmit={handleSubmit}>
        {inputFields.map((inputField) => (
          <div key={inputField.id}>
            {inputField.name === "prefecture" ? (
              <div className="mb-1">
                <label className="block" htmlFor="contractStatus">
                  都道府県
                </label>
                <select
                  className="
                  w-full py-2 border-2 border-indigo-500 rounded-sm 
                  focus:outline-1 focus:outline-indigo-700
                "
                  id="prefecture"
                  name="prefecture"
                  value={data.prefecture}
                  onChange={handleChange}
                >
                  <option value="">---- 選択してください ----</option>
                  {prefectures.map((prefecture) => (
                    <option key={prefecture} value={prefecture}>
                      {prefecture}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <TextInput
                label={inputField.label}
                type={inputField.type}
                name={inputField.name}
                id={inputField.id}
                value={data[inputField.name] ?? ""}
                onChange={handleChange}
              />
            )}
            <div className="min-h-6 mt-1">
              {errors[inputField.name] && (
                <p className="text-red-600 text-sm/normal m-0">
                  {errors[inputField.name]}
                </p>
              )}
            </div>
            {inputField.name === "postalCode" && (
              <div className="flex flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSearchAddress}
                  disabled={loading}
                  className="
                    bg-neutral-50 hover:bg-neutral-200 transition-all
                    w-60 text-base px-5 py-2 border rounded-sm
                  "
                >
                  {loading ? "入力中..." : "郵便番号から住所を自動入力"}
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="mb-1">
          <label className="block" htmlFor="contractStatus">
            契約状態
          </label>
          <select
            className="
              w-full py-2 border-2 border-indigo-500 rounded-sm 
              focus:outline-1 focus:outline-indigo-700
            "
            id="contractStatus"
            name="contractStatus"
            value={data.contractStatus}
            onChange={handleChange}
          >
            <option value="initial">---- 選択してください ----</option>
            <option value="contract">契約中</option>
            <option value="negotiation">商談中</option>
            <option value="cancellation">解約</option>
          </select>
        </div>
        {data.contractStatus === "cancellation" && (
          <div>
            <div className="min-h-6 mt-1" />
            <label className="block" htmlFor="contractStatus">
              解約日
            </label>
            <input
              type="date"
              className="
                w-full py-2 border-2 border-indigo-500 rounded-sm 
                focus:outline-1 focus:outline-indigo-700
              "
            />
          </div>
        )}
        <div className="min-h-6 mt-1">
          {errors.contractStatus && (
            <p className="text-red-600 text-sm/normal m-0">
              {errors.contractStatus}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="
            bg-neutral-50 hover:bg-neutral-200 transition-all
              text-lg w-50 px-8 py-4 border rounded-sm block mx-auto mt-2
            "
        >
          送信する
        </button>
      </form>
    </div>
  );
}
