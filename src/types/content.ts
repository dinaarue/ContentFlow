export type NavTab = 'beranda' | 'alur' | 'kalender';

export type ContentStatus =
  | 'Draft'
  | 'Dalam Revisi'
  | 'Disetujui'
  | 'Terjadwal';

export type SocialPlatform =
  | 'Instagram'
  | 'TikTok'
  | 'LinkedIn'
  | 'YouTube';

export interface WorkflowStageDef {
  id: number;
  title: string;
  description: string;
  phase: 'Perencanaan' | 'Produksi' | 'Publikasi';
}

export interface ContentItem {
  id: string;
  title: string;
  category: string;
  platform: SocialPlatform;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  currentStage: number; // 1 to 9
  completedStages: number[]; // stage IDs completed
  status: ContentStatus;
  revisionNote?: string;
  revisionCount: number;
  pic: string;
  targetAudience: string;
  keyMessage: string;
  engagementSummary?: {
    reach: string;
    interactions: string;
    saveRate: string;
  };
}

export const WORKFLOW_STAGES: WorkflowStageDef[] = [
  {
    id: 1,
    title: 'Riset Ide & Audiens',
    description:
      'Mencari informasi dan memahami karakteristik target audiens.',
    phase: 'Perencanaan',
  },
  {
    id: 2,
    title: 'Brainstorming Ide Konten',
    description:
      'Mengembangkan ide dan menentukan pesan konten.',
    phase: 'Perencanaan',
  },
  {
    id: 3,
    title: 'Pilih Platform',
    description:
      'Menentukan media sosial yang akan digunakan.',
    phase: 'Perencanaan',
  },
  {
    id: 4,
    title: 'Ritme & Jadwal Posting',
    description:
      'Mengatur frekuensi dan jadwal publikasi.',
    phase: 'Perencanaan',
  },
  {
    id: 5,
    title: 'Pembuatan Konten',
    description:
      'Membuat materi visual, video, dan caption.',
    phase: 'Produksi',
  },
  {
    id: 6,
    title: 'Evaluasi Konten',
    description:
      'Memeriksa kelayakan dan kesesuaian konten sebelum dipublikasikan.',
    phase: 'Produksi',
  },
  {
    id: 7,
    title: 'Menentukan Waktu Upload Terbaik',
    description:
      'Menentukan waktu publikasi berdasarkan karakteristik audiens.',
    phase: 'Publikasi',
  },
  {
    id: 8,
    title: 'Posting',
    description:
      'Memublikasikan konten sesuai jadwal.',
    phase: 'Publikasi',
  },
  {
    id: 9,
    title: 'Analisis Engagement',
    description:
      'Menganalisis interaksi dan performa konten setelah dipublikasikan.',
    phase: 'Publikasi',
  },
];

export interface WeekDayOption {
  dateStr: string;
  dayShort: string;
  dayFull: string;
  dateNum: string;
  monthShort: string;
}

export const WEEK_DAYS: WeekDayOption[] = [
  { dateStr: '2026-11-23', dayShort: 'Sen', dayFull: 'Senin', dateNum: '23', monthShort: 'Nov' },
  { dateStr: '2026-11-24', dayShort: 'Sel', dayFull: 'Selasa', dateNum: '24', monthShort: 'Nov' },
  { dateStr: '2026-11-25', dayShort: 'Rab', dayFull: 'Rabu', dateNum: '25', monthShort: 'Nov' },
  { dateStr: '2026-11-26', dayShort: 'Kam', dayFull: 'Kamis', dateNum: '26', monthShort: 'Nov' },
  { dateStr: '2026-11-27', dayShort: 'Jum', dayFull: 'Jumat', dateNum: '27', monthShort: 'Nov' },
  { dateStr: '2026-11-28', dayShort: 'Sab', dayFull: 'Sabtu', dateNum: '28', monthShort: 'Nov' },
  { dateStr: '2026-11-29', dayShort: 'Min', dayFull: 'Minggu', dateNum: '29', monthShort: 'Nov' },
];
