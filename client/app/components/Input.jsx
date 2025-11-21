export default function Input({
  label,
  type = "text",
  placeholder,
  name,
  id,
  value,
  required = false,
  className = "",
  containerClassName = "",
  ...props
}) {
  return (
    <div
      className={`${containerClassName} flex flex-col border border-lightgray rounded-xl px-6 py-2 xl:px-[25px] xl:py-3`}
    >
      {label && (
        <label htmlFor={id} className="text-black xl:mb-2 xl:text-sm!">
          {label} {required && <span className="text-red">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        id={id}
        placeholder={placeholder}
        className={`text-black outline-0 ${className}`}
        {...props}
      ></input>
    </div>
  );
}
