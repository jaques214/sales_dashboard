import './globals.css'
import { Roboto } from 'next/font/google'
import Sidebar from '../components/Sidebar'
import { Metadata } from 'next'
import React from "react";

export const metadata: Metadata = {
  title: {
    default: 'Dashboard | Engenheiros das Peles, LDA.',
    template: '%s | Engenheiros das Peles, LDA.',
  },
  description: "Company Sales Dashboard"
}

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {/* <nav className={styles.navbar}>
        </nav> */}
        <Sidebar />
        {children}
      </body>
    </html>
  )
}
