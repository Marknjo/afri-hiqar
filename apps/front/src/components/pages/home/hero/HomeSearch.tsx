import SectionLayout from '@layouts/SectionLayout'
import { Heading2 } from '@ui/typography'

export default function HomeSearch({ className }: { className?: string }) {
  return (
    <SectionLayout as="div" className={`${className}`}>
      <Heading2>Find Your Journey</Heading2>
      <div>
        <p>Check In:</p>
        <p>Check In:</p>
        <p>Search</p>
      </div>
    </SectionLayout>
  )
}
