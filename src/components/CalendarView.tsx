import { FormEvent, useState } from 'react';
import {
  ArrowUpRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  X,
} from 'lucide-react';
import {
  ContentItem,
  ContentStatus,
  SocialPlatform,
  WEEK_DAYS,
  WORKFLOW_STAGES,
} from '../types/content';
import { PlatformBadge, StatusIndicator } from './PlatformIcon';

interface CalendarViewProps {
  contents: ContentItem[];
  onAddContent: (newItem: Omit<ContentItem, 'id'>) => void;
  onOpenWorkflow: (contentId: string) => void;
}

const STATUS_FILTERS: ('Semua' | ContentStatus)[] = [
  'Semua',
  'Draft',
  'Dalam Revisi',
  'Disetujui',
  'Terjadwal',
];

const PLATFORMS: SocialPlatform[] = [
  'Instagram',
  'TikTok',
  'LinkedIn',
  'YouTube',
];

function formatDayAndDate(dateStr: string): string {
  const match = WEEK_DAYS.find((d) => d.dateStr === dateStr);
  if (match) {
    return `${match.dayFull}, ${match.dateNum} ${match.monthShort} 2026`;
  }
  return dateStr;
}

function deriveStageForStatus(status: ContentStatus): {
  currentStage: number;
  completedStages: number[];
} {
  switch (status) {
    case 'Draft':
      return { currentStage: 2, completedStages: [1] };
    case 'Dalam Revisi':
      return { currentStage: 5, completedStages: [1, 2, 3, 4] };
    case 'Disetujui':
      return { currentStage: 7, completedStages: [1, 2, 3, 4, 5, 6] };
    case 'Terjadwal':
      return { currentStage: 8, completedStages: [1, 2, 3, 4, 5, 6, 7] };
  }
}

