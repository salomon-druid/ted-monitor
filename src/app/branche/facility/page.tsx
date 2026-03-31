import type { Metadata } from 'next';
import BranchLandingPage from '@/components/BranchLandingPage';

export const metadata: Metadata = {
  title: 'Facility Management Ausschreibungen in der EU | TenderWatch',
  description: 'Finden Sie Facility-Management-Ausschreibungen aus ganz Europa. CPV 50xxxxxx — Reinigung, Gebäudetechnik, Sicherheit und mehr. 14 Tage kostenlos testen.',
  alternates: {
    canonical: '/branche/facility',
  },
  openGraph: {
    title: 'Facility Management Ausschreibungen — TenderWatch',
    description: 'Täglich neue FM-Aufträge aus TED. Gebäudereinigung, Haustechnik, Sicherheit — CPV 50xxxxxx.',
    url: '/branche/facility',
  },
};

export const dynamic = 'force-dynamic';

export default function FacilityPage() {
  return <BranchLandingPage slug="facility" cpvPrefix="50" />;
}
