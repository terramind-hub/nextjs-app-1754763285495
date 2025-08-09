import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FitTracker - Your Personal Fitness Companion',
  description: 'Track your workouts, monitor progress, and achieve your fitness goals with our comprehensive fitness tracking app.',
  keywords: ['fitness', 'workout', 'exercise', 'health', 'tracking', 'goals'],
  authors: [{ name: 'FitTracker Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0f172a',
  openGraph: {
    title: 'FitTracker - Your Personal Fitness Companion',
    description: 'Track your workouts, monitor progress, and achieve your fitness goals with our comprehensive fitness tracking app.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitTracker - Your Personal Fitness Companion',
    description: 'Track your workouts, monitor progress, and achieve your fitness goals with our comprehensive fitness tracking app.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {/* Navigation */}
          <Navigation />
          
          {/* Main Content */}
          <main className="flex-1">
            <div className="container mx-auto px-4 py-6 lg:px-8">
              {children}
            </div>
          </main>
          
          {/* Footer */}
          <footer className="border-t bg-muted/50 py-6 mt-12">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex flex-col items-center gap-2 md:items-start">
                  <h3 className="text-lg font-semibold">FitTracker</h3>
                  <p className="text-sm text-muted-foreground">
                    Your personal fitness companion
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-2 md:items-end">
                  <p className="text-sm text-muted-foreground">
                    © 2024 FitTracker. All rights reserved.
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition-colors">
                      Privacy Policy
                    </a>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Terms of Service
                    </a>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}