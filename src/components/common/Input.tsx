// // src/components/common/Input.tsx
// interface InputProps {
//   type: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
//   required?: boolean;
//   className?: string;
// }

// const Input = ({ type, value, onChange, placeholder, required, className }: InputProps) => (
//   <input
//     type={type}
//     value={value}
//     onChange={onChange}
//     placeholder={placeholder}
//     required={required}
//     className={`w-full p-2 border rounded ${className || ''}`}
//   />
// );

// export default Input;

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...rest }: InputProps) => (
  <input
    className={`w-full p-2 border rounded ${className || ""}`}
    {...rest}
  />
);
export default Input;