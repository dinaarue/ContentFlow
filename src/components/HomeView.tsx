import { ArrowRight, CalendarClock, CheckCircle2, Layers } from 'lucide-react';
import { ContentItem, WEEK_DAYS, WORKFLOW_STAGES } from '../types/content';
import { PlatformBadge, StatusIndicator } from './PlatformIcon';

interface HomeViewProps {
  contents: ContentItem[];
  onOpenWorkflow: (contentId: string) => void;
  onOpenCalendar: () => void;
}

function formatShortDate(dateStr: string): string {
  const match = WEEK_DAYS.find((d) => d.dateStr === dateStr);
  if (match) {
    return `${match.dayShort}, ${match.dateNum} ${match.monthShort}`;
  }
  return dateStr;
}

export function HomeView({
  contents,
  onOpenWorkflow,
  onOpenCalendar,
}: HomeViewProps) {
  const totalContents = contents.length;
  const totalStageSlots = totalContents * 9;
  const completedStageSlots = contents.reduce(
    (sum, item) => sum + item.completedStages.length,
    0
  );
  const overallPercent =
    totalStageSlots > 0
      ? Math.round((completedStageSlots / totalStageSlots) * 100)
      : 0;

  const scheduledCount = contents.filter((c) => c.status === 'Terjadwal').length;
  const revisionCount = contents.filter((c) => c.status === 'Dalam Revisi').length;

  // Pick the best active item for "Lanjutkan Alur Kerja"
  const activeTask =
    contents.find((c) => c.status === 'Dalam Revisi') ||
    contents.find((c) => c.currentStage === 6 && !c.completedStages.includes(6)) ||
    contents.find((c) => c.completedStages.length < 9) ||
    contents[0];

  const activeStageDef = activeTask
    ? WORKFLOW_STAGES.find((s) => s.id === activeTask.currentStage)
    : undefined;

  // Pick next upcoming scheduled/approved content
  const nextScheduled = [...contents]
    .filter((c) => c.status === 'Terjadwal' || c.status === 'Disetujui')
    .sort((a, b) =>
      `${a.scheduledDate} ${a.scheduledTime}`.localeCompare(
        `${b.scheduledDate} ${b.scheduledTime}`
      )
    )[0];

  return (
    <div className="px-4 py-5 space-y-4">
      {/* Greeting */}
      <section aria-label="Sapaan pengguna" className="px-1">
        <p className="text-xs font-medium text-[#34443B]/65">
          Tim Humas · Minggu IV November 2026
        </p>
        <h1 className="font-display text-[22px] font-bold text-[#34443B] leading-tight mt-0.5">
          Hai, Admin!
        </h1>
        <p className="text-[13px] text-[#34443B]/75 mt-1 leading-relaxed">
          Pantau progres produksi dan jadwal publikasi konten kehumasan minggu ini.
        </p>
      </section>

      {/* Weekly Progress Card */}
      <section
        aria-label="Ringkasan progres konten mingguan"
        className="bg-white rounded-2xl p-4 border border-[#34443B]/8 shadow-[0_2px_10px_rgba(52,68,59,0.03)]"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[14px] font-semibold text-[#34443B]">
              Progres Konten Mingguan
            </h2>
            <p className="text-xs text-[#34443B]/60 mt-0.5 tabular-nums">
              {completedStageSlots} dari {totalStageSlots} tahapan selesai
            </p>
          </div>
          <span className="font-display text-xl font-bold text-[#34443B] tabular-nums">
            {overallPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div
          className="mt-3 h-2.5 w-full rounded-full bg-[#E8EEE5] overflow-hidden"
          role="progressbar"
          aria-valuenow={overallPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Persentase progres mingguan"
        >
          <div
            className="h-full rounded-full bg-[#A9BBA6] transition-all duration-300"
            style={{ width: `${overallPercent}%` }}
          />
        </div>

        {/* Clean 3-metric strip */}
        <div className="mt-3.5 pt-3 border-t border-[#34443B]/8 grid grid-cols-3 divide-x divide-[#34443B]/10 text-center">
          <div className="px-1">
            <p className="font-display text-base font-bold text-[#34443B] tabular-nums">
              {totalContents}
            </p>
            <p className="text-[11px] text-[#34443B]/65">Total Konten</p>
          </div>
          <div className="px-1">
            <p className="font-display text-base font-bold text-[#34443B] tabular-nums">
              {revisionCount}
            </p>
            <p className="text-[11px] text-[#34443B]/65">Perlu Revisi</p>
          </div>
          <div className="px-1">
            <p className="font-display text-base font-bold text-[#34443B] tabular-nums">
              {scheduledCount}
            </p>
            <p className="text-[11px] text-[#34443B]/65">Terjadwal</p>
          </div>
        </div>
      </section>

      {/* Continue Workflow Hero Card */}
      {activeTask && activeStageDef && (
        <section
          aria-label="Lanjutkan Alur Kerja"
          className="bg-[#E8EEE5] rounded-2xl p-4 border border-[#A9BBA6]/50"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#34443B]/75">
              Lanjutkan Alur Kerja
            </span>
            <StatusIndicator status={activeTask.status} />
          </div>

          <h2 className="font-display text-[15px] font-semibold text-[#34443B] mt-2 leading-snug">
            {activeTask.title}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-xs text-[#34443B]/75">
            <PlatformBadge platform={activeTask.platform} />
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-medium">
              Tahap {activeTask.currentStage}/9
            </span>
          </div>

          <div className="mt-3 bg-white/85 rounded-xl p-3 border border-[#34443B]/8">
            <p className="text-xs font-semibold text-[#34443B]">
              {activeStageDef.id}. {activeStageDef.title}
            </p>
            <p className="text-xs text-[#34443B]/70 mt-0.5 leading-relaxed">
              {activeTask.status === 'Dalam Revisi' && activeTask.revisionNote
                ? activeTask.revisionNote
                : activeStageDef.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenWorkflow(activeTask.id)}
            className="mt-3 w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#A9BBA6] hover:bg-[#99AD96] active:scale-[0.99] text-[#34443B] font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34443B]"
          >
            <span>Buka Alur Pengerjaan</span>
            <ArrowRight size={15} strokeWidth={2.2} />
          </button>
        </section>
      )}

      {/* Next Scheduled Publication */}
      <section
        aria-label="Jadwal publikasi konten berikutnya"
        className="bg-white rounded-2xl p-4 border border-[#34443B]/8 shadow-[0_2px_10px_rgba(52,68,59,0.03)]"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#D8D0E5]/60 flex items-center justify-center text-[#34443B]">
              <CalendarClock size={15} strokeWidth={2} />
            </div>
            <h2 className="font-display text-[14px] font-semibold text-[#34443B]">
              Jadwal Publikasi Berikutnya
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenCalendar}
            className="text-xs font-semibold text-[#34443B]/75 hover:text-[#34443B] py-1 px-2 -mr-2 rounded-lg transition-colors"
          >
            Lihat Semua
          </button>
        </div>

        {nextScheduled ? (
          <div className="mt-3 pt-3 border-t border-[#34443B]/8 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold text-[#34443B] leading-snug">
                {nextScheduled.title}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#34443B]/70">
                <PlatformBadge platform={nextScheduled.platform} />
                <span aria-hidden="true">·</span>
                <span className="tabular-nums font-medium">
                  {formatShortDate(nextScheduled.scheduledDate)}, {nextScheduled.scheduledTime} WIB
                </span>
              </div>
            </div>
            <StatusIndicator status={nextScheduled.status} />
          </div>
        ) : (
          <p className="mt-3 text-xs text-[#34443B]/65">
            Belum ada konten berstatus disetujui atau terjadwal minggu ini.
          </p>
        )}
      </section>

      {/* ContentFlow 9-Stage Summary */}
      <section
        aria-label="Ringkasan alur ContentFlow"
        className="bg-white rounded-2xl p-4 border border-[#34443B]/8 shadow-[0_2px_10px_rgba(52,68,59,0.03)]"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-[14px] font-semibold text-[#34443B]">
              Ringkasan Alur ContentFlow
            </h2>
            <p className="text-xs text-[#34443B]/65 mt-0.5">
              9 tahapan terstruktur dari riset hingga analisis
            </p>
          </div>
          <div className="w-7 h-7 rounded-lg bg-[#E8EEE5] flex items-center justify-center text-[#34443B]">
            <Layers size={14} strokeWidth={2} />
          </div>
        </div>

        <ol className="mt-3.5 space-y-2">
          {WORKFLOW_STAGES.map((stage) => {
            const countAtStage = contents.filter(
              (c) => c.currentStage === stage.id
            ).length;
            const isEvaluation = stage.id === 6;

            return (
              <li
                key={stage.id}
                className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-xl bg-[#F7F4EC]/75"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 tabular-nums ${
                      isEvaluation
                        ? 'bg-[#D8D0E5] text-[#34443B]'
                        : 'bg-[#E8EEE5] text-[#34443B]'
                    }`}
                  >
                    {stage.id}
                  </span>
                  <span className="text-xs font-medium text-[#34443B] truncate">
                    {stage.title}
                  </span>
                </div>

                {countAtStage > 0 ? (
                  <span className="text-[11px] font-semibold text-[#34443B] bg-[#A9BBA6]/35 px-2 py-0.5 rounded-md tabular-nums shrink-0">
                    {countAtStage} aktif
                  </span>
                ) : (
                  <CheckCircle2
                    size={13}
                    className="text-[#A9BBA6] shrink-0"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
