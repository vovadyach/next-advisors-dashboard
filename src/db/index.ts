import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";

const setup = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  // for query purposes
  const queryClient = postgres(databaseUrl);
  return drizzle(queryClient);
};

export default setup();
