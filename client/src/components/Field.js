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
  <div>
    <label htmlFor={name}>{label}</label>
    <div>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
      />
    </div>
    {errors.error && <small className="text-danger">{errors.message}</small>}
  </div>
);

export default Field;
