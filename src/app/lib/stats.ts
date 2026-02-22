import db from '@/db';
import { accounts, advisorCustodians, advisors, holdings } from '@/db/schema';

// ============ CALCULATE STATS ============
export async function calculateStats() {
  // 1. Total value across all accounts
  const allHoldings = await db.select().from(holdings);
  const totalValue = allHoldings.reduce((sum, h) => {
    return sum + Number(h.units) * Number(h.unitPrice);
  }, 0);
  console.log(
    `💰 Total Value: $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
  );

  // 2. Top securities by value
  const holdingsByTicker: Record<string, number> = {};
  for (const h of allHoldings) {
    const value = Number(h.units) * Number(h.unitPrice);
    holdingsByTicker[h.ticker] = (holdingsByTicker[h.ticker] || 0) + value;
  }
  const topSecurities = Object.entries(holdingsByTicker)
    .map(([ticker, value]) => ({ ticker, value, percentage: (value / totalValue) * 100 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  console.log('\n📈 Top Securities:');
  topSecurities.forEach((s, i) => {
    console.log(
      `   ${i + 1}. ${s.ticker}: $${s.value.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${s.percentage.toFixed(2)}%)`,
    );
  });

  // 3. Assets by custodian → advisors ranked
  const allAccounts = await db.select().from(accounts);
  const allAdvisorCustodians = await db.select().from(advisorCustodians);
  const allAdvisors = await db.select().from(advisors);

  // Map account values
  const accountValues: Record<number, number> = {};
  for (const h of allHoldings) {
    accountValues[h.accountId] =
      (accountValues[h.accountId] || 0) + Number(h.units) * Number(h.unitPrice);
  }

  // Group by custodian → advisor
  const custodianAdvisorAssets: Record<string, Record<string, number>> = {};

  for (const ac of allAdvisorCustodians) {
    const custodian = ac.name;
    const advisorId = ac.advisorId;
    const repId = ac.repId;

    // Find accounts for this ad`visor at this custodian
    const advisorAccounts = allAccounts.filter(
      (a) => a.custodian === custodian && a.repId === repId,
    );

    const totalAssets = advisorAccounts.reduce((sum, a) => sum + (accountValues[a.id] || 0), 0);

    if (!custodianAdvisorAssets[custodian]) {
      custodianAdvisorAssets[custodian] = {};
    }
    custodianAdvisorAssets[custodian][advisorId] =
      (custodianAdvisorAssets[custodian][advisorId] || 0) + totalAssets;
  }

  console.log('\n🏦 Assets by Custodian:');
  for (const [custodian, advisorAssets] of Object.entries(custodianAdvisorAssets)) {
    console.log(`\n   ${custodian}:`);
    const sorted = Object.entries(advisorAssets)
      .map(([advisorId, assets]) => ({
        advisorId,
        name: allAdvisors.find((a) => a.id === advisorId)?.name || 'Unknown',
        assets,
      }))
      .sort((a, b) => b.assets - a.assets);

    sorted.forEach((a, i) => {
      console.log(
        `     ${i + 1}. ${a.name}: $${a.assets.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      );
    });
  }
}
