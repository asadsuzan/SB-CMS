import { Label } from "./Label";

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
};

export const SelectField = ({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps) => (
  <div>
    <Label>{label}</Label>
    <select value={value} onChange={onChange} className="input w-full">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);