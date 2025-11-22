export default function Checkbox({ label, name, id, checked, onChange }) {
  return (
    <div className="flex gap-1.5 xl:gap-[7px]">
      <input
        type="checkbox"
        name={name}
        id={id}
        checked={checked}
        onChange={onChange}
      ></input>
      <label htmlFor={id} className="text-black">
        {label}
      </label>
    </div>
  );
}
