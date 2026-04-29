export default function GameHelp() {
  return (
    <details className="group rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur-sm open:border-cyan-500/20">
      <summary className="cursor-pointer list-none px-4 py-4 font-bold text-slate-200 transition marker:content-none hover:text-white sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
              ?
            </span>
            Como funciona
          </span>
          <span className="text-slate-500 transition group-open:rotate-180">
            ▼
          </span>
        </span>
      </summary>
      <div className="border-t border-white/5 px-4 pb-5 pt-2 text-sm leading-relaxed text-slate-400 sm:px-5">
        <ul className="list-disc space-y-2 pl-5">
          <li>No topo aparece a meta do nível atual.</li>
          <li>
            Replique a meta na arena, movendo só a bola do topo de cada haste para
            uma haste com vaga.
          </li>
          <li>Limites: esquerda 3, centro 2, direita 1 bola.</li>
          <li>
            O mínimo de movimentos é calculado por BFS a partir do padrão inicial.
          </li>
          <li>
            Ao acertar, o próximo nível começa automaticamente. Escolha um nível no
            campo &quot;Jogar nível&quot;, use &quot;Reiniciar nível&quot;,
            &quot;Nível anterior&quot; ou &quot;Reiniciar campanha&quot; quando
            precisar.
          </li>
        </ul>
      </div>
    </details>
  );
}
