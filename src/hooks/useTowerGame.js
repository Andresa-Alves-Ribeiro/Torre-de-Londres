import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { EXERCISES, EXERCISE_COUNT } from "../exercises.js";
import { INITIAL_STATE, PEG_LIMITS } from "../constants/towerConstants.js";
import {
  applyMove,
  cloneState,
  findMinimumMoves,
  isEqual,
} from "../utils/towerGameLogic.js";

export function useTowerGame() {
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

  function restartFromBeginning() {
    clearPendingAdvance();
    setExerciseIndex(0);
    setState(cloneState(INITIAL_STATE));
    setMoves(0);
    setSelectedPeg(null);
    setHistory([]);
    setFinished(false);
  }

  function restartCurrentLevel() {
    if (finished || levelTransitionLoading) return;
    clearPendingAdvance();
    setState(cloneState(INITIAL_STATE));
    setMoves(0);
    setSelectedPeg(null);
  }

  function goToPreviousExercise() {
    if (finished || exerciseIndex === 0 || levelTransitionLoading) return;
    clearPendingAdvance();
    setHistory((prev) => prev.filter((h) => h.exercise < exerciseIndex));
    setExerciseIndex((i) => i - 1);
    setState(cloneState(INITIAL_STATE));
    setMoves(0);
    setSelectedPeg(null);
  }

  function selectLevel(levelIndex) {
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

  return {
    exerciseIndex,
    exerciseCount: EXERCISE_COUNT,
    state,
    selectedPeg,
    moves,
    history,
    finished,
    levelTransitionLoading,
    currentTarget,
    minimumMoves,
    minLabel,
    progressPct,
    efficiencyPct,
    score,
    handlePegClick,
    restartFromBeginning,
    restartCurrentLevel,
    goToPreviousExercise,
    selectLevel,
    nextOverlayLevelDisplay: exerciseIndex + 2,
  };
}
