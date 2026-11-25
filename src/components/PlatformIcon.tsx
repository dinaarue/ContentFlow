import {
  Camera,
  CheckCircle2,
  Clock,
  FileEdit,
  Film,
  Globe,
  PlaySquare,
  RotateCcw,
} from 'lucide-react';
import { ContentStatus, SocialPlatform } from '../types/content';

export function PlatformBadge({ platform }: { platform: SocialPlatform }) {
  const config: Record<
    SocialPlatform,
    { icon: typeof Camera; label: string }
  > = {
    Instagram: { icon: Camera, label: 'Instagram' },
    TikTok: { icon: Film, label: 'TikTok' },
    LinkedIn: { icon: Globe, label: 'LinkedIn' },
    YouTube: { icon: PlaySquare, label: 'YouTube' },
  };

  const { icon: Icon, label } = config[platform];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34443B]/75 whitespace-nowrap">
      <Icon size={13} strokeWidth={2} className="text-[#34443B]/65 shrink-0" />
      <span>{label}</span>
    </span>
  );
}

export function StatusIndicator({ status }: { status: ContentStatus }) {
  const styles: Record<
    ContentStatus,
    { bg: string; text: string; icon: typeof Clock }
  > = {
    Draft: {
      bg: 'bg-[#F7F4EC] border border-[#34443B]/12',
      text: 'text-[#34443B]/80',
      icon: FileEdit,
    },
    'Dalam Revisi': {
      bg: 'bg-[#D8D0E5]/65 border border-[#D8D0E5]',
      text: 'text-[#34443B]',
      icon: RotateCcw,
    },
    Disetujui: {
      bg: 'bg-[#E8EEE5] border border-[#A9BBA6]/60',
      text: 'text-[#34443B]',
      icon: CheckCircle2,
    },
    Terjadwal: {
      bg: 'bg-[#A9BBA6]/45 border border-[#A9BBA6]',
      text: 'text-[#34443B]',
      icon: Clock,
    },
  };

  const { bg, text, icon: Icon } = styles[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 ${bg} ${text}`}
    >
      <Icon size={11} strokeWidth={2.2} className="shrink-0" />
      <span>{status}</span>
    </span>
  );
}
