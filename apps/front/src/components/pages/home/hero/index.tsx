import Layout from '@layouts/Layout'
import { GridSpacer } from '@ui/GridSpacer'

/// Compose Hero Section

import HeroImage from './HeroImage'
import HeroHeader from './HeroHeader'

export default function HomeHero({ className }: { className?: string }) {
  return (
    <Layout as="div" className={`col-span-full ${className}`}>
      {/* Hero Image */}
      <div className="col-span-full row-start-1 row-span-2  z-[2] bg-gradient-to-tr from-primary-indigo-10/80 to-primary-indigo-1/5 " />
      <HeroImage />

      {/* Hero Header */}
      <div className="absolute top-0 left-0 z-[25] bg-slate-400" />
      <HeroHeader />

      {/* SEARCH */}

      {/* About Section */}
    </Layout>
  )
}
