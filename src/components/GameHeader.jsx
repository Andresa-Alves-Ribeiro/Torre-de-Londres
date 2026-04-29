export default function GameHeader() {
  return (
    <header className="relative flex flex-col items-center px-0.5 text-center sm:px-0">
      <div className="mb-3 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase leading-snug tracking-widest text-cyan-300/90 backdrop-blur-sm sm:px-4 sm:text-xs">
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]"
          aria-hidden
        />
        Protocolo cognitivo
      </div>
      <h1 className="game-title-gradient mb-2 w-full px-1 !text-[1.65rem] font-black leading-tight tracking-tight sm:!text-5xl">
        Torre de Londres
      </h1>
      <p className="mx-auto w-full max-w-xl text-center text-sm text-slate-400 sm:text-base">
        Monte o mesmo padrão da meta com o mínimo de movimentos. Toque na haste de
        origem e depois na de destino.
      </p>
    </header>
  );
}
