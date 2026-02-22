import db from '@/db';
import { NextResponse } from 'next/server';
import { accounts, advisorCustodians, advisors, holdings, securities } from '@/db/schema';
import { AccountJSON, AdvisorJSON, SecurityJSON } from '@/db/schema.types';
import { sql } from 'drizzle-orm';
import { calculateStats } from '@/app/lib/stats';
import { readJSON } from '@/app/lib/read-json';

/**
 * POST /api/seed
 *
 * Seeds the database with initial records.
 *
 * @returns 200 with `{ success: true }` indicating successfull data seeding
 * @throws {Error} If DB connection fails
 */
export async function POST() {
  try {
    console.log('🌱 Starting seed...\n');

    // Proper reset with TRUNCATE
    await db.execute(
      sql`TRUNCATE advisors, advisor_custodians, accounts, holdings, securities RESTART IDENTITY CASCADE`,
    );
    const advisorsData = readJSON<AdvisorJSON>('advisors.json');
    const accountsData = readJSON<AccountJSON>('accounts.json');
    const securitiesData = readJSON<SecurityJSON>('securities.json');

    // -------- Seed Advisors --------
    for (const advisor of advisorsData) {
      await db.insert(advisors).values({
        id: advisor.id,
        name: advisor.name,
      });

      for (const custodian of advisor.custodians) {
        await db.insert(advisorCustodians).values({
          advisorId: advisor.id,
          name: custodian.name,
          repId: custodian.repId,
        });
      }
    }
    console.log(`✅ Seeded ${advisorsData.length} advisors`);

    // -------- Seed Accounts & Holdings --------
    for (const account of accountsData) {
      const [inserted] = await db
        .insert(accounts)
        .values({
          name: account.name,
          number: account.number,
          repId: account.repId,
          custodian: account.custodian,
        })
        .returning();

      // Seed account's holdings
      for (const holding of account.holdings) {
        await db.insert(holdings).values({
          accountId: inserted.id,
          ticker: holding.ticker,
          units: holding.units.toString(),
          unitPrice: holding.unitPrice.toString(),
        });
      }
    }
    console.log(`✅ Seeded ${accountsData.length} accounts`);

    // -------- Seed Securities --------
    for (const security of securitiesData) {
      await db.insert(securities).values({
        id: security.id,
        ticker: security.ticker,
        name: security.name,
        dateAdded: new Date(security.dateAdded),
      });
    }
    console.log(`✅ Seeded ${securitiesData.length} securities`);

    console.log('\n📊 Calculating stats...\n');
    await calculateStats();

    console.log('\n✅ Seed complete!');
    return Response.json({ success: true });
  } catch (error) {
    console.error('Seed error:', error);
    return new NextResponse('Failed to seed', { status: 500 });
  }
}
