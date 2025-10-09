"use client"

export default function ChatClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col">
      {children}
    </div>
  )
} 