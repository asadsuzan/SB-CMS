/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useForm.ts
import { useState } from 'react';

type FormValues = Record<string, any>; 

export function useForm<T extends FormValues>(initialState: T) {
  const [form, setForm] = useState<T>(initialState);

  const handleChange = <S extends keyof T, F extends keyof T[S]>(
    section: S,
    field: F,
    value: T[S][F]
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = <S extends keyof T, F extends keyof T[S] = any>(
    section: S,
    index: number,
    value: string,
    field?: F
  ) => {
    setForm((prev) => {
      if (field) {
        const updatedArray = [...(prev[section][field] as unknown as string[])];
        updatedArray[index] = value;
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: updatedArray,
          },
        };
      } else {
        const updatedArray = [...(prev[section] as unknown as string[])];
        updatedArray[index] = value;
        return {
          ...prev,
          [section]: updatedArray,
        };
      }
    });
  };

  const addArrayItem = <S extends keyof T, F extends keyof T[S]>(
    section: S,
    field?: F
  ) => {
    setForm((prev) => {
      if (field) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: [...((prev[section][field] as unknown) as string[]), ""],
          },
        };
      } else {
        return {
          ...prev,
          [section]: [...((prev[section] as unknown) as string[]), ""],
        };
      }
    });
  };

  const removeArrayItem = <S extends keyof T, F extends keyof T[S]>(
    section: S,
    index: number,
    field?: F
  ) => {
    setForm((prev) => {
      if (field) {
        const updatedArray = [...(prev[section][field] as unknown as string[])];
        updatedArray.splice(index, 1);
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: updatedArray,
          },
        };
      } else {
        const updatedArray = [...(prev[section] as unknown as string[])];
        updatedArray.splice(index, 1);
        return {
          ...prev,
          [section]: updatedArray,
        };
      }
    });
  };

  return {
    form,
    setForm, // setForm for direct updates like in useEffect
    handleChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
  };
}