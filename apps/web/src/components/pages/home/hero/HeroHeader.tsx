import { Heading1 } from '@ui/typography'

export default function HeroHeader({ className }: { className?: string }) {
  return (
    <header
      className={`col-start-2 col-span-12 row-start-1 row-span-2 items-center z-[2] place-self-center pb-8  ${className}`}
    >
      <Heading1 className="flex flex-col items-center text-primary-foreground uppercase">
        <span className="flex flex-col items-center text-sm md:text-xl tracking-widest leading-none text-primary-indigo-2/90 py-2 px-4 mb-3 md:mb-5 border-b-4 md:border-b-8 border-dotted border-b-accent-gold-10 w-5 md:w-10">
          <span className="">The</span>
          <span className="">World's</span>
          <span className="">Most</span>
        </span>

        <span className="text-3xl md:text-5xl flex flex-col items-center tracking-widest border-b-4 md:border-b-8 border-dotted border-b-accent-gold-10 w-8 md:w-10 pb-2 md:pb-4">
          <span>Extra</span>
          <span className="text-4xl md:text-6xl text-primary bg-primary-foreground/60 px-4 py-2 mb-2 mt-1 rounded-sm ">
            Ordinary
          </span>
          <span>Places</span>
        </span>
      </Heading1>
    </header>
  )
}
