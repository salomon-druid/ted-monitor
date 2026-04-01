import type { Metadata } from 'next';
import BranchLandingPage from '@/components/BranchLandingPage';

export const metadata: Metadata = {
  title: 'Medizin-Ausschreibungen in der EU — Healthcare & Gesundheit | TenderWatch',
  description: 'Finden Sie Ausschreibungen für Medizintechnik, Arzmittel und Gesundheitsdienstleistungen in ganz Europa. CPV 33xxxxxx — automatisch gefiltert und täglich aktualisiert. 14 Tage kostenlos testen.',
  alternates: {
    canonical: '/branche/medical',
  },
  openGraph: {
    title: 'Medizin-Ausschreibungen in der EU — TenderWatch',
    description: 'Täglich neue Healthcare-Ausschreibungen und Medizintechnik-Tenders aus TED. Automatisch gefiltert nach CPV 33xxxxxx.',
    url: '/branche/medical',
  },
};

export const dynamic = 'force-dynamic';

export default function MedicalPage() {
  return <BranchLandingPage slug="medical" cpvPrefix="33" />;
}
