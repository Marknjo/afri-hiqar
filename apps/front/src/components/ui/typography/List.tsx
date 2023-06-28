export function List({
  ulClassName,
  liClassName,
  liData,
}: {
  ulClassName?: string
  liClassName?: string
  liData: Array<string | number>
}) {
  return (
    <ul className={`my-6 ml-6 list-disc [&>li]:mt-2 ${ulClassName}`}>
      {liData.map(data => (
        <li className={liClassName} key={data}>
          {data}
        </li>
      ))}
    </ul>
  )
}
