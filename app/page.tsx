import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { DataUnification } from '@/components/DataUnification'
import { Differentials } from '@/components/Differentials'
import { CasesSection } from '@/components/CasesSection'
import { InsightsSection } from '@/components/InsightsSection'
import { FinalCTA } from '@/components/FinalCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <DataUnification />
      <Differentials />
      <CasesSection />
      <InsightsSection />
      <FinalCTA />
    </>
  )
}
