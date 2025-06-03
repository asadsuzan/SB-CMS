import { Label } from "./Label";

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
};

export const TextAreaField = ({
  label,
  value,
  onChange,
  required = false,
}: TextAreaFieldProps) => (
  <div>
    <Label>{label}</Label>
    <textarea
      value={value}
      onChange={onChange}
      required={required}
      className="input w-full h-32"
    />
  </div>
);
