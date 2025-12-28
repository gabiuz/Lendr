export default function RadioButtons({ id, name, value, label, checked, onChange, disabled }) {
  return (
    <div className="flex gap-1.5 xl:gap-[7px]">
      <input type="radio" name={name} id={id} value={value} checked={checked} onChange={onChange} disabled={disabled}></input>
      <label htmlFor={id} className="text-black text-sm">
        {label}
      </label>
    </div>
  );
}
