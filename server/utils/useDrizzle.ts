import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import * as schema from "../db/schema";

const client = createClient({ url: "file:.data/db.sqlite" });
const db = drizzle({ client, schema });

export default function () {
  return db;
}
