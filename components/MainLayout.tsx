'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import ChatPage from './ChatPage'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'

export type Page = 'chat' | 'about' | 'contact'

export default function MainLayout() {
  const [activePage, setActivePage] = useState<Page>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-alzz-black bg-grid">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30 h-full
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar
          activePage={activePage}
          onNavigate={(page) => {
            setActivePage(page)
            setSidebarOpen(false)
          }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="flex md:hidden items-center px-4 py-3 border-b border-alzz-border bg-alzz-dark">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-alzz-muted hover:text-alzz-text mr-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display text-alzz-red-bright font-bold tracking-wider text-sm">
            CL-ALZZ AI
          </span>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-hidden">
          {activePage === 'chat' && <ChatPage />}
          {activePage === 'about' && <AboutPage />}
          {activePage === 'contact' && <ContactPage />}
        </div>
      </div>
    </div>
  )
}
