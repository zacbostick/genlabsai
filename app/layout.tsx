import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/components/modal-provider'
import { ToasterProvider } from '@/components/toaster-provider'
import { CrispProvider } from '@/components/crisp-provider'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GenLabs AI',
  description: 'Where innovation meets Imagination',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider />
        <ToasterProvider />
        <CrispProvider />
        {children}
      </body>
    </html>
    </ClerkProvider>
  )
}
