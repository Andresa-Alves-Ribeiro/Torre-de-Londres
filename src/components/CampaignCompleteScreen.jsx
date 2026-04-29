export default function CampaignCompleteScreen({ score, history, onPlayAgain }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/95 to-slate-950 px-3 py-8 text-center shadow-[0_0_60px_rgba(16,185,129,0.15)] sm:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.12),transparent_50%)]" />
      <div className="relative flex flex-col items-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 text-3xl shadow-lg">
          🏆
        </div>
        <h2 className="mb-2 !text-2xl font-black text-white sm:!text-3xl">
          Campanha concluída
        </h2>
        <p className="mx-auto !mb-4 w-full max-w-md text-center text-sm text-slate-400">
          Aproveitamento médio ponderado pelos exercícios. 100% = cada nível
          resolvido com o mínimo de movimentos.
        </p>

        <div className="mb-6 inline-flex w-full max-w-[min(100%,20rem)] flex-col items-center rounded-3xl border border-white/10 bg-black/40 px-6 py-5 backdrop-blur-md sm:px-10 sm:py-6">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Pontuação final
          </span>
          <span className="game-title-gradient text-5xl font-black tabular-nums leading-none sm:text-7xl md:text-8xl">
            {score}%
          </span>
        </div>

        <div className="mx-auto w-full max-w-md min-w-0 space-y-2 text-left">
          {history.map((item) => (
            <div
              key={item.exercise}
              className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-3 text-sm backdrop-blur-sm sm:px-4"
            >
              <span className="min-w-0 shrink font-semibold text-slate-300">
                Nível {item.exercise}
              </span>
              <span className="shrink-0 font-mono tabular-nums text-cyan-300/90">
                {item.userMoves} /{" "}
                {Number.isFinite(item.minimumMoves)
                  ? item.minimumMoves
                  : "—"}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onPlayAgain}
          className="mt-8 w-full max-w-md rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_4px_24px_rgba(34,211,238,0.35)] transition hover:brightness-110 active:scale-[0.98] sm:w-auto sm:px-8"
        >
          Jogar de novo
        </button>
      </div>
    </div>
  );
}
