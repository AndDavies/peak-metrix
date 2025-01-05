// app/dashboard/layout.tsx
import React from "react"
import { Header } from "@/app/components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Header />
      <main className="max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  )
}
