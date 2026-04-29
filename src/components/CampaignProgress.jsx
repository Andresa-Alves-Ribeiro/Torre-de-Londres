export default function CampaignProgress({
  exerciseIndex,
  exerciseCount,
  progressPct,
  levelTransitionLoading,
  onSelectLevel,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-1">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Progresso da campanha
            </p>
            <p className="mt-0.5 text-lg font-bold text-white">
              Nível {exerciseIndex + 1}{" "}
              <span className="font-normal text-slate-500">/ {exerciseCount}</span>
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-1.5 sm:max-w-sm sm:flex-row sm:items-center sm:gap-3">
            <label
              htmlFor="game-level-select"
              className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              Jogar nível
            </label>
            <select
              id="game-level-select"
              value={exerciseIndex}
              disabled={levelTransitionLoading}
              onChange={(e) => onSelectLevel(Number(e.target.value))}
              className="w-full cursor-pointer rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2 font-mono text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-cyan-500/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/35 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[12rem]"
            >
              {Array.from({ length: exerciseCount }, (_, i) => (
                <option key={i} value={i}>
                  Nível {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Campanha
          </p>
          <p className="text-2xl font-black tabular-nums text-cyan-300">
            {progressPct}%
          </p>
        </div>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-slate-950/80"
        role="progressbar"
        aria-valuenow={exerciseIndex + 1}
        aria-valuemin={1}
        aria-valuemax={exerciseCount}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 transition-[width] duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="game-level-track -mx-1 mt-3 overflow-x-auto overscroll-x-contain px-1 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex w-max min-w-full flex-nowrap justify-start gap-1 px-0.5 sm:w-full sm:flex-wrap sm:justify-center sm:gap-1.5 sm:px-0">
          {Array.from({ length: exerciseCount }, (_, i) => (
            <span
              key={i}
              title={`Exercício ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i < exerciseIndex
                  ? "bg-cyan-400/80"
                  : i === exerciseIndex
                    ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                    : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
