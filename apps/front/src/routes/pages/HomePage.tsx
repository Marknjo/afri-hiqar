import { Helmet } from 'react-helmet-async'
import CenterContentWrapper from '@layouts/ContainerLayout'
import Wrapper from '@layouts/Wrapper'
import Layout from '@layouts/Layout'
import { useQuery } from '@tanstack/react-query'
import { isDev } from '@server/utils'
import { Heading1, TextP } from '@ui/typography'

export default function HomePage() {
  const toursQuery = useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      const res = await fetch(
        `${
          isDev
            ? import.meta.env.VITE_API_URL_DEV
            : import.meta.env.VITE_API_URL_PROD
        }/tours`,
        {
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY,
          },
        },
      )

      if (!res.ok) {
        const {
          errors: [error],
        } = await res.json()

        const {
          data: { message },
        } = error

        throw new Error(message)
      }

      const data = await res.json()

      if (data.status !== 'success') {
        throw new Error(data.message)
      }

      return data
    },
  })

  if (toursQuery.status === 'loading') {
    return null
  }

  console.log(toursQuery.data)

  const colors = [
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
  const divItems = Array.from(new Array(16)).map((_el, i) => i + 1)

  console.log(divItems)

  return (
    <>
      <Helmet>
        <title>AfriHiqar</title>
      </Helmet>
      <Layout>
        <Wrapper as="section">
          <CenterContentWrapper>
            <Heading1 className="uppercase tracking-wider">Home Page</Heading1>
            <TextP>this is home Page</TextP>
          </CenterContentWrapper>
        </Wrapper>
      </Layout>
    </>
  )
}
