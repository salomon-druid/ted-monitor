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

const config = {
  title: 'Bau-Ausschreibungen',
  cpvPrefix: '45',
  heroHeadline: 'Bau-Ausschreibungen in der EU – Täglich neue Opportunities',
  heroSubheadline: 'Verpassen Sie keinen Bauauftrag mehr. TenderWatch scannt täglich alle EU-Vergabeplattformen und liefert Ihnen passende Ausschreibungen aus dem Bauwesen – automatisch gefiltert nach CPV 45xxxxxx.',
  industryName: 'Bau',
  statsLabel: 'Bau & Construction · CPV 45xxxxxx',
  benefits: [
    {
      title: 'Spezialisierte Bau-Filter',
      desc: 'Unser CPV-Matching erkennt alle relevanten Bau-Ausschreibungen — von Hochbau über Tiefbau bis Sanierung. Sie sehen nur, was zu Ihrem Unternehmen passt.',
    },
    {
      title: 'Fristen im Blick',
      desc: 'Bau-Projekte haben enge Angebotsfristen. TenderWatch benachrichtigt Sie automatisch 7, 3 und 1 Tag vor Ablauf — damit Sie nie wieder eine Deadline verpassen.',
    },
    {
      title: 'Wettbewerbsanalyse',
      desc: 'Erfahren Sie, wie viele Bieter sich für ähnliche Bauaufträge beworben haben und erhalten Sie eine realistische Einschätzung Ihrer Gewinnchancen.',
    },
    {
      title: 'Projektwert-Filter',
      desc: 'Filtern Sie nach Auftragsvolumen — ob kleine Sanierungsprojekte unter 100.000€ oder Großprojekte über 10 Mio.€. Passen Sie Ihre Suche Ihrem Unternehmensprofil an.',
    },
    {
      title: 'Regionale Abdeckung',
      desc: 'Bau-Ausschreibungen aus allen 27 EU-Mitgliedsstaaten. Filtern Sie nach Land, Region oder nahezu beliebigen Standorten für Ihre Projekte.',
    },
    {
      title: 'KI-Zusammenfassungen',
      desc: 'Lange Vergabeunterlagen? Unsere KI extrahiert die wichtigsten Anforderungen, Zeitpläne und Bewertungskriterien — sparen Sie Stunden bei jeder Ausschreibung.',
    },
  ],
};

export default function BauPage() {
  return <BranchLandingPage config={config} />;
}
