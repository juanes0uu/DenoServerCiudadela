import { Client } from "../Dependencies/deps.ts";

export const conexion = await new Client().connect({
  hostname: "localhost",
  username: "root",
  db: "geolocalizacion",
  password: "",
  port: 3306,
});

// Devuelve un array de objetos [{columna: valor, ...}]
export async function executeQuery(sql: string, params: any[] = []) {
  return await conexion.execute(sql, params);
}