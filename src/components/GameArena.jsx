import ArenaStats from "./ArenaStats.jsx";
import PegRow from "./tower/PegRow.jsx";

export default function GameArena({
  state,
  selectedPeg,
  moves,
  minLabel,
  efficiencyPct,
  exerciseIndex,
  levelTransitionLoading,
  onPegClick,
  onPreviousExercise,
  onRestartLevel,
  onRestartCampaign,
}) {
  return (
    <section className="relative overflow-visible rounded-3xl border-2 border-cyan-400/35 bg-slate-900/50 p-4 pb-8 shadow-[0_0_48px_rgba(34,211,238,0.12),inset_0_0_80px_rgba(34,211,238,0.04)] pt-10 sm:p-8 sm:pt-12">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative">
        <div className="mb-2 flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <h2 className="text-center !text-lg font-black uppercase tracking-wide text-white sm:!text-2xl">
            Arena de jogo
          </h2>
          {selectedPeg !== null && (
            <span className="rounded-full bg-amber-400/20 px-2.5 py-1.5 text-center text-[0.7rem] font-bold leading-snug text-amber-200 ring-1 ring-amber-400/40 sm:px-3 sm:text-xs">
              Solte a bola em outra haste
            </span>
          )}
        </div>
        <p className="mb-4 text-center text-[0.7rem] leading-relaxed text-slate-400 sm:mb-6 sm:text-xs">
          Hastes: 3 · 2 · 1 bolas (esq. → dir.). Só o topo de cada pilha se move.
        </p>

        <PegRow
          state={state}
          onPegClick={onPegClick}
          selectedPeg={selectedPeg}
          interactive
          showLabels
        />

        <ArenaStats
          moves={moves}
          minLabel={minLabel}
          efficiencyPct={efficiencyPct}
        />

        <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
          <button
            type="button"
            onClick={onPreviousExercise}
            disabled={exerciseIndex === 0 || levelTransitionLoading}
            className="w-full shrink-0 rounded-xl border-2 border-slate-600 bg-slate-800/80 px-4 py-3 text-sm font-bold text-slate-200 shadow-lg transition hover:border-slate-500 hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto sm:px-5"
          >
            ← Nível anterior
          </button>
          <button
            type="button"
            onClick={onRestartLevel}
            disabled={levelTransitionLoading}
            className="w-full shrink-0 rounded-xl border-2 border-cyan-500/40 bg-cyan-950/40 px-4 py-3 text-sm font-bold text-cyan-100 shadow-lg transition hover:border-cyan-400/60 hover:bg-cyan-950/70 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto sm:px-5"
          >
            Reiniciar nível
          </button>
          <button
            type="button"
            onClick={onRestartCampaign}
            disabled={levelTransitionLoading}
            className="w-full shrink-0 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-amber-950 shadow-[0_4px_0_rgb(146,64,14),0_12px_24px_rgba(245,158,11,0.25)] transition hover:brightness-110 active:translate-y-0.5 active:shadow-[0_2px_0_rgb(146,64,14)] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:translate-y-0 sm:w-auto sm:px-6"
          >
            Reiniciar campanha
          </button>
        </div>
      </div>
    </section>
  );
}
