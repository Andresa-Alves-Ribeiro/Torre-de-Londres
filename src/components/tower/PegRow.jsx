import Peg from "./Peg.jsx";

export default function PegRow({
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
