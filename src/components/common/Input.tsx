// src/components/common/Input.tsx
interface InputProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const Input = ({ type, value, onChange, placeholder, required, className }: InputProps) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className={`w-full p-2 border rounded ${className || ''}`}
  />
);

export default Input;