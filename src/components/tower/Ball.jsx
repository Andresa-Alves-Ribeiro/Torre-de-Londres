export default function Ball({ color, selected }) {
  return (
    <div
      className={`relative h-9 w-9 rounded-full border-2 transition-all duration-300 ease-out sm:h-11 sm:w-11 ${
        selected
          ? "z-10 scale-105 border-amber-300 ball-selected-animate sm:scale-110"
          : "border-white/25 shadow-lg shadow-black/40"
      }`}
      style={{
        background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.55), transparent 42%), ${color}`,
        boxShadow: selected
          ? undefined
          : "inset 0 -6px 12px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.35)",
      }}
    />
  );
}
