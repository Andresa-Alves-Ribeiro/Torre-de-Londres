import { EXERCISE_COUNT } from "../../exercises.js";

export default function LevelTransitionOverlay({ nextLevelDisplay }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Carregando próximo nível"
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" aria-hidden />
      <div
        className="level-transition-scanlines absolute inset-0 opacity-50"
        aria-hidden
      />
      <div className="level-transition-overlay relative mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/95 to-slate-950/98 px-8 py-10 shadow-[0_0_60px_rgba(34,211,238,0.2),0_0_1px_rgba(255,255,255,0.08)_inset] sm:rounded-3xl sm:px-10 sm:py-12">
        <div
          className="absolute inset-0 rounded-2xl bg-[conic-gradient(from_180deg_at_50%_50%,rgba(34,211,238,0.15),transparent_25%,rgba(217,70,239,0.12),transparent_50%,rgba(34,211,238,0.1),transparent_75%)] opacity-60 blur-2xl sm:rounded-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col items-center gap-2 text-center">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-cyan-400/90 sm:text-xs">
            Buffer de estágio
          </span>
          <h2 className="level-transition-title text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
            Próximo nível
          </h2>
          <p className="font-mono text-sm font-bold tabular-nums text-fuchsia-300/95 sm:text-base">
            Nível {nextLevelDisplay}{" "}
            <span className="text-slate-500">/ {EXERCISE_COUNT}</span>
          </p>
        </div>
        <div className="relative w-full max-w-[16rem] space-y-2 sm:max-w-xs">
          <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-slate-950/90 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
            <div className="level-transition-bar h-full w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
          </div>
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:text-[11px]">
            Sincronizando arena…
          </p>
        </div>
        <div className="relative flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-2 w-2 animate-pulse rounded-sm bg-cyan-400 shadow-[0_0_12px_#22d3ee] ${i === 0 ? "" : i === 1 ? "delay-150" : "delay-300"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
