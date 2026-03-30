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

const config = {
  title: 'IT-Ausschreibungen',
  cpvPrefix: '72',
  heroHeadline: 'IT-Ausschreibungen in der EU – Software, Cloud & Services',
  heroSubheadline: 'Entdecken Sie lukrative IT-Aufträge der öffentlichen Hand. Von Softwareentwicklung über Cloud-Migration bis Cybersecurity — TenderWatch liefert täglich passende Ausschreibungen nach CPV 72xxxxxx.',
  industryName: 'IT',
  statsLabel: 'IT & Software · CPV 72xxxxxx',
  benefits: [
    {
      title: 'IT-spezifische Kategorisierung',
      desc: 'Unser System unterscheidet zwischen Softwareentwicklung, IT-Beratung, Cloud-Services, Wartung und mehr. Sie finden sofort die passenden Aufträge.',
    },
    {
      title: 'Rahmenverträge erkennen',
      desc: 'Öffentliche IT-Beschaffung basiert oft auf Rahmenverträgen. TenderWatch identifiziert diese und zeigt Ihnen die echten Laufzeiten und Volumina.',
    },
    {
      title: 'Technologie-Filter',
      desc: 'Suchen Sie nach spezifischen Technologien — SAP, Microsoft, AWS, Azure, Open Source. Unser KI-System scannt auch die Beschreibungstexte für Sie.',
    },
    {
      title: 'Smarte Benachrichtigungen',
      desc: 'Echtzeit-Alerts für neue IT-Ausschreibungen. Passen Sie Ihre Filter an und erhalten Sie sofort eine E-Mail, wenn ein passender Auftrag erscheint.',
    },
    {
      title: 'Wettbewerbsintelligenz',
      desc: 'Sehen Sie, welche IT-Dienstleister sich für ähnliche Aufträge bewerben und wie hoch die durchschnittliche Bieterzahl in Ihrem Segment ist.',
    },
    {
      title: 'Bid-Fit Scoring',
      desc: 'Jede Ausschreibung erhält einen 0–100% Match-Score. Konzentrieren Sie sich auf die Aufträge, die am besten zu Ihrem IT-Unternehmen passen.',
    },
  ],
};

export default function ItPage() {
  return <BranchLandingPage config={config} />;
}
