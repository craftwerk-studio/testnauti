import { notFound } from 'next/navigation';
import MarketingNav from '@/components/MarketingNav';
import { getNauticalSchools } from '@/data/nauticalSchools';
import UpdateForm from './UpdateForm';

interface UpdatePageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function ActualizarEscuelaPage({ params }: UpdatePageProps) {
  const { schoolId } = await params;
  const schools = await getNauticalSchools();
  const school = schools.find((s) => s.id === schoolId);

  if (!school) {
    notFound();
  }

  return (
    <>
      <MarketingNav />
      <UpdateForm school={school} />
    </>
  );
}
