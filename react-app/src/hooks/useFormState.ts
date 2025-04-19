import { ChangeEvent, useState } from "react";

function useFormState<T extends Record<string, any>>(initialValues: T) {
  const [formValues, setFormValues] = useState<T>(initialValues);

  const handleChange = <K extends keyof T>(ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    const key = name as K;

    setFormValues((prevValues) => ({ ...prevValues, [key]: value }));
  };

  return { values: formValues, onChange: handleChange };
}

export default useFormState;
