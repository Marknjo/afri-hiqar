export default function HeroImage({ className }: { className?: string }) {
  return (
    <div
      className={`col-span-full row-start-1 row-span-2  z-[1] md:max-h-[90vh] overflow-hidden  ${className}`}
    >
      <img
        src="./images/homepage-hero.jpg"
        alt="Hero Background"
        className="object-cover object-center w-auto md:w-[100vw] h-[70vh] md:h-[90vh]"
        width="100%"
        height="auto"
      />
    </div>
  )
}
