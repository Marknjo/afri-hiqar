import { Heading2, TextP } from '@ui/typography'

export default function HomeAboutContent({
  className,
}: {
  className?: string
}) {
  return (
    <div className={`${className}`}>
      <Heading2>Who We Are</Heading2>
      <TextP>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam porro
        a assumenda est quia consequuntur?
      </TextP>
      <TextP>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam porro
        a assumenda est quia consequuntur?
      </TextP>
      <TextP>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam porro
        a assumenda est quia consequuntur?
      </TextP>
    </div>
  )
}
