import { useEffect, useState } from "react";
import type { FormDataType } from "../pages/form/Form.schema";

const emptyData: FormDataType = {
  company: "",
  postalCode: "",
  prefecture: "",
  city: "",
  address: "",
  building: "",
  tel: "",
  emails: [""],
  contractDate: "",
  contractStatus: "initial",
  cancellationDate: "",
};

export const useFormData = (initialValues?: FormDataType) => {
  const [data, setData] = useState<FormDataType>(initialValues ?? emptyData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailErrors, setEmailErrors] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(initialValues ?? emptyData);
    setErrors({});
    setEmailErrors([]);
  }, [initialValues]);

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

  const handleEmailChange = (index: number, value: string) => {
    setData((prev) => {
      const newEmails = [...prev.emails];
      newEmails[index] = value;
      return { ...prev, emails: newEmails };
    });

    // エラークリア
    setEmailErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = "";
      return newErrors;
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.emails;
      return newErrors;
    });
  };

  const handleAddEmail = () => {
    setData((prev) => ({
      ...prev,
      emails: [...prev.emails, ""],
    }));
  };

  const handleRemoveEmail = (index: number) => {
    if (data.emails.length > 1) {
      setData((prev) => ({
        ...prev,
        emails: prev.emails.filter((_, i) => i !== index),
      }));
      setEmailErrors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setData(initialValues ?? emptyData);
    setErrors({});
    setEmailErrors([]);
  };

  return {
    data,
    setData,
    errors,
    setErrors,
    emailErrors,
    setEmailErrors,
    handleChange,
    handleEmailChange,
    handleAddEmail,
    handleRemoveEmail,
    resetForm,
  };
};
