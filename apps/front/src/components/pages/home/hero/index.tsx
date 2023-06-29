import SectionLayout from '@layouts/SectionLayout'

/// Compose Hero Section
import HeroHeader from './HeroHeader'
import HomeSearch from './HomeSearch'
import HomeAboutIMG from './HomeAboutIMG'
import HomeAboutContent from './HomeAboutContent'

export default function HomeHero({ className }: { className?: string }) {
  return (
    <SectionLayout as="div" className={className}>
      {/* HERO */}
      <HeroHeader />

      {/* SEARCH */}
      <HomeSearch />
      {/* Who We Are */}
      <HomeAboutIMG />
      <HomeAboutContent />
    </SectionLayout>
  )
}
