"use client"

import { Toaster } from "@/components/ui/sonner"
import "@/styles/globals.css"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Geist } from "next/font/google"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
