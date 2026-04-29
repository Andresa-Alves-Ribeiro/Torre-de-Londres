export default function ArenaStats({ moves, minLabel, efficiencyPct }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:mt-10">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center backdrop-blur-sm transition hover:border-cyan-500/30 sm:p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          Movimentos
        </p>
        <p className="mt-1 font-mono text-3xl font-black tabular-nums text-white sm:text-4xl">
          {moves}
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center backdrop-blur-sm transition hover:border-fuchsia-500/30 sm:p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          Ótimo (BFS)
        </p>
        <p className="mt-1 font-mono text-3xl font-black tabular-nums text-fuchsia-300 sm:text-4xl">
          {minLabel}
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center backdrop-blur-sm transition hover:border-emerald-500/30 sm:p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          Eficiência
        </p>
        <p className="mt-1 font-mono text-3xl font-black tabular-nums text-emerald-300 sm:text-4xl">
          {efficiencyPct !== null ? `${efficiencyPct}%` : "—"}
        </p>
        <p className="mt-1 text-[10px] text-slate-500">vs. ideal neste nível</p>
      </div>
    </div>
  );
}
