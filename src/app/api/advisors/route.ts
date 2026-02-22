import { withErrorHandling } from '@/app/lib/api';
import { sql } from 'drizzle-orm';
import db from '@/db';

export async function GET(request: Request) {
  return withErrorHandling(async () => {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'name';
    const order = searchParams.get('order') || 'asc';

    // Validate sortBy to prevent SQL injection
    const validSortFields = ['name', 'totalAssets'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    const result = await db.execute(sql`
      SELECT 
        a.id,
        a.name,
        COALESCE(SUM(h.units * h.unit_price), 0) as total_assets,
        COUNT(DISTINCT acc.id) as account_count
      FROM advisors a
      LEFT JOIN advisor_custodians ac ON a.id = ac.advisor_id
      LEFT JOIN accounts acc ON acc.custodian = ac.name AND acc.rep_id = ac.rep_id
      LEFT JOIN holdings h ON h.account_id = acc.id
      GROUP BY a.id, a.name
      ORDER BY ${sortField === 'name' ? sql`a.name` : sortField === 'totalAssets' ? sql`total_assets` : sql`account_count`} ${sql.raw(sortOrder)}
    `);

    return Response.json({
      data: result.map((row) => ({
        id: row.id,
        name: row.name,
        totalAssets: Number(row.total_assets),
        accountCount: Number(row.account_count),
      })),
    });
  });
}
