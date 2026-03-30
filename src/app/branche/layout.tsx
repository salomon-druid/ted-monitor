import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Branchen — TenderWatch EU Ausschreibungen',
  description: 'Entdecken Sie EU-Ausschreibungen nach Branche: Bau, IT, Facility Management und Beratung. Täglich aktualisierte Vergabemeldungen aus TED.',
};

export default function BranchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
