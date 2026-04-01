import type { Metadata } from 'next';
import BranchLandingPage from '@/components/BranchLandingPage';

export const metadata: Metadata = {
  title: 'Sicherheits-Ausschreibungen in der EU — Überwachung & Schutz | TenderWatch',
  description: 'Finden Sie Ausschreibungen für Sicherheitsdienste, Überwachungssysteme und Schutzausrüstung in ganz Europa. CPV 35xxxxxx — automatisch gefiltert und täglich aktualisiert. 14 Tage kostenlos testen.',
  alternates: {
    canonical: '/branche/security',
  },
  openGraph: {
    title: 'Sicherheits-Ausschreibungen in der EU — TenderWatch',
    description: 'Täglich neue Security-Ausschreibungen und Sicherheits-Tenders aus TED. Automatisch gefiltert nach CPV 35xxxxxx.',
    url: '/branche/security',
  },
};

export const dynamic = 'force-dynamic';

export default function SecurityPage() {
  return <BranchLandingPage slug="security" cpvPrefix="35" />;
}
