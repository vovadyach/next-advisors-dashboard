import { sql } from 'drizzle-orm';
import db from '@/db';
import { withErrorHandling } from '@/app/lib/api';

export async function GET() {
  return withErrorHandling(async () => {
    const [stats] = await db.execute(sql`
        SELECT COALESCE(SUM(h.units * h.unit_price), 0) as total_value,
               (SELECT COUNT(*) FROM advisors)          as advisor_count,
               (SELECT COUNT(*) FROM accounts)          as account_count
        FROM holdings h
    `);

    return Response.json({
      data: {
        totalValue: Number(stats.total_value),
        advisorCount: Number(stats.advisor_count),
        accountCount: Number(stats.account_count),
      },
    });
  });
}
