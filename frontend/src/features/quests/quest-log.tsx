import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { QuestLogProvider, useQuestLog } from "./quest-log-provider";
import { QuestDetail } from "./quest-detail";
import { QuestNode } from "./quest-chain-node";
import { ScreenFrame } from "../../shared/ui/screen-frame/screen-frame";
import { ScreenLoader } from "../../shared/ui/screen-loader/screen-loader";
import { usePager } from "../../shared/hooks/use-pager";
import { chainIndexForQuest, resolveFocusQuestId } from "../../shared/quests/paths";
import type { Quest } from "../../shared/api/types";
import "./quest-log.css";

const QUEST_TYPE_ORDER: Record<string, number> = {
  main: 0,
  crafting: 1,
  debug: 2,
  test: 3,
  boss: 4,
};

function groupQuestChains(quests: Quest[]): { stageIndex: number; stageName: string; quests: Quest[] }[] {
  const map = new Map<number, { stageName: string; quests: Quest[] }>();

  for (const quest of quests) {
    const entry = map.get(quest.stage_index) ?? { stageName: quest.stage_name, quests: [] };
    entry.quests.push(quest);
    map.set(quest.stage_index, entry);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => {
      const aTutorial = a >= 100 ? 0 : 1;
      const bTutorial = b >= 100 ? 0 : 1;
      if (aTutorial !== bTutorial) return aTutorial - bTutorial;
      return a - b;
    })
    .map(([stageIndex, { stageName, quests: stageQuests }]) => ({
      stageIndex,
      stageName,
      quests: [...stageQuests].sort(
        (a, b) => (QUEST_TYPE_ORDER[a.quest_type] ?? 9) - (QUEST_TYPE_ORDER[b.quest_type] ?? 9),
      ),
    }));
}

function QuestChainNode({
  quest,
  step,
  isSelected,
  onSelect,
}: {
  quest: Quest;
  step: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  if (quest.quest_type === "boss") {
    return isSelected ? (
      <QuestNode.Boss quest={quest} step={step} onSelect={onSelect} className="quest-node--selected" />
    ) : (
      <QuestNode.Boss quest={quest} step={step} onSelect={onSelect} />
    );
  }

  return isSelected ? (
    <QuestNode.Selected quest={quest} step={step} onSelect={onSelect} />
  ) : (
    <QuestNode quest={quest} step={step} onSelect={onSelect} />
  );
}

function QuestChainScreen() {
  const { state, actions } = useQuestLog();
  const [searchParams] = useSearchParams();
  const questParam = searchParams.get("q");
  const appliedFocusKey = useRef<string | null>(null);
  const chains = useMemo(() => groupQuestChains(state.quests), [state.quests]);
  const pager = usePager(chains.length, 0);

  useEffect(() => {
    if (state.isLoading || chains.length === 0) return;

    const focusKey = `${questParam ?? ""}:${chains.length}`;
    if (appliedFocusKey.current === focusKey) return;
    appliedFocusKey.current = focusKey;

    const focusId = resolveFocusQuestId(state.quests, questParam);
    if (focusId == null) return;

    const chainPage = chainIndexForQuest(chains, focusId);
    pager.setPage(chainPage);
    actions.selectQuest(focusId);

    requestAnimationFrame(() => {
      document.getElementById(`quest-node-${focusId}`)?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    });
  }, [actions, chains, pager.setPage, questParam, state.isLoading, state.quests]);

  const chain = chains[pager.page];

  const selectedQuest = useMemo(() => {
    if (!chain) return undefined;
    if (state.selectedQuestId) {
      const picked = chain.quests.find((quest) => quest.id === state.selectedQuestId);
      if (picked) return picked;
    }
    return (
      chain.quests.find((quest) => quest.status === "in_progress") ??
      chain.quests.find((quest) => quest.status === "not_started") ??
      chain.quests[0]
    );
  }, [chain, state.selectedQuestId]);

  if (state.isLoading) {
    return <ScreenLoader label="Opening quest log..." />;
  }

  if (!chain || !selectedQuest) {
    return <ScreenLoader label="No quests found" />;
  }

  return (
    <ScreenFrame
      title="Quest Log"
      subtitle={`${chain.stageName}${chain.stageIndex >= 100 ? " · Tutorial" : ` · Act ${chain.stageIndex <= 5 ? 1 : chain.stageIndex <= 11 ? 2 : 3}`}`}
    >
      <ScreenFrame.Pager
        page={pager.page}
        total={chains.length}
        onPrev={() => {
          pager.prev();
          actions.clearSelection();
        }}
        onNext={() => {
          pager.next();
          actions.clearSelection();
        }}
        canPrev={pager.canPrev}
        canNext={pager.canNext}
      />
      <div className="quest-chain-screen quest-chain-screen--linked">
        {state.error && <p className="quest-detail__error stats">{state.error}</p>}
        <div className="quest-chain-path">
          <div className="quest-chain">
            {chain.quests.map((quest, index) => (
              <div key={quest.id} id={`quest-node-${quest.id}`} className="quest-chain__segment">
                {index > 0 && <div className="quest-chain__link" aria-hidden />}
                <QuestChainNode
                  quest={quest}
                  step={index + 1}
                  isSelected={selectedQuest.id === quest.id}
                  onSelect={() => actions.selectQuest(quest.id)}
                />
              </div>
            ))}
          </div>
          {selectedQuest && <QuestDetail quest={selectedQuest} />}
        </div>
      </div>
    </ScreenFrame>
  );
}

export function QuestLogPage() {
  return (
    <QuestLogProvider>
      <QuestChainScreen />
    </QuestLogProvider>
  );
}
