import { PEG_LIMITS } from "../constants/towerConstants.js";

export function cloneState(state) {
  return state.map((peg) => [...peg]);
}

export function serialize(state) {
  return JSON.stringify(state);
}

export function isEqual(a, b) {
  return serialize(a) === serialize(b);
}

export function getValidMoves(state) {
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

export function applyMove(state, from, to) {
  const next = cloneState(state);
  const ball = next[from].pop();
  next[to].push(ball);
  return next;
}

export function findMinimumMoves(start, target) {
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
