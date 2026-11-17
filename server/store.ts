import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type postgres from "postgres";
import { buildSeed } from "./seed.js";
import { openDatabase, readDb, writeDb } from "./remote.js";
import { emptyDb, type DB } from "./types.js";

const LOCK_KEY = 84211017;

export class Store {
  db: DB;
  readonly remote: boolean;
  private sql: postgres.Sql | null = null;
  private chain: Promise<void> = Promise.resolve();

  constructor(
    private file: string,
    private seed: boolean,
    remoteUrl = "",
  ) {
    this.remote = Boolean(remoteUrl);
    if (remoteUrl) {
      this.db = emptyDb();
      this.sql = openDatabase(remoteUrl);
      return;
    }
    if (existsSync(file)) {
      this.db = JSON.parse(readFileSync(file, "utf8")) as DB;
      return;
    }
    this.db = seed ? buildSeed() : emptyDb();
    this.saveFile();
  }

  async refresh(): Promise<void> {
    if (!this.sql) return;
    await this.enqueue(async () => {
      const sql = this.sql;
      if (!sql) return;
      await sql.begin(async (tx) => {
        await tx`select pg_advisory_xact_lock(${LOCK_KEY})`;
        const loaded = await readDb(tx);
        if (loaded.users.length === 0 && this.seed) {
          this.db = buildSeed();
          await writeDb(tx, this.db);
          return;
        }
        this.db = loaded;
      });
    });
  }

  async update(fn: (db: DB) => void): Promise<void> {
    if (!this.sql) {
      const snapshot = structuredClone(this.db);
      try {
        fn(this.db);
        this.saveFile();
      } catch (error) {
        this.db = snapshot;
        throw error;
      }
      return;
    }
    await this.enqueue(async () => {
      const sql = this.sql;
      if (!sql) return;
      await sql.begin(async (tx) => {
        await tx`select pg_advisory_xact_lock(${LOCK_KEY})`;
        this.db = await readDb(tx);
        const snapshot = structuredClone(this.db);
        try {
          fn(this.db);
          await writeDb(tx, this.db);
        } catch (error) {
          this.db = snapshot;
          throw error;
        }
      });
    });
  }

  private enqueue(task: () => Promise<void>): Promise<void> {
    const run = this.chain.then(task, task);
    this.chain = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  private saveFile(): void {
    mkdirSync(path.dirname(this.file), { recursive: true });
    writeFileSync(this.file, JSON.stringify(this.db));
  }
}
