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

const config = {
  title: 'Facility-Management-Ausschreibungen',
  cpvPrefix: '50',
  heroHeadline: 'Facility Management Ausschreibungen – Reinigung, Technik & mehr',
  heroSubheadline: 'Der öffentliche Sektor ist einer der größten Auftraggeber für Facility Management. Entdecken Sie tägliche Ausschreibungen für Gebäudereinigung, Haustechnik, Sicherheitsdienste und mehr — gefiltert nach CPV 50xxxxxx.',
  industryName: 'Facility Management',
  statsLabel: 'Facility Management · CPV 50xxxxxx',
  benefits: [
    {
      title: 'Alle FM-Sparten abgedeckt',
      desc: 'Von Gebäudereinigung über Haustechnik bis Sicherheitsdienste — unser CPV-Matching deckt alle Bereiche des Facility Managements ab.',
    },
    {
      title: 'Laufende Verträge erkennen',
      desc: 'Viele FM-Ausschreibungen sind Nachfolgeverträge. TenderWatch zeigt Ihnen, wann bestehende Verträge auslaufen — für perfekte Timing-Ihres Angebots.',
    },
    {
      title: 'Regionale Fokussierung',
      desc: 'FM-Projekte erfordern lokale Präsenz. Filtern Sie nach Ländern und Regionen, um nur Ausschreibungen in Ihrem Einzugsgebiet zu sehen.',
    },
    {
      title: 'Wertgrenzen & Losvergabe',
      desc: 'Verstehen Sie die Aufteilung in Lose und ermitteln Sie, welche Teilleistungen für Ihr Unternehmen attraktiv sind.',
    },
    {
      title: 'Automatische Fristenwarnung',
      desc: 'FM-Ausschreibungen haben oft kurze Angebotsfristen. Mit TenderWatch verpassen Sie keine Deadline mehr — mit Erinnerungen 7, 3 und 1 Tag vor Ablauf.',
    },
    {
      title: 'Export & Reporting',
      desc: 'Exportieren Sie FM-Ausschreibungen als CSV oder Excel und teilen Sie sie mit Ihrem Team. Ideal für wöchentliche Vertriebsmeetings.',
    },
  ],
};

export default function FacilityPage() {
  return <BranchLandingPage config={config} />;
}
