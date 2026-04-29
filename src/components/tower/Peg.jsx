import { PEG_VISUAL } from "../../constants/towerConstants.js";
import Ball from "./Ball.jsx";

export default function Peg({
  peg,
  pegIndex,
  onPegClick,
  selectedPeg,
  interactive,
  showLabel,
}) {
  const vis = PEG_VISUAL[pegIndex];
  const labels = ["A", "B", "C"];
  const isHot =
    interactive && selectedPeg !== null && selectedPeg !== pegIndex;
  const wrapperClass = [
    "group/peg flex w-full min-w-0 flex-col items-center rounded-xl px-0.5 pb-1 pt-1.5 transition-all duration-200 sm:rounded-2xl sm:px-2 sm:pt-2",
    interactive
      ? "cursor-pointer outline-none hover:bg-cyan-400/10 focus-visible:ring-2 focus-visible:ring-cyan-400/70"
      : "cursor-default",
    isHot ? "ring-2 ring-dashed ring-cyan-300/40" : "",
  ].join(" ");

  return (
    <div
      className={wrapperClass}
      onClick={interactive ? () => onPegClick(pegIndex) : undefined}
      onKeyDown={
        interactive
          ? (e) => e.key === "Enter" && onPegClick(pegIndex)
          : undefined
      }
      role={interactive ? "button" : "group"}
      tabIndex={interactive ? 0 : undefined}
    >
      <div
        className={`w-[9px] rounded-full bg-gradient-to-b from-amber-100 via-amber-600 to-amber-950 shadow-inner shadow-black/30 ${vis.rod}`}
        aria-hidden
      />
      <div
        className={`flex min-h-0 flex-col-reverse items-center justify-start gap-1 ${vis.tray} ${vis.overlap}`}
      >
        {peg.map((ball, idx) => (
          <Ball
            key={idx}
            color={ball}
            selected={
              interactive &&
              selectedPeg === pegIndex &&
              idx === peg.length - 1
            }
          />
        ))}
      </div>
      <div
        className="relative mt-1.5 h-6 w-full max-w-[5.25rem] overflow-hidden rounded-lg border border-amber-950/60 bg-gradient-to-b from-amber-800 to-amber-950 shadow-[0_5px_0_rgba(69,26,3,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] sm:mt-2 sm:h-7 sm:max-w-[7.5rem] sm:rounded-xl"
        aria-hidden
      >
        <div className="absolute inset-x-2 top-0 h-px bg-white/20" />
      </div>
      {showLabel && (
        <span className="mt-2 text-center font-mono text-[9px] font-bold uppercase leading-tight tracking-[0.12em] text-slate-400 sm:mt-2.5 sm:text-[10px] sm:tracking-[0.2em]">
          Haste {labels[pegIndex]}
        </span>
      )}
    </div>
  );
}
