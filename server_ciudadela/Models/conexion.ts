import { Client } from "../Dependencies/deps.ts";

export const conexion = await new Client().connect({
  hostname: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_USER")!,
  password: Deno.env.get("DB_PASSWORD")!,
  db: Deno.env.get("DB_NAME")!,
  port: Number(Deno.env.get("DB_PORT")!),
});

// Devuelve un array de objetos [{columna: valor, ...}]
export async function executeQuery(sql: string, params: any[] = []) {
  return await conexion.execute(sql, params);
}
