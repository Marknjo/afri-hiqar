export const colors = [
  'bg-border',
  'bg-input',
  'bg-ring',
  'bg-background',
  'bg-foreground',
  'bg-primary',
  'bg-primary-foreground',
  'bg-secondary',
  'bg-secondary-foreground',
  'bg-destructive',
  'bg-destructive-foreground',
  'bg-muted',
  'bg-muted-foreground',
  'bg-accent',
  'bg-accent-foreground',
  'bg-popover',
  'bg-popover-foreground',
]
export const divItems = Array.from(new Array(16)).map((_el, i) => i + 1)

export function ColorsPreview() {
  return (
    <div className="grid grid-cols-auto grid-flow-row gap-x-5 gap-y-5 w-full m-8">
      {colors.map(color => (
        <div
          key={color}
          className={`w-24 h-24 p-4 ${color} flex justify-center items-center`}
        >
          {color}
        </div>
      ))}
    </div>
  )
}
