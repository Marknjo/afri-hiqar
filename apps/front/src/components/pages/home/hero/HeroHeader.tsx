import { Heading1 } from '@ui/typography'

export default function HeroHeader({ className }: { className?: string }) {
  return (
    <header className={`${className}`}>
      <Heading1>
        <span>
          <span>The</span>
          <span>Worlds</span>
          <span>Most</span>
        </span>

        <span>
          <span>Extra</span>
          <span>Ordinary</span>
          <span>Places</span>
        </span>
      </Heading1>
    </header>
  )
}
