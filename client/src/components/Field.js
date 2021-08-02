const Field = ({ label, name, type, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="form-input shadow-sm focus:ring-blue-300
focus:border-blue-300 block w-full sm:text-sm border-gray-300
rounded-md"
      />
    </div>
  </div>
);

export default Field;
