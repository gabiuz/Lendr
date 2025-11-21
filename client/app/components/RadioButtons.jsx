export default function RadioButtons({ id, name, value, label }) {
  return (
    <div className="flex gap-1.5 xl:gap-[7px]">
      <input type="radio" name={name} id={id} value={value}></input>
      <label htmlFor={id} className="text-black text-sm">
        {label}
      </label>
    </div>
  );
}
