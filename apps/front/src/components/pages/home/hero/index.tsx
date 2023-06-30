import Layout from '@layouts/Layout'
import { GridSpacer } from '@ui/GridSpacer'

/// Compose Hero Section

import HeroImage from './HeroImage'

export default function HomeHero({ className }: { className?: string }) {
  return (
    <Layout as="div" className={`col-span-full ${className}`}>
      {/* Hero Image */}
      <div className="col-span-full row-start-1 row-span-2  z-[2] bg-gradient-to-tr from-primary-indigo-10/80 to-primary-indigo-1/5 " />
      <HeroImage />

      {/* SEARCH */}

      {/* About Section */}
    </Layout>
  )
}
