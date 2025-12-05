import { useState } from "react";
import c from "./Form.module.css";
import TextInput from "../../form/TextInput";
import { formSchema, type FormData } from "./Form.schema";
import { inputFields } from "./Form.constants";
import { fetchAddress } from "../../../api/postalcode";

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
    <div className={c.wrapper}>
      <form className={c.form} onSubmit={handleSubmit}>
        {inputFields.map((inputField) => (
          <div key={inputField.id}>
            <TextInput
              label={inputField.label}
              type={inputField.type}
              name={inputField.name}
              id={inputField.id}
              value={data[inputField.name] ?? ""}
              onChange={handleChange}
            />
            <div className={c.errorContainer}>
              {errors[inputField.name] && (
                <p className={c.error}>{errors[inputField.name]}</p>
              )}
            </div>
            {inputField.name === "postalCode" && (
              <div className={c.postalButtonContainer}>
                <button
                  type="button"
                  onClick={handleSearchAddress}
                  disabled={loading}
                  className={`${c.button} ${c.postalButton}`}
                >
                  {loading ? "入力中..." : "郵便番号から住所を自動入力"}
                </button>
              </div>
            )}
          </div>
        ))}

        <div className={c.formRow}>
          <label className={c.formLabel} htmlFor="contractStatus">
            契約状態
          </label>
          <select
            className={c.formInput}
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
        <div className={c.errorContainer}>
          {errors.contractStatus && (
            <p className={c.error}>{errors.contractStatus}</p>
          )}
        </div>

        <button type="submit" className={`${c.button} ${c.submitButton}`}>
          送信する
        </button>
      </form>
    </div>
  );
}
