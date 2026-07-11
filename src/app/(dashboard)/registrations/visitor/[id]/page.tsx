import { VisitorDetail } from '@/features/registrations/components/visitor/visitor-detail';

export default function Page({ params }: { params: { id: string } }) {
  return <VisitorDetail id={params.id} />;
}
