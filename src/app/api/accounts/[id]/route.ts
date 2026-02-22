import { withErrorHandling } from '@/app/lib/api';
import { accounts, holdings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return withErrorHandling(async () => {
    const accountId = Number(params.id);

    const [account] = await db.select().from(accounts).where(eq(accounts.id, accountId));

    if (!account) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }

    const accountHoldings = await db
      .select({
        id: holdings.id,
        ticker: holdings.ticker,
        units: holdings.units,
        unitPrice: holdings.unitPrice,
      })
      .from(holdings)
      .where(eq(holdings.accountId, accountId));

    return Response.json({
      data: {
        id: account.id,
        name: account.name,
        number: account.number,
        custodian: account.custodian,
        holdings: accountHoldings.map((h) => ({
          id: h.id,
          ticker: h.ticker,
          units: Number(h.units),
          unitPrice: Number(h.unitPrice),
          totalValue: Number(h.units) * Number(h.unitPrice),
        })),
      },
    });
  });
}
