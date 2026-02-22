import { SortOrder } from '@/app/components/AdvisorTable/AdvisorTable.types';

export const SortArrow = ({ active, order }: { active: boolean; order: SortOrder }) => {
  return (
    <span
      className={active ? 'opacity-100' : 'opacity-30'}
      aria-label={
        active ? (order === 'asc' ? 'sorted ascending' : 'sorted descending') : 'sortable'
      }
    >
      {active ? (order === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );
};
