import { useState, useCallback, useEffect } from 'react';

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validate: (values: T) => Record<string, string>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = useCallback((fieldName: keyof T, value: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validate]);

  useEffect(() => {
    const validationErrors = validate(values);
    const isValid = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    setIsFormValid(isValid);
  }, [values, validate]);

  return {
    values,
    errors,
    isFormValid,
    handleChange,
    validateForm,
  };
};
