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

const config = {
  title: 'Beratungs-Ausschreibungen',
  cpvPrefix: '73',
  heroHeadline: 'Beratungs-Ausschreibungen – Consulting-Aufträge der öffentlichen Hand',
  heroSubheadline: 'Die öffentliche Hand vergibt jährlich Milliarden für Beratungsleistungen. Von Strategieberatung über Marktforschung bis Projektmanagement — TenderWatch liefert täglich passende Ausschreibungen nach CPV 73xxxxxx.',
  industryName: 'Beratung',
  statsLabel: 'Beratung & Consulting · CPV 73xxxxxx',
  benefits: [
    {
      title: 'Beratungsspezifische Filter',
      desc: 'Unser System unterscheidet zwischen Managementberatung, IT-Beratung, Marktforschung, technischer Beratung und weiteren Consulting-Bereichen.',
    },
    {
      title: 'Rahmenvertrag-Übersicht',
      desc: 'Beratungsleistungen werden oft über Rahmenverträge vergeben. Erkennen Sie die echten Volumina und Laufzeiten auf einen Blick.',
    },
    {
      title: 'Bewertungskriterien verstehen',
      desc: 'Unsere KI extrahiert die Bewertungskriterien aus den Vergabeunterlagen — Preis, Qualität, Erfahrung, Methodik — damit Sie Ihr Angebot optimal ausrichten.',
    },
    {
      title: 'Referenzanforderungen filtern',
      desc: 'Viele Beratungsausschreibungen erfordern spezifische Referenzen. Filtern Sie nach Anforderungen, die Ihr Beratungsunternehmen erfüllt.',
    },
    {
      title: 'Team-Kapazitätsplanung',
      desc: 'Planen Sie Ihre Ressourcen besser. TenderWatch zeigt Ihnen anstehende Fristen und hilft, Ihr Beratungsteam rechtzeitig einzuplanen.',
    },
    {
      title: 'Wettbewerbsbeobachtung',
      desc: 'Erfahren Sie, welche Beratungen sich für ähnliche Aufträge bewerben. Nutzen Sie diese Intelligenz für Ihre strategische Positionierung.',
    },
  ],
};

export default function BeratungPage() {
  return <BranchLandingPage config={config} />;
}
