import { conexion } from "./conexion.ts";

interface LugarData {
  IdLugar: number | null;
  IdUsuario: number;
  Nombre: string;
  Descripcion: string;
  Latitud: number;
  Longitud: number;
  FechaCreacion?: string;
}

export class Lugar {
  public _objLugar: LugarData | null;
  public _idLugar: number | null;

  constructor(objLugar: LugarData | null = null, idLugar: number | null = null) {
    this._objLugar = objLugar;
    this._idLugar = idLugar;
  }

  public async seleccionarLugares(): Promise<LugarData[]> {
    const { rows } = await conexion.execute(`SELECT * FROM Lugar`);
    return rows as LugarData[];
  }

  public async seleccionarLugarPorId(id: number): Promise<LugarData[]> {
    const { rows } = await conexion.execute(`SELECT * FROM Lugar WHERE IdLugar = ?`, [id]);
    return rows as LugarData[];
  }

  public async insertarLugar(): Promise<{ success: boolean; message: string; lugar?: Record<string, unknown> }> {
    try {
      if (!this._objLugar) {
        throw new Error("No se ha proporcionado un objeto de lugar válido.");
      }

      const { IdUsuario, Nombre, Descripcion, Latitud, Longitud } = this._objLugar;

      await conexion.execute("START TRANSACTION");

      const result = await conexion.execute(
        `INSERT INTO Lugar (IdUsuario, Nombre, Descripcion, Latitud, Longitud) VALUES (?, ?, ?, ?, ?)`,
        [IdUsuario, Nombre, Descripcion, Latitud, Longitud]
      );

      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        const [lugar] = await conexion.query(`SELECT * FROM Lugar WHERE IdLugar = LAST_INSERT_ID()`);
        await conexion.execute("COMMIT");
        return { success: true, message: "Lugar registrado correctamente", lugar: lugar };
      } else {
        throw new Error("No fue posible registrar el lugar.");
      }

    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: "Error interno en el servidor: " + String(error) };
    }
  }
}