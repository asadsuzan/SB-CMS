import { Label } from "./Label";

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

export const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}: InputFieldProps) => (
  <div>
    <Label>{label}</Label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="input w-full"
    />
  </div>
);