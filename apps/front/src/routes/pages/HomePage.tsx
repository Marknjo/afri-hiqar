import { Helmet } from 'react-helmet-async'
import CenterContentWrapper from '@layouts/ContainerLayout'
import Wrapper from '@layouts/Wrapper'
import Layout from '@layouts/Layout'
import { useQuery } from '@tanstack/react-query'

export default function HomePage() {
  const sampleQuery = useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      const res = await fetch('http://localhost:4000/api/v2/tours', {
        headers: {
          'x-api-key':
            'prod_app.9200d8b53d8055c8bebacbf407c44e67/649abe1a4c3192b395dc4796',
        },
      })

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

  if (sampleQuery.status === 'loading') {
    return null
  }

  return (
    <>
      <Helmet>
        <title>AfriHiqar</title>
      </Helmet>
      <Layout>
        <Wrapper as="div">
          <CenterContentWrapper>
            <h1>Home Page</h1>
            <p>this is home Page</p>
          </CenterContentWrapper>
        </Wrapper>
      </Layout>
    </>
  )
}
