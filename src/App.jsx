import { useMemo, useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { EXERCISES, EXERCISE_COUNT } from "./exercises.js";

const INITIAL_STATE = [["green", "red"], ["blue"], []];

const PEG_LIMITS = [3, 2, 1];

/** Visual das hastes: esquerda mais alta (cap. 3), direita mais baixa (cap. 1). Versão compacta em mobile (antes de sm). */
const PEG_VISUAL = [
  {
    rod: "h-[7rem] sm:h-44",
    overlap: "-mt-[104px] sm:-mt-[152px]",
    tray: "min-h-[118px] sm:min-h-[152px]",
  },
  {
    rod: "h-[5.5rem] sm:h-32",
    overlap: "-mt-[76px] sm:-mt-[112px]",
    tray: "min-h-[76px] sm:min-h-[112px]",
  },
  {
    rod: "h-[3.75rem] sm:h-20",
    overlap: "-mt-[48px] sm:-mt-[72px]",
    tray: "min-h-[40px] sm:min-h-[72px]",
  },
];

function cloneState(state) {
  return state.map((peg) => [...peg]);
}

function serialize(state) {
  return JSON.stringify(state);
}

function isEqual(a, b) {
  return serialize(a) === serialize(b);
}

function getValidMoves(state) {
  const moves = [];
  for (let from = 0; from < 3; from++) {
    if (state[from].length === 0) continue;
    for (let to = 0; to < 3; to++) {
      if (from === to) continue;
      if (state[to].length < PEG_LIMITS[to]) {
        moves.push([from, to]);
      }
    }
  }
  return moves;
}

function applyMove(state, from, to) {
  const next = cloneState(state);
  const ball = next[from].pop();
  next[to].push(ball);
  return next;
}

function findMinimumMoves(start, target) {
  const queue = [{ state: start, steps: 0 }];
  const visited = new Set();
  visited.add(serialize(start));
  while (queue.length > 0) {
    const current = queue.shift();
    if (isEqual(current.state, target)) {
      return current.steps;
    }
    const validMoves = getValidMoves(current.state);
    for (const [from, to] of validMoves) {
      const next = applyMove(current.state, from, to);
      const key = serialize(next);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ state: next, steps: current.steps + 1 });
      }
    }
  }
  return Number.POSITIVE_INFINITY;
}

