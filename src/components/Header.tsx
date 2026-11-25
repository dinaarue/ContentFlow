import { NavTab } from '../types/content';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activeTab: NavTab;
}

const PAGE_LABELS: Record<NavTab, string> = {
  beranda: 'Beranda',
  alur: 'Alur Konten',
  kalender: 'Kalender',
};

export function Header({ activeTab }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-14 px-5 bg-[#F7F4EC]/95 backdrop-blur-md border-b border-[#34443B]/10 flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <BrandLogo size={32} />
        <span className="font-display font-semibold text-[17px] tracking-tight text-[#34443B] whitespace-nowrap">
          ContentFlow
        </span>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <span className="text-xs font-medium text-[#34443B]/70 whitespace-nowrap">
          {PAGE_LABELS[activeTab]}
        </span>
        <div
          className="w-8 h-8 rounded-full bg-[#D8D0E5] text-[#34443B] flex items-center justify-center text-xs font-semibold tracking-tight select-none"
          title="Admin Tim Humas"
          aria-label="Profil Admin Tim Humas"
        >
          HM
        </div>
      </div>
    </header>
  );
}
