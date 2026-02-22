import { Stats } from '@/app/components/Stats/Stats';
import { AdvisorsTable } from '@/app/components/AdvisorTable/AdvisorTable';

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Advisor Dashboard</h1>
      <Stats />
      <AdvisorsTable />
    </main>
  );
}
