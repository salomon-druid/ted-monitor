import type { Metadata } from 'next';
import BranchLandingPage from '@/components/BranchLandingPage';

export const metadata: Metadata = {
  title: 'Bau-Ausschreibungen in der EU — Täglich neue Bauaufträge | TenderWatch',
  description: 'Finden Sie Bau-Ausschreibungen und Construction-Tenders aus ganz Europa. CPV 45xxxxxx — automatisch gefiltert und täglich aktualisiert. 14 Tage kostenlos testen.',
  alternates: {
    canonical: '/branche/bau',
  },
  openGraph: {
    title: 'Bau-Ausschreibungen in der EU — TenderWatch',
    description: 'Täglich neue Bauaufträge und Construction-Tenders aus TED. Automatisch gefiltert nach CPV 45xxxxxx.',
    url: '/branche/bau',
  },
};

export const dynamic = 'force-dynamic';

export default function BauPage() {
  return <BranchLandingPage slug="bau" cpvPrefix="45" />;
}
