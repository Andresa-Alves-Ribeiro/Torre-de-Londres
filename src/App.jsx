import { Toaster } from "react-hot-toast";
import { useTowerGame } from "./hooks/useTowerGame.js";
import CampaignCompleteScreen from "./components/CampaignCompleteScreen.jsx";
import CampaignProgress from "./components/CampaignProgress.jsx";
import GameArena from "./components/GameArena.jsx";
import GameHeader from "./components/GameHeader.jsx";
import GameHelp from "./components/GameHelp.jsx";
import TargetObjectiveSection from "./components/TargetObjectiveSection.jsx";
import LevelTransitionOverlay from "./components/tower/LevelTransitionOverlay.jsx";

const TOASTER_OPTIONS = {
  className:
    "!bg-slate-900/95 !text-slate-100 !border !border-cyan-500/30 !shadow-[0_0_32px_rgba(34,211,238,0.2)] !rounded-2xl !max-w-[min(100vw-1.5rem,24rem)]",
  duration: 4000,
};

export default function App() {
  const game = useTowerGame();

  return (
    <div className="game-shell game-shell-bg box-border flex min-h-[100dvh] w-full min-w-0 flex-col px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] text-left text-slate-100 sm:px-6 sm:pb-10 sm:pt-10">
      <Toaster
        position="top-center"
        containerStyle={{
          top: "max(0.75rem, calc(8px + env(safe-area-inset-top)))",
        }}
        toastOptions={TOASTER_OPTIONS}
      />
      <div className="relative mx-auto w-full min-w-0 max-w-5xl space-y-5 sm:space-y-8">
        <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-3xl sm:-left-8" />
        <div className="pointer-events-none absolute -bottom-8 -right-4 h-32 w-32 rounded-full bg-cyan-500/15 blur-3xl" />

        <GameHeader />

        {!game.finished && (
          <>
            <CampaignProgress
              exerciseIndex={game.exerciseIndex}
              exerciseCount={game.exerciseCount}
              progressPct={game.progressPct}
              levelTransitionLoading={game.levelTransitionLoading}
              onSelectLevel={game.selectLevel}
            />
            <TargetObjectiveSection targetState={game.currentTarget} />
            <GameArena
              state={game.state}
              selectedPeg={game.selectedPeg}
              moves={game.moves}
              minLabel={game.minLabel}
              efficiencyPct={game.efficiencyPct}
              exerciseIndex={game.exerciseIndex}
              levelTransitionLoading={game.levelTransitionLoading}
              onPegClick={game.handlePegClick}
              onPreviousExercise={game.goToPreviousExercise}
              onRestartLevel={game.restartCurrentLevel}
              onRestartCampaign={game.restartFromBeginning}
            />
          </>
        )}

        {game.finished && (
          <CampaignCompleteScreen
            score={game.score}
            history={game.history}
            onPlayAgain={game.restartFromBeginning}
          />
        )}

        <GameHelp />
      </div>

      {game.levelTransitionLoading && (
        <LevelTransitionOverlay
          nextLevelDisplay={game.nextOverlayLevelDisplay}
        />
      )}
    </div>
  );
}
