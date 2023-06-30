export function GridSpacer({
  className,
  showBg = false,
}: {
  className: string
  showBg?: boolean
}) {
  return (
    <div
      className={`col-start-1 col-span-full ${className} ${
        showBg ? 'bg-red-500/50' : ''
      }`}
    />
  )
}
