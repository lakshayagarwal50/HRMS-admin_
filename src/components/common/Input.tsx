
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...rest }: InputProps) => (
  <input
    className={`w-full p-2 border rounded ${className || ""}`}
    {...rest}
  />
);
export default Input;