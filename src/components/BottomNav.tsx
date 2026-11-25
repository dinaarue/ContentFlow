import { CalendarDays, GitBranch, Home } from 'lucide-react';
import { NavTab } from '../types/content';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

const NAV_ITEMS: {
  id: NavTab;
  label: string;
  icon: typeof Home;
}[] = [
  { id: 'beranda', label: 'Beranda', icon: Home },
  { id: 'alur', label: 'Alur', icon: GitBranch },
  { id: 'kalender', label: 'Kalender', icon: CalendarDays },
];

export function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  return (
    <nav
      aria-label="Navigasi utama"
      className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#34443B]/10 px-4 py-1.5"
    >
      <div className="grid grid-cols-3 gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-[48px] flex flex-col items-center justify-center rounded-2xl transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34443B] ${
                isActive
                  ? 'bg-[#E8EEE5] text-[#34443B]'
                  : 'text-[#34443B]/55 hover:text-[#34443B] hover:bg-[#F7F4EC]/70'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.25 : 1.75}
                  className={isActive ? 'text-[#34443B]' : 'text-[#34443B]/60'}
                />
              </div>
              <span
                className={`text-[11px] mt-0.5 whitespace-nowrap ${
                  isActive ? 'font-semibold text-[#34443B]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
