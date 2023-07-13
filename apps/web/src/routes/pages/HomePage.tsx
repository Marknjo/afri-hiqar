import { Helmet } from 'react-helmet-async'
import Layout from '@layouts/Layout'
import { useQuery } from '@tanstack/react-query'
import { isDev } from '@server/utils'
import HomeHero from '@pages/home/hero'

/// Sections
import TopRated from '@pages/home/topRated'
import Reviews from '@pages/home/reviews'
import Offers from '@pages/home/offers'
import ContactUs from '@pages/home/contact'

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

  return (
    <>
      <Helmet>
        <title>AfriHiqar</title>
      </Helmet>

      <Layout as="div">
        {/* Navigation */}

        {/* HERO */}
        <HomeHero />

        {/* Top Rated Experiences */}
        <TopRated />

        {/* What People Say About Us */}
        <Reviews />

        {/* The Perks */}
        <Offers />

        {/* Contact Us */}
        <ContactUs />

        {/* Footer */}
      </Layout>
    </>
  )
}
