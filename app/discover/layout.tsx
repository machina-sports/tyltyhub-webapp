export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-scroll">
        {children}
      </div>
    </div>
  )
}