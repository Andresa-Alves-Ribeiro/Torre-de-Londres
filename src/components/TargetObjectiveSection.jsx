import PegRow from "./tower/PegRow.jsx";

export default function TargetObjectiveSection({ targetState }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-violet-500/25 bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-4 pt-9 shadow-[0_24px_60px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-8 sm:pt-8">
      <div className="absolute right-2 top-3 rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-200/90 sm:right-4 sm:top-4 sm:rounded-lg sm:text-[10px]">
        Alvo
      </div>
      <h2 className="mb-2 text-center !text-lg font-bold text-white sm:!text-xl">
        Objetivo do nível
      </h2>
      <p className="mb-6 text-center text-xs text-slate-500 sm:text-sm">
        Referência fixa — replique isto na arena abaixo.
      </p>
      <PegRow
        state={targetState}
        onPegClick={() => {}}
        interactive={false}
      />
    </section>
  );
}
