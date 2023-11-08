import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from '@/components/providers/ToasterProvider'
import { ConfettiProvider } from '@/components/providers/ConfettiProvider'

const inter = Inter({ subsets: ['latin'] })

// Define metadata for the application
export const metadata: Metadata = {
  title: 'LMS Next.js',
  description: 'Learning Management System Next.js 13',
}

// Define the RootLayout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Wrap the content with a ClerkProvider, and set the language for the HTML document to 'en'
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}> 
          {/* Add a ConfettiProvider, ToastProvider, and render the children */}
          <ConfettiProvider />
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
