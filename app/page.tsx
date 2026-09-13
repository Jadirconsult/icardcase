import type { Metadata } from 'next'
import { Hero } from '@/components/Hero'
import { ClientSectors } from '@/components/ClientSectors'
import { Services } from '@/components/Services'
import { DataUnification } from '@/components/DataUnification'
import { DiagnosticoSection } from '@/components/DiagnosticoSection'
import { Differentials } from '@/components/Differentials'
import { CasesSection } from '@/components/CasesSection'
import { InsightsSection } from '@/components/InsightsSection'
import { FinalCTA } from '@/components/FinalCTA'
import { HOME_DESCRIPTION, HOME_TITLE, buildMetadata } from '@/lib/seo'

// Título/descrição da home são decisão do dono (constantes em lib/seo.ts).
// absoluteTitle: a home não leva o sufixo do template.
export const metadata: Metadata = buildMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: '/',
  absoluteTitle: true,
})

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientSectors />
      <Services />
      <DataUnification />
      <DiagnosticoSection />
      <Differentials />
      <CasesSection />
      <InsightsSection />
      <FinalCTA />
    </>
  )
}
