/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { CalendarView } from './components/CalendarView';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { WorkflowView } from './components/WorkflowView';
import { INITIAL_CONTENTS } from './data/initialContents';
import { ContentItem, NavTab } from './types/content';

const STORAGE_KEY = 'contentflow_humas_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');
  const [contents, setContents] = useState<ContentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage read errors
    }
    return INITIAL_CONTENTS;
  });

  const [selectedContentId, setSelectedContentId] = useState<string>(
    () => contents[0]?.id ?? 'cf-1'
  );

  const scrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
    } catch {
      // Ignore storage write errors
    }
  }, [contents]);

  const handleChangeTab = (tab: NavTab) => {
    setActiveTab(tab);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWorkflow = (contentId: string) => {
    setSelectedContentId(contentId);
    handleChangeTab('alur');
  };

  const handleCompleteStage = (contentId: string, stageId: number) => {
    setContents((prev) =>
      prev.map((item) => {
        if (item.id !== contentId) return item;

        const completedStages = Array.from(
          new Set([...item.completedStages, stageId])
        ).sort((a, b) => a - b);

        const nextStage = Math.min(9, stageId + 1);
        let nextStatus = item.status;

        if (stageId === 5 && item.status === 'Dalam Revisi') {
          nextStatus = 'Draft';
        } else if (stageId === 7 || stageId === 8) {
          nextStatus = 'Terjadwal';
        }

        const engagementSummary =
          stageId === 9 && !item.engagementSummary
            ? {
                reach: '5.420',
                interactions: '430',
                saveRate: '6,2%',
              }
            : item.engagementSummary;

        return {
          ...item,
          completedStages,
          currentStage: nextStage,
          status: nextStatus,
          revisionNote: stageId === 5 ? undefined : item.revisionNote,
          engagementSummary,
        };
      })
    );
  };

  const handleRequestRevision = (contentId: string, note?: string) => {
    setContents((prev) =>
      prev.map((item) => {
        if (item.id !== contentId) return item;

        return {
          ...item,
          currentStage: 5,
          completedStages: item.completedStages.filter((id) => id < 5),
          status: 'Dalam Revisi',
          revisionNote:
            note ||
            'Perlu penyesuaian materi visual dan caption sebelum dipublikasikan.',
          revisionCount: item.revisionCount + 1,
        };
      })
    );
  };

  const handleApproveEvaluation = (contentId: string) => {
    setContents((prev) =>
      prev.map((item) => {
        if (item.id !== contentId) return item;

        const completedStages = Array.from(
          new Set([...item.completedStages, 1, 2, 3, 4, 5, 6])
        ).sort((a, b) => a - b);

        return {
          ...item,
          completedStages,
          currentStage: 7,
          status: 'Disetujui',
          revisionNote: undefined,
        };
      })
    );
  };

  const handleAddContent = (newItem: Omit<ContentItem, 'id'>) => {
    const id = `cf-${Date.now()}`;
    const created: ContentItem = { ...newItem, id };
    setContents((prev) => [created, ...prev]);
    setSelectedContentId(id);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#EFECE3] flex items-center justify-center sm:py-4">
      <div className="w-full max-w-[390px] h-[100dvh] sm:h-[844px] bg-[#F7F4EC] flex flex-col overflow-hidden sm:rounded-2xl sm:border sm:border-[#34443B]/10 sm:shadow-[0_12px_36px_rgba(52,68,59,0.08)]">
        <Header activeTab={activeTab} />

        <main ref={scrollRef} className="flex-1 overflow-y-auto app-scroll">
          {activeTab === 'beranda' && (
            <HomeView
              contents={contents}
              onOpenWorkflow={handleOpenWorkflow}
              onOpenCalendar={() => handleChangeTab('kalender')}
            />
          )}

          {activeTab === 'alur' && (
            <WorkflowView
              contents={contents}
              selectedContentId={selectedContentId}
              onSelectContent={setSelectedContentId}
              onCompleteStage={handleCompleteStage}
              onRequestRevision={handleRequestRevision}
              onApproveEvaluation={handleApproveEvaluation}
            />
          )}

          {activeTab === 'kalender' && (
            <CalendarView
              contents={contents}
              onAddContent={handleAddContent}
              onOpenWorkflow={handleOpenWorkflow}
            />
          )}
        </main>

        <BottomNav activeTab={activeTab} onChangeTab={handleChangeTab} />
      </div>
    </div>
  );
}
