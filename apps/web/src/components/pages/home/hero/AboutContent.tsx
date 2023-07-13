import { ActionButton } from '@ui/buttons'

import { LeadH2, TextP } from '@ui/typography'
import { Link } from 'react-router-dom'

export default function AboutContent({ className }: { className?: string }) {
  return (
    <div
      className={`col-start-2 col-span-12 md:col-start-2 md:col-span-6 my-8 sm:my-12 ${className}`}
    >
      <LeadH2
        subH="Making Africa Top Visited Destination"
        mainH="Welcome To AfriHiqar"
      />
      <div className="pl-5 lg:pl-8 my-3">
        <TextP>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
          porro a assumenda est quia consequuntur?
        </TextP>
        <TextP>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
          porro a assumenda est quia consequuntur?
        </TextP>
        <TextP>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
          porro a assumenda est quia consequuntur?
        </TextP>

        <div className="flex flex-nowrap md:flex-wrap lg:flex-nowrap gap-x-12 items-center mt-6 md:mt-8">
          <ActionButton type="button" size="sm" asChild>
            <Link to="/" type="button">
              Book Now &nbsp; &rarr;
            </Link>
          </ActionButton>

          <ActionButton
            align="left"
            variant="link"
            size="sm"
            type="button"
            asChild
          >
            <Link to="/" type="button">
              Learn More &nbsp; &rarr;
            </Link>
          </ActionButton>
        </div>
      </div>
    </div>
  )
}
