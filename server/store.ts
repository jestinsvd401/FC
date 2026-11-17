import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { buildSeed } from "./seed.ts";
import { emptyDb, type DB } from "./types.ts";

export class Store {
  db: DB;

  constructor(
    private file: string,
    seed: boolean,
  ) {
    if (existsSync(file)) {
      this.db = JSON.parse(readFileSync(file, "utf8")) as DB;
      return;
    }
    this.db = seed ? buildSeed() : emptyDb();
    this.save();
  }

  save(): void {
    mkdirSync(path.dirname(this.file), { recursive: true });
    writeFileSync(this.file, JSON.stringify(this.db));
  }

  update(fn: (db: DB) => void): void {
    const snapshot = structuredClone(this.db);
    try {
      fn(this.db);
      this.save();
    } catch (error) {
      this.db = snapshot;
      throw error;
    }
  }
}
