export default function Button({ className = "", label }) {
  return (
    <button
      className={`${className} font-semibold border-2 border-light-gray px-[26px]! py-2.5! rounded-[11px]! cursor-pointer`}
    >
      {label}
    </button>
  );
}
