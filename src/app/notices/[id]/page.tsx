import { supabase, Notice } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import NoticeDetailClient from '@/components/NoticeDetailClient';

export const dynamic = 'force-dynamic';

async function getNotice(id: string): Promise<Notice | null> {
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Notice;
}

export default async function NoticeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const notice = await getNotice(params.id);

  if (!notice) {
    notFound();
  }

  return <NoticeDetailClient notice={notice} />;
}
