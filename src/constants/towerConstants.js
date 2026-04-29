/** Estado inicial das hastes antes de cada nível */
export const INITIAL_STATE = [["green", "red"], ["blue"], []];

/** Limite de bolas por haste: esquerda → direita */
export const PEG_LIMITS = [3, 2, 1];

/**
 * Visual das hastes: esquerda mais alta (cap. 3), direita mais baixa (cap. 1).
 * Versão compacta em mobile (antes de sm).
 */
export const PEG_VISUAL = [
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
