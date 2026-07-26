import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CL-ALZZ AI',
  description: 'AI Assistant by AlzzIsBack — Multi-model, Dark Mode, Cyber Aesthetic',
  keywords: ['AI', 'ChatGPT', 'Claude', 'Gemini', 'CL-ALZZ', 'AlzzIsBack'],
  authors: [{ name: 'AlzzIsBack' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-alzz-black text-alzz-text font-body antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
