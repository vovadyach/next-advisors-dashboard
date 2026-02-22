import {index, integer, numeric, pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";


export const advisors = pgTable("advisors", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
});


export const advisorCustodians = pgTable("advisor_custodians", {
    id: serial("id").primaryKey(),
    advisorId: varchar("advisor_id", { length: 50 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    repId: varchar("rep_id", { length: 50 }).notNull(),
  },
  (table) => ({
    advisorIdx: index().on(table.advisorId),
    custodianRepIdx: index().on(table.name, table.repId),
  }));

export const accounts = pgTable("accounts", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    number: varchar("number", { length: 50 }).notNull().unique(),
    repId: varchar("rep_id", { length: 50 }).notNull(),
    custodian: varchar("custodian", { length: 100 }).notNull(),
  },
  (table) => ({
    custodianRepIdx: index().on(table.custodian, table.repId),
  }));

export const holdings = pgTable("holdings", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull(),
  ticker: varchar("ticker", { length: 20 }).notNull(),
  units: numeric("units").notNull(),
  unitPrice: numeric("unit_price").notNull(),
}, (table) => ({
  accountIdx: index().on(table.accountId),
  tickerIdx: index().on(table.ticker),
}));

export const securities = pgTable("securities", {
  id: varchar("id", { length: 100 }).primaryKey(),
  ticker: varchar("ticker", { length: 20 }).notNull().unique(),
  name: text("name").notNull(),
  dateAdded: timestamp("date_added").notNull(),
});


// ============ RELATIONS ============
export const advisorRelations = relations(advisors, ({ many }) => ({
  custodians: many(advisorCustodians),
}));

export const advisorCustodianRelations = relations(advisorCustodians, ({ one }) => ({
  advisor: one(advisors, {
    fields: [advisorCustodians.advisorId],
    references: [advisors.id],
  }),
}));

export const accountRelations = relations(accounts, ({ many }) => ({
  holdings: many(holdings),
}));

export const holdingRelations = relations(holdings, ({ one }) => ({
  account: one(accounts, {
    fields: [holdings.accountId],
    references: [accounts.id],
  }),
}));
