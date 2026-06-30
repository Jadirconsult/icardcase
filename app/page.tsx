import type { Metadata } from 'next'
import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { DataUnification } from '@/components/DataUnification'
import { Differentials } from '@/components/Differentials'
import { CasesSection } from '@/components/CasesSection'
import { InsightsSection } from '@/components/InsightsSection'
import { FinalCTA } from '@/components/FinalCTA'

// Título/descrição da home herdam o default do layout (já em tom nacional).
// Aqui só fixamos o canonical próprio da raiz.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

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
