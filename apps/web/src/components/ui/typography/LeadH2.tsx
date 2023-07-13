import { Heading2 } from './Heading2'

export function LeadH2({
  subH,
  mainH,
  subClassName = '',
  mainClassName = '',
  className = '',
}: {
  subH: string
  mainH: string
  subClassName?: string
  mainClassName?: string
  className?: string
}) {
  return (
    <h2
      className={`scroll-m-20 leading-none text-3xl font-bold tracking-tight transition-colors first:mt-0 flex flex-col ${className}`}
    >
      <span className="border-t-4 border-t-accent-gold-8  w-16 pb-4" />
      <span
        className={`text-xs uppercase text-accent-gold-12 pb-2 tracking-wide ${subClassName}`}
      >
        {subH}
      </span>
      <span className={`tracking-wide ${mainClassName}`}>{mainH}</span>
    </h2>
  )
}
