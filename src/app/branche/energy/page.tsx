import type { Metadata } from 'next';
import BranchLandingPage from '@/components/BranchLandingPage';

export const metadata: Metadata = {
  title: 'Energie-Ausschreibungen in der EU — Strom, Gas & Erneuerbare | TenderWatch',
  description: 'Finden Sie Ausschreibungen für Energieversorgung, erneuerbare Energien und Netzausbau in ganz Europa. CPV 09xxxxxx — automatisch gefiltert und täglich aktualisiert. 14 Tage kostenlos testen.',
  alternates: {
    canonical: '/branche/energy',
  },
  openGraph: {
    title: 'Energie-Ausschreibungen in der EU — TenderWatch',
    description: 'Täglich neue Energie-Ausschreibungen und Versorgungstenders aus TED. Automatisch gefiltert nach CPV 09xxxxxx.',
    url: '/branche/energy',
  },
};

export const dynamic = 'force-dynamic';

export default function EnergyPage() {
  return <BranchLandingPage slug="energy" cpvPrefix="09" />;
}
