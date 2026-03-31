import type { Metadata } from 'next';
import BranchLandingPage from '@/components/BranchLandingPage';

export const metadata: Metadata = {
  title: 'Beratungs-Ausschreibungen in der EU — Consulting Tenders | TenderWatch',
  description: 'Finden Sie Beratungs-Ausschreibungen aus ganz Europa. CPV 73xxxxxx — Wirtschaftsberatung, Forschung, Marketing und mehr. 14 Tage kostenlos testen.',
  alternates: {
    canonical: '/branche/beratung',
  },
  openGraph: {
    title: 'Beratungs-Ausschreibungen in der EU — TenderWatch',
    description: 'Täglich neue Consulting-Tenders aus TED. Strategieberatung, IT-Beratung, Marktforschung — CPV 73xxxxxx.',
    url: '/branche/beratung',
  },
};

export const dynamic = 'force-dynamic';

export default function BeratungPage() {
  return <BranchLandingPage slug="beratung" cpvPrefix="73" />;
}