export function CalendarView({
  contents,
  onAddContent,
  onOpenWorkflow,
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'Semua' | ContentStatus>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add content form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Informasi Publik');
  const [platform, setPlatform] = useState<SocialPlatform>('Instagram');
  const [scheduledDate, setScheduledDate] = useState(WEEK_DAYS[3].dateStr);
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [status, setStatus] = useState<ContentStatus>('Draft');
  const [keyMessage, setKeyMessage] = useState('');
  const [formError, setFormError] = useState('');

  const statusCounts: Record<ContentStatus, number> = {
    Draft: contents.filter((c) => c.status === 'Draft').length,
    'Dalam Revisi': contents.filter((c) => c.status === 'Dalam Revisi').length,
    Disetujui: contents.filter((c) => c.status === 'Disetujui').length,
    Terjadwal: contents.filter((c) => c.status === 'Terjadwal').length,
  };

  const filteredContents = [...contents]
    .filter((item) => {
      const dateMatch =
        selectedDate === 'ALL' || item.scheduledDate === selectedDate;
      const statusMatch =
        statusFilter === 'Semua' || item.status === statusFilter;
      return dateMatch && statusMatch;
    })
    .sort((a, b) =>
      `${a.scheduledDate} ${a.scheduledTime}`.localeCompare(
        `${b.scheduledDate} ${b.scheduledTime}`
      )
    );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Judul konten wajib diisi.');
      return;
    }

    const { currentStage, completedStages } = deriveStageForStatus(status);

    onAddContent({
      title: title.trim(),
      category: category.trim() || 'Informasi Publik',
      platform,
      scheduledDate,
      scheduledTime,
      currentStage,
      completedStages,
      status,
      revisionCount: status === 'Dalam Revisi' ? 1 : 0,
      revisionNote:
        status === 'Dalam Revisi'
          ? 'Menunggu penyesuaian materi konten oleh tim produksi.'
          : undefined,
      pic: 'Tim Humas',
      targetAudience: 'Publik & pemangku kepentingan',
      keyMessage:
        keyMessage.trim() ||
        'Penyampaian informasi resmi instansi secara informatif dan terstruktur.',
    });

    setTitle('');
    setKeyMessage('');
    setFormError('');
    setIsModalOpen(false);
  };

  return (
    <div className="px-4 py-5 space-y-4">
      {/* Header row + Add Button */}
      <section className="flex items-center justify-between gap-3 px-1">
        <div>
          <h1 className="font-display text-[20px] font-bold text-[#34443B] leading-tight">
            Kalender Konten
          </h1>
          <p className="text-xs text-[#34443B]/70 mt-0.5">
            Minggu IV · 23 – 29 November 2026
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#A9BBA6] hover:bg-[#99AD96] active:scale-[0.98] text-[#34443B] text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34443B]"
        >
          <Plus size={16} strokeWidth={2.4} />
          <span>Tambah Konten</span>
        </button>
      </section>

      {/* Weekly Calendar Strip */}
      <section
        aria-label="Kalender mingguan"
        className="bg-white rounded-2xl p-3.5 border border-[#34443B]/8 shadow-[0_2px_10px_rgba(52,68,59,0.03)]"
      >
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <span className="text-xs font-semibold text-[#34443B] flex items-center gap-1.5">
            <CalendarIcon size={14} className="text-[#34443B]/70" />
            <span>Pilih Hari Publikasi</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedDate('ALL')}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
              selectedDate === 'ALL'
                ? 'bg-[#34443B] text-[#F7F4EC]'
                : 'bg-[#F7F4EC] text-[#34443B]/75 hover:text-[#34443B]'
            }`}
          >
            Semua Hari
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEK_DAYS.map((day) => {
            const isSelected = selectedDate === day.dateStr;
            const hasContent = contents.some(
              (c) => c.scheduledDate === day.dateStr
            );

            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() =>
                  setSelectedDate(isSelected ? 'ALL' : day.dateStr)
                }
                aria-pressed={isSelected}
                className={`min-h-[56px] flex flex-col items-center justify-center rounded-xl py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#34443B] ${
                  isSelected
                    ? 'bg-[#A9BBA6] text-[#34443B]'
                    : 'bg-[#F7F4EC]/75 text-[#34443B]/80 hover:bg-[#E8EEE5]'
                }`}
              >
                <span className="text-[10px] font-medium opacity-80">
                  {day.dayShort}
                </span>
                <span className="font-display text-[14px] font-bold tabular-nums mt-0.5">
                  {day.dateNum}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-1 w-1.5 h-1.5 rounded-full ${
                    hasContent
                      ? isSelected
                        ? 'bg-[#34443B]'
                        : 'bg-[#A9BBA6]'
                      : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Brief Workflow Status Summary + Filter */}
      <section
        aria-label="Informasi status alur pengelolaan konten"
        className="bg-[#E8EEE5]/85 rounded-2xl p-3.5 border border-[#A9BBA6]/45"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-xs font-semibold text-[#34443B]">
            Status Alur Pengelolaan Konten
          </h2>
          <span className="text-[11px] text-[#34443B]/70 tabular-nums">
            {contents.length} total
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center">
          {(['Draft', 'Dalam Revisi', 'Disetujui', 'Terjadwal'] as ContentStatus[]).map(
            (st) => {
              const active = statusFilter === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(active ? 'Semua' : st)}
                  className={`rounded-xl py-2 px-1 transition-all border ${
                    active
                      ? 'bg-white border-[#34443B] shadow-xs'
                      : 'bg-white/75 border-transparent hover:bg-white'
                  }`}
                >
                  <p className="font-display text-sm font-bold text-[#34443B] tabular-nums">
                    {statusCounts[st]}
                  </p>
                  <p className="text-[10px] font-medium text-[#34443B]/75 truncate mt-0.5">
                    {st}
                  </p>
                </button>
              );
            }
          )}
        </div>

        {/* Status filter pills strip */}
        <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {STATUS_FILTERS.map((filter) => {
            const isSelected = statusFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#34443B] text-[#F7F4EC]'
                    : 'bg-white/80 text-[#34443B]/75 hover:text-[#34443B]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </section>

      {/* Scheduled Content List */}
      <section aria-label="Daftar konten yang akan dipublikasikan" className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display text-[14px] font-semibold text-[#34443B]">
            Daftar Publikasi ({filteredContents.length})
          </h2>
          {selectedDate !== 'ALL' && (
            <span className="text-[11px] font-medium text-[#34443B]/70">
              {formatDayAndDate(selectedDate)}
            </span>
          )}
        </div>

        {filteredContents.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-[#34443B]/8">
            <p className="text-xs font-medium text-[#34443B]/75">
              Tidak ada konten pada filter hari atau status ini.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDate('ALL');
                setStatusFilter('Semua');
              }}
              className="mt-2.5 text-xs font-semibold text-[#34443B] underline underline-offset-2"
            >
              Tampilkan semua jadwal
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredContents.map((item) => {
              const stageObj = WORKFLOW_STAGES.find(
                (s) => s.id === item.currentStage
              );

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-[#34443B]/8 shadow-[0_2px_10px_rgba(52,68,59,0.03)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-medium text-[#34443B]/65">
                      {formatDayAndDate(item.scheduledDate)}
                    </span>
                    <StatusIndicator status={item.status} />
                  </div>

                  <h3 className="font-display text-[14.5px] font-semibold text-[#34443B] mt-1.5 leading-snug">
                    {item.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#34443B]/75">
                    <PlatformBadge platform={item.platform} />
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Clock size={12} className="text-[#34443B]/60" />
                      <span>{item.scheduledTime} WIB</span>
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#34443B]/8 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#34443B]/65 truncate">
                      Tahap {item.currentStage}/9 · {stageObj?.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenWorkflow(item.id)}
                      className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#34443B] bg-[#F7F4EC] hover:bg-[#E8EEE5] px-2.5 py-1.5 rounded-lg shrink-0 transition-colors"
                    >
                      <span>Buka Alur</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Add Content Bottom Sheet Modal (contained inside mobile shell) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#34443B]/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-content-title"
        >
          <div className="w-full max-w-[390px] bg-white rounded-t-3xl p-5 max-h-[88dvh] overflow-y-auto shadow-xl">
            <div className="w-10 h-1 bg-[#34443B]/15 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between mb-4">
              <h2
                id="add-content-title"
                className="font-display text-base font-bold text-[#34443B]"
              >
                Tambah Jadwal Konten
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Tutup form tambah konten"
                className="w-9 h-9 rounded-full bg-[#F7F4EC] flex items-center justify-center text-[#34443B]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label
                  htmlFor="input-title"
                  className="block text-xs font-semibold text-[#34443B] mb-1"
                >
                  Nama / Judul Konten
                </label>
                <input
                  id="input-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="Contoh: Sosialisasi Beasiswa Prestasi 2026"
                  className="w-full min-h-[44px] rounded-xl bg-[#F7F4EC] border border-[#34443B]/15 px-3 text-xs text-[#34443B] placeholder:text-[#34443B]/45 focus:outline-none focus:ring-2 focus:ring-[#A9BBA6]"
                />
                {formError && (
                  <p className="text-[11px] text-red-700 mt-1">{formError}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="input-platform"
                    className="block text-xs font-semibold text-[#34443B] mb-1"
                  >
                    Platform
                  </label>
                  <select
                    id="input-platform"
                    value={platform}
                    onChange={(e) =>
                      setPlatform(e.target.value as SocialPlatform)
                    }
                    className="w-full min-h-[44px] rounded-xl bg-[#F7F4EC] border border-[#34443B]/15 px-3 text-xs font-medium text-[#34443B] focus:outline-none focus:ring-2 focus:ring-[#A9BBA6]"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="input-status"
                    className="block text-xs font-semibold text-[#34443B] mb-1"
                  >
                    Status Awal
                  </label>
                  <select
                    id="input-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ContentStatus)}
                    className="w-full min-h-[44px] rounded-xl bg-[#F7F4EC] border border-[#34443B]/15 px-3 text-xs font-medium text-[#34443B] focus:outline-none focus:ring-2 focus:ring-[#A9BBA6]"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Dalam Revisi">Dalam Revisi</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Terjadwal">Terjadwal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="input-date"
                    className="block text-xs font-semibold text-[#34443B] mb-1"
                  >
                    Tanggal Publikasi
                  </label>
                  <select
                    id="input-date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl bg-[#F7F4EC] border border-[#34443B]/15 px-3 text-xs font-medium text-[#34443B] focus:outline-none focus:ring-2 focus:ring-[#A9BBA6]"
                  >
                    {WEEK_DAYS.map((d) => (
                      <option key={d.dateStr} value={d.dateStr}>
                        {d.dayShort}, {d.dateNum} {d.monthShort}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="input-time"
                    className="block text-xs font-semibold text-[#34443B] mb-1"
                  >
                    Jam Publikasi (WIB)
                  </label>
                  <input
                    id="input-time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl bg-[#F7F4EC] border border-[#34443B]/15 px-3 text-xs font-medium text-[#34443B] focus:outline-none focus:ring-2 focus:ring-[#A9BBA6]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="input-category"
                  className="block text-xs font-semibold text-[#34443B] mb-1"
                >
                  Topik Kehumasan
                </label>
                <input
                  id="input-category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Informasi Publik / Liputan Kegiatan"
                  className="w-full min-h-[44px] rounded-xl bg-[#F7F4EC] border border-[#34443B]/15 px-3 text-xs text-[#34443B] focus:outline-none focus:ring-2 focus:ring-[#A9BBA6]"
                />
              </div>

              <div>
                <label
                  htmlFor="input-message"
                  className="block text-xs font-semibold text-[#34443B] mb-1"
                >
                  Pesan Utama (Opsional)
                </label>
                <textarea
                  id="input-message"
                  rows={2}
                  value={keyMessage}
                  onChange={(e) => setKeyMessage(e.target.value)}
                  placeholder="Ringkasan pesan yang ingin disampaikan kepada audiens..."
                  className="w-full rounded-xl bg-[#F7F4EC] border border-[#34443B]/15 px-3 py-2 text-xs text-[#34443B] placeholder:text-[#34443B]/45 focus:outline-none focus:ring-2 focus:ring-[#A9BBA6]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 min-h-[44px] rounded-xl border border-[#34443B]/15 text-xs font-semibold text-[#34443B]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] rounded-xl bg-[#A9BBA6] hover:bg-[#99AD96] text-xs font-semibold text-[#34443B]"
                >
                  Simpan Konten
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
