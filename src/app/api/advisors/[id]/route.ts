import { withErrorHandling } from '@/app/lib/api';
import { advisors } from '@/db/schema';
import db from '@/db';
import { eq, sql } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return withErrorHandling(async () => {
    const advisorId = params.id;

    // Get advisor
    const [advisor] = await db.select().from(advisors).where(eq(advisors.id, advisorId));

    if (!advisor) {
      return Response.json({ error: 'Advisor not found' }, { status: 404 });
    }

    // Get advisor's accounts with holdings value
    const advisorAccounts = await db.execute(sql`
      SELECT
        acc.id,
        acc.name,
        acc.number,
        acc.custodian,
        COALESCE(SUM(h.units * h.unit_price), 0) as total_value
      FROM advisor_custodians ac
      JOIN accounts acc ON acc.custodian = ac.name AND acc.rep_id = ac.rep_id
      LEFT JOIN holdings h ON h.account_id = acc.id
      WHERE ac.advisor_id = ${advisorId}
      GROUP BY acc.id, acc.name, acc.number, acc.custodian
    `);

    return Response.json({
      data: {
        id: advisor.id,
        name: advisor.name,
        accounts: advisorAccounts.map((acc) => ({
          id: acc.id,
          name: acc.name,
          number: acc.number,
          custodian: acc.custodian,
          totalValue: Number(acc.total_value),
        })),
      },
    });
  });
}
