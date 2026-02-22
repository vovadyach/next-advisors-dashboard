'use client';

import { SkeletonGroup } from '@/app/components/Skeleton/Skeleton';
import { Advisor, SortField } from '@/app/components/AdvisorTable/AdvisorTable.types';
import { Fragment, useEffect, useRef, useState } from 'react';
import {
  CUSTODIANS_LABEL,
  NO_ADVISORS_DATA_LABEL,
} from '@/app/components/AdvisorTable/AdvisorTable.constants';
import { ACCOUNTS_LABEL } from '@/app/shared/constants';
import { SortArrow } from '@/app/components/AdvisorTable/AdvisorTable.components';
import { AccountsTable } from '@/app/components/AccountsTable/AccountsTable';

export function AdvisorsTable() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'totalAssets'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const isFirstLoadRef = useRef(true);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleSort = (field: SortField) => {
    if (!isFirstLoadRef.current) setIsSorting(true);
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    const fetchAdvisors = async () => {
      const res = await fetch(`/api/advisors?sortBy=${sortBy}&order=${sortOrder}`);
      const data = await res.json();
      setAdvisors(data.data);
      setLoading(false);
      setIsSorting(false);
      isFirstLoadRef.current = false;
    };

    fetchAdvisors();
  }, [sortBy, sortOrder]);

  if (loading) {
    return <SkeletonGroup rows={4} variant={'table'} />;
  }

  if (!advisors.length) {
    return <div className="text-sm text-gray-500">{NO_ADVISORS_DATA_LABEL}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow relative">
      {isSorting && (
        <div
          className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] cursor-wait"
          aria-hidden="true"
        />
      )}
      <table
        className={
          isSorting
            ? 'w-full opacity-70 transition-opacity pointer-events-none'
            : 'w-full transition-opacity'
        }
      >
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left w-8"></th>

            <th
              className="p-4 text-left cursor-pointer hover:bg-gray-100"
              onClick={() => toggleSort('name')}
            >
              Name <SortArrow active={sortBy === 'name'} order={sortOrder} />
            </th>
            <th className="p-4 text-left">{CUSTODIANS_LABEL}</th>
            <th
              className="p-4 text-right cursor-pointer hover:bg-gray-100"
              onClick={() => toggleSort('totalAssets')}
            >
              Total Assets <SortArrow active={sortBy === 'totalAssets'} order={sortOrder} />
            </th>
            <th className="p-4 text-right">{ACCOUNTS_LABEL}</th>
          </tr>
        </thead>
        <tbody>
          {advisors.map((advisor) => (
            <Fragment key={advisor.id}>
              <tr
                key={advisor.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleExpand(advisor.id)}
              >
                <td className="p-4">{expandedId === advisor.id ? '▼' : '▶'}</td>
                <td className="p-4 font-medium">{advisor.name}</td>
                <td className="p-4">{advisor.custodians?.join(', ')}</td>
                <td className="p-4 text-right">${advisor.totalAssets.toLocaleString()}</td>
                <td className="p-4 text-right">{advisor.accountCount}</td>
              </tr>

              {expandedId === advisor.id && (
                <tr>
                  <td colSpan={5} className="bg-gray-50 p-4">
                    <AccountsTable advisorId={advisor.id} />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
