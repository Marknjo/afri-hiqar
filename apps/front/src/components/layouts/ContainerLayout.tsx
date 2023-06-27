import { ReactNode } from 'react'

export default function CenterContentContainer({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
      {children}
    </div>
  )
}
