import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import { mkdirSync } from "fs";
import { dirname } from "path";
import type { DB } from "./schema";
import { migrate } from "./migrations";

import { DATABASE_PATH } from "../config";

const globalDb = globalThis as unknown as {
  __db?: Kysely<DB>;
  __dbMigrated?: Promise<void>;
};

export function getDb(): Kysely<DB> {
  if (!globalDb.__db) {
    mkdirSync(dirname(DATABASE_PATH), { recursive: true });
    const dialect = new SqliteDialect({
      database: new SQLite(DATABASE_PATH),
    });
    globalDb.__db = new Kysely<DB>({ dialect });
    globalDb.__dbMigrated = migrate(globalDb.__db);
  }
  return globalDb.__db;
}

export async function getDbReady(): Promise<Kysely<DB>> {
  const db = getDb();
  await globalDb.__dbMigrated;
  return db;
}
