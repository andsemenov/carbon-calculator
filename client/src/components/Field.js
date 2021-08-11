//template for input
const Field = ({
  label,
  name,
  type,
  value,
  onChange,
  className,
  errors,
  placeholder,
}) => (
  <>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
    />
    {errors.error && <p className="text-danger">{errors.message}</p>}
  </>
);

export default Field;