function Ball({ color, selected }) {
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

function Peg({ peg, pegIndex, onPegClick, selectedPeg, interactive, showLabel }) {
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

function LevelTransitionOverlay({ nextLevelDisplay }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Carregando próximo nível"
    >
      <div
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
        aria-hidden
      />
      <div
        className="level-transition-scanlines absolute inset-0 opacity-50"
        aria-hidden
      />
      <div
        className="level-transition-overlay relative mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/95 to-slate-950/98 px-8 py-10 shadow-[0_0_60px_rgba(34,211,238,0.2),0_0_1px_rgba(255,255,255,0.08)_inset] sm:rounded-3xl sm:px-10 sm:py-12"
      >
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
        <div
          className="relative flex gap-1.5"
          aria-hidden
        >
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

function PegRow({
  state,
  onPegClick,
  selectedPeg,
  interactive,
  showLabels = false,
}) {
  return (
    <div className="grid w-full min-w-0 grid-cols-3 items-end justify-items-center gap-x-1 sm:gap-x-6 md:gap-x-10 lg:gap-x-14">
      {state.map((peg, index) => (
        <Peg
          key={index}
          peg={peg}
          pegIndex={index}
          selectedPeg={selectedPeg}
          onPegClick={onPegClick}
          interactive={interactive}
          showLabel={showLabels}
        />
      ))}
    </div>
  );
}

export default function TorreDeLondresApp() {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [state, setState] = useState(() => cloneState(INITIAL_STATE));
  const [selectedPeg, setSelectedPeg] = useState(null);
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState([]);
  const [finished, setFinished] = useState(false);
  const [levelTransitionLoading, setLevelTransitionLoading] = useState(false);
  const pendingAdvanceTimeoutRef = useRef(null);

  function clearPendingAdvance() {
    if (pendingAdvanceTimeoutRef.current !== null) {
      clearTimeout(pendingAdvanceTimeoutRef.current);
      pendingAdvanceTimeoutRef.current = null;
    }
    setLevelTransitionLoading(false);
  }

  useEffect(() => {
    return () => clearPendingAdvance();
  }, []);

  const currentTarget = EXERCISES[exerciseIndex];

  const minimumMoves = useMemo(
    () => findMinimumMoves(INITIAL_STATE, currentTarget),
    [currentTarget],
  );

  function advanceOrFinishAfterWin(userMovesForRecord) {
    const record = {
      exercise: exerciseIndex + 1,
      userMoves: userMovesForRecord,
      minimumMoves,
    };
    setHistory((prev) => {
      if (prev.some((h) => h.exercise === record.exercise)) return prev;
      return [...prev, record];
    });

    const nextExercise = exerciseIndex + 1;
    if (nextExercise >= EXERCISE_COUNT) {
      toast.success("Exercício correto! Você concluiu todos os exercícios.", {
        duration: 3200,
        icon: "✓",
      });
      setFinished(true);
      return;
    }

    toast.success("Exercício correto! Indo para o próximo…", {
      duration: 2800,
      icon: "✓",
    });

    clearPendingAdvance();
    setLevelTransitionLoading(true);
    pendingAdvanceTimeoutRef.current = window.setTimeout(() => {
      setExerciseIndex(nextExercise);
      setState(cloneState(INITIAL_STATE));
      setMoves(0);
      setLevelTransitionLoading(false);
      pendingAdvanceTimeoutRef.current = null;
    }, 1000);
  }

  function handleRestartFromBeginning() {
    clearPendingAdvance();
    setExerciseIndex(0);
    setState(cloneState(INITIAL_STATE));
    setMoves(0);
    setSelectedPeg(null);
    setHistory([]);
    setFinished(false);
  }

  function handleRestartCurrentLevel() {
    if (finished || levelTransitionLoading) return;
    clearPendingAdvance();
    setState(cloneState(INITIAL_STATE));
    setMoves(0);
    setSelectedPeg(null);
  }

  function handlePreviousExercise() {
    if (finished || exerciseIndex === 0 || levelTransitionLoading) return;
    clearPendingAdvance();
    setHistory((prev) => prev.filter((h) => h.exercise < exerciseIndex));
    setExerciseIndex((i) => i - 1);
    setState(cloneState(INITIAL_STATE));
    setMoves(0);
    setSelectedPeg(null);
  }

  function handleSelectLevel(levelIndex) {
    if (finished || levelTransitionLoading) return;
    const next = Number(levelIndex);
    if (
      !Number.isInteger(next) ||
      next < 0 ||
      next >= EXERCISE_COUNT ||
      next === exerciseIndex
    ) {
      return;
    }
    clearPendingAdvance();
    const displayLevel = next + 1;
    setHistory((prev) => prev.filter((h) => h.exercise <= displayLevel));
    setExerciseIndex(next);
    setState(cloneState(INITIAL_STATE));
    setMoves(0);
    setSelectedPeg(null);
  }

  function handlePegClick(index) {
    if (finished || levelTransitionLoading) return;

    if (selectedPeg === null) {
      if (state[index].length === 0) return;
      setSelectedPeg(index);
      return;
    }

    if (selectedPeg === index) {
      setSelectedPeg(null);
      return;
    }

    if (state[index].length >= PEG_LIMITS[index]) {
      setSelectedPeg(null);
      return;
    }

    const next = applyMove(state, selectedPeg, index);
    const newMoves = moves + 1;
    setState(next);
    setMoves(newMoves);
    setSelectedPeg(null);

    if (!isEqual(next, currentTarget)) return;

    advanceOrFinishAfterWin(newMoves);
  }

  const score = useMemo(() => {
    if (!finished || history.length === 0) return 0;
    let total = 0;
    for (const item of history) {
      if (Number.isFinite(item.minimumMoves)) {
        total += item.minimumMoves / Math.max(item.userMoves, 1);
      }
    }
    return Math.round((total / history.length) * 100);
  }, [finished, history]);

  const minLabel = Number.isFinite(minimumMoves) ? minimumMoves : "—";
  const progressPct = Math.min(
    100,
    Math.round(((exerciseIndex + 1) / EXERCISE_COUNT) * 100),
  );
  const efficiencyPct =
    minLabel !== "—" && moves > 0
      ? Math.min(100, Math.round((minLabel / moves) * 100))
      : null;

  return (
    <div className="game-shell game-shell-bg box-border flex min-h-[100dvh] w-full min-w-0 flex-col px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] text-left text-slate-100 sm:px-6 sm:pb-10 sm:pt-10">
      <Toaster
        position="top-center"
        containerStyle={{
          top: "max(0.75rem, calc(8px + env(safe-area-inset-top)))",
        }}
        toastOptions={{
          className:
            "!bg-slate-900/95 !text-slate-100 !border !border-cyan-500/30 !shadow-[0_0_32px_rgba(34,211,238,0.2)] !rounded-2xl !max-w-[min(100vw-1.5rem,24rem)]",
          duration: 4000,
        }}
      />
      <div className="relative mx-auto w-full min-w-0 max-w-5xl space-y-5 sm:space-y-8">
        <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-3xl sm:-left-8" />
        <div className="pointer-events-none absolute -bottom-8 -right-4 h-32 w-32 rounded-full bg-cyan-500/15 blur-3xl" />

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
            Monte o mesmo padrão da meta com o mínimo de movimentos. Toque na
            haste de origem e depois na de destino.
          </p>
        </header>

        {!finished && (
          <>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-1">
                  <div>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      Progresso da campanha
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-white">
                      Nível {exerciseIndex + 1}{" "}
                      <span className="font-normal text-slate-500">
                        / {EXERCISE_COUNT}
                      </span>
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
                      onChange={(e) =>
                        handleSelectLevel(Number(e.target.value))
                      }
                      className="w-full cursor-pointer rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2 font-mono text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-cyan-500/40 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/35 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[12rem]"
                    >
                      {Array.from({ length: EXERCISE_COUNT }, (_, i) => (
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
                aria-valuemax={EXERCISE_COUNT}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 transition-[width] duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="game-level-track -mx-1 mt-3 overflow-x-auto overscroll-x-contain px-1 sm:mx-0 sm:overflow-visible sm:px-0">
                <div className="flex w-max min-w-full flex-nowrap justify-start gap-1 px-0.5 sm:w-full sm:flex-wrap sm:justify-center sm:gap-1.5 sm:px-0">
                {Array.from({ length: EXERCISE_COUNT }, (_, i) => (
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
                state={currentTarget}
                onPegClick={() => {}}
                interactive={false}
              />
            </section>

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
                  Hastes: 3 · 2 · 1 bolas (esq. → dir.). Só o topo de cada pilha
                  se move.
                </p>

                <PegRow
                  state={state}
                  onPegClick={handlePegClick}
                  selectedPeg={selectedPeg}
                  interactive
                  showLabels
                />

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
                    <p className="mt-1 text-[10px] text-slate-500">
                      vs. ideal neste nível
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
                  <button
                    type="button"
                    onClick={handlePreviousExercise}
                    disabled={exerciseIndex === 0 || levelTransitionLoading}
                    className="w-full shrink-0 rounded-xl border-2 border-slate-600 bg-slate-800/80 px-4 py-3 text-sm font-bold text-slate-200 shadow-lg transition hover:border-slate-500 hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto sm:px-5"
                  >
                    ← Nível anterior
                  </button>
                  <button
                    type="button"
                    onClick={handleRestartCurrentLevel}
                    disabled={levelTransitionLoading}
                    className="w-full shrink-0 rounded-xl border-2 border-cyan-500/40 bg-cyan-950/40 px-4 py-3 text-sm font-bold text-cyan-100 shadow-lg transition hover:border-cyan-400/60 hover:bg-cyan-950/70 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto sm:px-5"
                  >
                    Reiniciar nível
                  </button>
                  <button
                    type="button"
                    onClick={handleRestartFromBeginning}
                    disabled={levelTransitionLoading}
                    className="w-full shrink-0 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-amber-950 shadow-[0_4px_0_rgb(146,64,14),0_12px_24px_rgba(245,158,11,0.25)] transition hover:brightness-110 active:translate-y-0.5 active:shadow-[0_2px_0_rgb(146,64,14)] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:translate-y-0 sm:w-auto sm:px-6"
                  >
                    Reiniciar campanha
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {finished && (
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
                Aproveitamento médio ponderado pelos exercícios. 100% = cada
                nível resolvido com o mínimo de movimentos.
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
                onClick={handleRestartFromBeginning}
                className="mt-8 w-full max-w-md rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_4px_24px_rgba(34,211,238,0.35)] transition hover:brightness-110 active:scale-[0.98] sm:w-auto sm:px-8"
              >
                Jogar de novo
              </button>
            </div>
          </div>
        )}

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
                Replique a meta na arena, movendo só a bola do topo de cada
                haste para uma haste com vaga.
              </li>
              <li>Limites: esquerda 3, centro 2, direita 1 bola.</li>
              <li>
                O mínimo de movimentos é calculado por BFS a partir do padrão
                inicial.
              </li>
              <li>
                Ao acertar, o próximo nível começa automaticamente. Escolha um
                nível no campo &quot;Jogar nível&quot;, use &quot;Reiniciar
                nível&quot;, &quot;Nível anterior&quot; ou &quot;Reiniciar
                campanha&quot; quando precisar.
              </li>
            </ul>
          </div>
        </details>
      </div>

      {levelTransitionLoading && (
        <LevelTransitionOverlay nextLevelDisplay={exerciseIndex + 2} />
      )}
    </div>
  );
}
