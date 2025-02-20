import './globals.css'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Daily Meal Planner',
  description: 'Choose what to eat every day',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}

