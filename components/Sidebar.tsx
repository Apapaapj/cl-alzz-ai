'use client'

import { Page } from './MainLayout'

const NAV_ITEMS: { page: Page; label: string; icon: string; desc: string }[] = [
  {
    page: 'chat',
    label: 'CHAT AI',
    icon: '◈',
    desc: 'Ngobrol bareng AI',
  },
  {
    page: 'about',
    label: 'DESKRIPSI',
    icon: '◉',
    desc: 'Tentang CL-ALZZ',
  },
  {
    page: 'contact',
    label: 'KONTAK',
    icon: '◎',
    desc: 'Hubungi AlzzIsBack',
  },
]

interface SidebarProps {
  activePage: Page
  onNavigate: (page: Page) => void
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <div className="w-56 h-full bg-alzz-dark border-r border-alzz-border flex flex-col">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-alzz-border">
        <div className="font-display text-alzz-red-bright font-black text-xl tracking-widest glow-red">
          CL-ALZZ
        </div>
        <div className="font-mono text-[10px] text-alzz-muted tracking-[0.2em] mt-1 uppercase">
          AI · v1.0.0
        </div>
        {/* Status dot */}
        <div className="flex items-center gap-2 mt-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-[10px] text-alzz-muted tracking-wider">ONLINE</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ page, label, icon, desc }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`
              w-full text-left px-3 py-3 rounded
              flex items-center gap-3 group
              transition-all duration-200
              ${activePage === page
                ? 'bg-alzz-red text-white glow-red'
                : 'text-alzz-muted hover:text-alzz-text hover:bg-alzz-surface'
              }
            `}
          >
            <span className={`text-lg font-mono ${activePage === page ? 'text-white' : 'text-alzz-red'}`}>
              {icon}
            </span>
            <div>
              <div className={`font-mono text-xs font-bold tracking-wider ${activePage === page ? 'text-white' : ''}`}>
                {label}
              </div>
              <div className="font-mono text-[9px] opacity-60 tracking-wide">
                {desc}
              </div>
            </div>
            {activePage === page && (
              <span className="ml-auto text-xs font-mono text-alzz-red-glow opacity-80">▶</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-alzz-border">
        <div className="font-mono text-[9px] text-alzz-muted tracking-wide leading-relaxed">
          <div>OWNER: ALZZISBACK</div>
          <div className="mt-0.5 opacity-60">AGE: 616m</div>
        </div>
      </div>
    </div>
  )
}
