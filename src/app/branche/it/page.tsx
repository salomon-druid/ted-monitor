import type { Metadata } from 'next';
import BranchLandingPage from '@/components/BranchLandingPage';

export const metadata: Metadata = {
  title: 'IT-Ausschreibungen in der EU — Software, Cloud & Beratung | TenderWatch',
  description: 'Finden Sie IT-Ausschreibungen und Software-Tenders aus ganz Europa. CPV 72xxxxxx — automatisch gefiltert und täglich aktualisiert. 14 Tage kostenlos testen.',
  alternates: {
    canonical: '/branche/it',
  },
  openGraph: {
    title: 'IT-Ausschreibungen in der EU — TenderWatch',
    description: 'Täglich neue IT-Aufträge und Software-Tenders aus TED. Automatisch gefiltert nach CPV 72xxxxxx.',
    url: '/branche/it',
  },
};

export const dynamic = 'force-dynamic';

export default function ItPage() {
  return <BranchLandingPage slug="it" cpvPrefix="72" />;
}
