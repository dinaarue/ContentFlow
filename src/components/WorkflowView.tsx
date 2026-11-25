import { useState } from 'react';
import {
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  CornerUpLeft,
  RotateCcw,
} from 'lucide-react';
import { ContentItem, WEEK_DAYS, WORKFLOW_STAGES } from '../types/content';
import { PlatformBadge, StatusIndicator } from './PlatformIcon';

interface WorkflowViewProps {
  contents: ContentItem[];
  selectedContentId: string;
  onSelectContent: (id: string) => void;
  onCompleteStage: (contentId: string, stageId: number) => void;
  onRequestRevision: (contentId: string, note?: string) => void;
  onApproveEvaluation: (contentId: string) => void;
}

function formatDateLabel(dateStr: string): string {
  const day = WEEK_DAYS.find((d) => d.dateStr === dateStr);
  return day ? `${day.dayShort}, ${day.dateNum} ${day.monthShort}` : dateStr;
}

export function WorkflowView({
  contents,
  selectedContentId,
  onSelectContent,
  onCompleteStage,
  onRequestRevision,
  onApproveEvaluation,
}: WorkflowViewProps) {
  const [revisionInput, setRevisionInput] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const activeContent =
    contents.find((c) => c.id === selectedContentId) || contents[0];

  if (!activeContent) {
    return (
      <div className="p-5 text-center text-sm text-[#34443B]/70">
        Belum ada konten untuk dipantau. Tambahkan konten melalui halaman Kalender.
      </div>
    );
  }

  const completedCount = activeContent.completedStages.length;
  const progressPercent = Math.round((completedCount / 9) * 100);

  const handleRevisionSubmit = () => {
    const trimmed = revisionInput.trim();
    onRequestRevision(
      activeContent.id,
      trimmed ||
        'Perlu penyesuaian materi visual dan caption agar selaras dengan pesan humas.'
    );
    setShowRevisionInput(false);
    setRevisionInput('');
    setFeedbackBanner(
      'Evaluasi dikembalikan ke Tahap 5 (Pembuatan Konten) dengan status Dalam Revisi.'
    );
  };

  const handleApprove = () => {
    onApproveEvaluation(activeContent.id);
    setShowRevisionInput(false);
    setFeedbackBanner(
      'Konten disetujui. Alur berlanjut ke Tahap 7 (Menentukan Waktu Upload Terbaik).'
    );
  };

  const handleAdvance = (stageId: number) => {
    onCompleteStage(activeContent.id, stageId);
    if (stageId < 9) {
      const nextStage = WORKFLOW_STAGES.find((s) => s.id === stageId + 1);
      setFeedbackBanner(
        `Tahap ${stageId} selesai. Lanjut ke ${stageId + 1}. ${nextStage?.title ?? ''}.`
      );
    } else {
      setFeedbackBanner('Seluruh 9 tahapan alur konten telah selesai.');
    }
  };

  return (
    <div className="px-4 py-5 space-y-4">
      {/* Page Title & Content Selector */}
      <section className="space-y-3">
        <div className="px-1">
          <h1 className="font-display text-[20px] font-bold text-[#34443B] leading-tight">
            Alur Pengelolaan Konten
          </h1>
          <p className="text-xs text-[#34443B]/70 mt-0.5">
            Pantau progres 9 tahapan dari riset hingga analisis engagement
          </p>
        </div>

        {/* Selected Content Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#34443B]/8 shadow-[0_2px_10px_rgba(52,68,59,0.03)]">
          <label
            htmlFor="content-selector"
            className="block text-[11px] font-semibold text-[#34443B]/65 mb-1.5"
          >
            Konten Aktif
          </label>
          <div className="relative">
            <select
              id="content-selector"
              value={activeContent.id}
              onChange={(e) => {
                onSelectContent(e.target.value);
                setFeedbackBanner(null);
                setShowRevisionInput(false);
              }}
              className="w-full appearance-none min-h-[44px] bg-[#F7F4EC] border border-[#34443B]/15 rounded-xl pl-3.5 pr-9 py-2 text-[13.5px] font-semibold text-[#34443B] focus:outline-none focus:ring-2 focus:ring-[#A9BBA6]"
            >
              {contents.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#34443B]/65"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-[#34443B]/75">
              <PlatformBadge platform={activeContent.platform} />
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {formatDateLabel(activeContent.scheduledDate)} · {activeContent.scheduledTime}
              </span>
            </div>
            <StatusIndicator status={activeContent.status} />
          </div>

          {/* Progress bar */}
          <div className="mt-3.5 pt-3 border-t border-[#34443B]/8">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#34443B]/75">
                Tahap saat ini: <strong className="text-[#34443B]">{activeContent.currentStage}/9</strong>
              </span>
              <span className="font-semibold text-[#34443B] tabular-nums">
                {progressPercent}% selesai
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#E8EEE5] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#A9BBA6] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Action Feedback Banner */}
      {feedbackBanner && (
        <div
          role="status"
          className="bg-[#E8EEE5] border border-[#A9BBA6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#34443B] flex items-start justify-between gap-2"
        >
          <span>{feedbackBanner}</span>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="text-[#34443B]/65 hover:text-[#34443B] font-semibold shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Vertical 9-Stage Progress Tracker */}
      <section
        aria-label="Progress tracker vertikal 9 tahapan"
        className="bg-white rounded-2xl p-4 border border-[#34443B]/8 shadow-[0_2px_10px_rgba(52,68,59,0.03)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-[14px] font-semibold text-[#34443B]">
            Tahapan Kerja ContentFlow
          </h2>
          <span className="text-[11px] font-medium text-[#34443B]/65">
            PIC: {activeContent.pic}
          </span>
        </div>

        <ol className="relative">
          {WORKFLOW_STAGES.map((stage, index) => {
            const isLast = index === WORKFLOW_STAGES.length - 1;
            const isCompleted = activeContent.completedStages.includes(stage.id);
            const isCurrent = activeContent.currentStage === stage.id && !isCompleted;
            const isRevisionAtProduction =
              stage.id === 5 &&
              activeContent.status === 'Dalam Revisi' &&
              activeContent.currentStage === 5;
            const isEvaluationStage = stage.id === 6;

            let statusText = 'Menunggu';
            let statusClass = 'text-[#34443B]/50';
            if (isCompleted) {
              statusText = 'Selesai';
              statusClass = 'text-[#34443B]/75';
            } else if (isRevisionAtProduction) {
              statusText = 'Perlu Revisi';
              statusClass = 'text-[#34443B] font-semibold';
            } else if (isCurrent) {
              statusText = 'Sedang Berjalan';
              statusClass = 'text-[#34443B] font-semibold';
            }

            return (
              <li
                key={stage.id}
                className={`relative flex gap-3.5 ${isLast ? '' : 'pb-5'}`}
              >
                {/* Vertical connector line */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className={`absolute left-[15px] top-[34px] bottom-0 w-[2px] ${
                      isCompleted ? 'bg-[#A9BBA6]' : 'bg-[#E8EEE5]'
                    }`}
                  />
                )}

                {/* Step Number Node */}
                <div className="relative z-10 shrink-0 mt-0.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold tabular-nums transition-colors ${
                      isCompleted
                        ? 'bg-[#A9BBA6] text-[#34443B]'
                        : isRevisionAtProduction
                        ? 'bg-[#D8D0E5] text-[#34443B] ring-4 ring-[#D8D0E5]/45'
                        : isCurrent
                        ? 'bg-[#34443B] text-[#F7F4EC] ring-4 ring-[#E8EEE5]'
                        : 'bg-[#F7F4EC] text-[#34443B]/50 border border-[#34443B]/15'
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={15} strokeWidth={2.5} />
                    ) : (
                      stage.id
                    )}
                  </div>
                </div>

                {/* Stage Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`rounded-xl p-3 transition-colors ${
                      isCurrent || isRevisionAtProduction
                        ? isRevisionAtProduction
                          ? 'bg-[#D8D0E5]/35 border border-[#D8D0E5]'
                          : 'bg-[#E8EEE5]/75 border border-[#A9BBA6]/60'
                        : 'bg-[#F7F4EC]/55 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-[13.5px] font-semibold text-[#34443B] leading-snug">
                        {stage.title}
                      </h3>
                      <span
                        className={`text-[11px] whitespace-nowrap shrink-0 ${statusClass}`}
                      >
                        {statusText}
                      </span>
                    </div>

                    <p className="text-xs text-[#34443B]/72 mt-1 leading-relaxed">
                      {stage.description}
                    </p>

                    {/* Contextual detail for stage 5 when returned from Evaluasi */}
                    {isRevisionAtProduction && activeContent.revisionNote && (
                      <div className="mt-2.5 bg-white/90 rounded-lg p-2.5 border border-[#D8D0E5]">
                        <p className="text-[11px] font-semibold text-[#34443B] flex items-center gap-1.5">
                          <CornerUpLeft size={12} />
                          <span>Catatan Revisi dari Evaluasi Konten:</span>
                        </p>
                        <p className="text-xs text-[#34443B]/80 mt-1 leading-relaxed">
                          {activeContent.revisionNote}
                        </p>
                      </div>
                    )}

                    {/* Stage 6: Evaluasi Konten decision buttons (always visible if active, or interactive indicator) */}
                    {isEvaluationStage && isCurrent && (
                      <div className="mt-3 pt-2.5 border-t border-[#34443B]/10 space-y-2.5">
                        <p className="text-[11.5px] font-semibold text-[#34443B]">
                          Keputusan Evaluasi Konten:
                        </p>

                        {!showRevisionInput ? (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setShowRevisionInput(true)}
                              className="min-h-[44px] px-3 py-2 rounded-xl bg-[#D8D0E5] hover:bg-[#CBC1DC] active:scale-[0.98] text-[#34443B] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                            >
                              <RotateCcw size={14} strokeWidth={2.2} />
                              <span>Perlu Revisi</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleApprove}
                              className="min-h-[44px] px-3 py-2 rounded-xl bg-[#A9BBA6] hover:bg-[#99AD96] active:scale-[0.98] text-[#34443B] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                            >
                              <CheckCircle2 size={14} strokeWidth={2.2} />
                              <span>Disetujui</span>
                            </button>
                          </div>
                        ) : (
                          <div className="bg-white rounded-xl p-3 border border-[#D8D0E5] space-y-2">
                            <label
                              htmlFor="revision-note-input"
                              className="block text-[11px] font-semibold text-[#34443B]"
                            >
                              Catatan Perbaikan (kembali ke Tahap 5)
                            </label>
                            <textarea
                              id="revision-note-input"
                              rows={2}
                              value={revisionInput}
                              onChange={(e) => setRevisionInput(e.target.value)}
                              placeholder="Contoh: Perjelas informasi kontak layanan dan sesuaikan warna visual..."
                              className="w-full rounded-lg bg-[#F7F4EC] border border-[#34443B]/15 px-2.5 py-2 text-xs text-[#34443B] placeholder:text-[#34443B]/45 focus:outline-none focus:ring-2 focus:ring-[#D8D0E5]"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setShowRevisionInput(false)}
                                className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg border border-[#34443B]/15 text-xs font-medium text-[#34443B]"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                onClick={handleRevisionSubmit}
                                className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg bg-[#D8D0E5] hover:bg-[#CBC1DC] text-xs font-semibold text-[#34443B]"
                              >
                                Kembalikan ke Pembuatan
                              </button>
                            </div>
                          </div>
                        )}

                        <p className="text-[11px] text-[#34443B]/65 leading-snug">
                          • <strong>Perlu Revisi</strong> mengembalikan alur ke tahap 5 (Pembuatan Konten).
                          <br />• <strong>Disetujui</strong> melanjutkan ke tahap 7 (Waktu Upload Terbaik).
                        </p>
                      </div>
                    )}

                    {/* Action button for other active stages (1-5, 7-9) */}
                    {!isEvaluationStage && isCurrent && (
                      <div className="mt-3 pt-2.5 border-t border-[#34443B]/10">
                        <button
                          type="button"
                          onClick={() => handleAdvance(stage.id)}
                          className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#A9BBA6] hover:bg-[#99AD96] active:scale-[0.99] text-[#34443B] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Check size={14} strokeWidth={2.4} />
                          <span>
                            {stage.id === 5 && activeContent.status === 'Dalam Revisi'
                              ? 'Selesai Revisi & Ajukan Evaluasi'
                              : stage.id === 9
                              ? 'Selesaikan Analisis Engagement'
                              : 'Tandai Selesai & Lanjutkan'}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Stage 9 Illustrative Engagement Preview when stage 9 is completed */}
                    {stage.id === 9 && isCompleted && activeContent.engagementSummary && (
                      <div className="mt-3 pt-2.5 border-t border-[#34443B]/10">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#34443B] mb-2">
                          <BarChart3 size={13} />
                          <span>Ringkasan Performa Konten (Ilustrasi)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center bg-white rounded-xl p-2.5 border border-[#34443B]/8">
                          <div>
                            <p className="font-display text-xs font-bold text-[#34443B] tabular-nums">
                              {activeContent.engagementSummary.reach}
                            </p>
                            <p className="text-[10px] text-[#34443B]/65">Jangkauan</p>
                          </div>
                          <div>
                            <p className="font-display text-xs font-bold text-[#34443B] tabular-nums">
                              {activeContent.engagementSummary.interactions}
                            </p>
                            <p className="text-[10px] text-[#34443B]/65">Interaksi</p>
                          </div>
                          <div>
                            <p className="font-display text-xs font-bold text-[#34443B] tabular-nums">
                              {activeContent.engagementSummary.saveRate}
                            </p>
                            <p className="text-[10px] text-[#34443B]/65">Save Rate</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
