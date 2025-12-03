import { conexion } from "./conexion.ts";

interface RolData {
  IdRol: number | null;
  Rol: string;
  
}

export class Rol {
  public _objRol: RolData | null;
  public _idRol: number | null;

  constructor(objRol: RolData | null = null, idRol: number | null = null) {
    this._objRol = objRol;
    this._idRol = idRol;
  }

  public async seleccionarRoles(): Promise<RolData[]> {
    const { rows } = await conexion.execute(`SELECT * FROM rol`);
    return rows as RolData[];
  }

  public async seleccionarRolPorId(id: number): Promise<RolData[]> {
    const { rows } = await conexion.execute(`SELECT * FROM rol WHERE IdRol = ?`, [id]);
    return rows as RolData[];
  }

  public async insertarRol(): Promise<{ success: boolean; message: string; Rol?: Record<string, unknown> }> {
    try {
      if (!this._objRol) {
        throw new Error("No se ha proporcionado un objeto de Rol válido.");
      }

      const { IdRol, Rol } = this._objRol;

      await conexion.execute("START TRANSACTION");

      const result = await conexion.execute(
        `INSERT INTO Rol (IdRol, Rol) VALUES (?, ?)`,
        [IdRol, Rol]
      );

      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        const [Rol] = await conexion.query(`SELECT * FROM Rol WHERE IdRol = LAST_INSERT_ID()`);
        await conexion.execute("COMMIT");
        return { success: true, message: "Rol registrado correctamente", Rol: Rol };
      } else {
        throw new Error("No fue posible registrar el Rol.");
      }

    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: "Error interno en el servidor: " + String(error) };
    }
  }

  // Actualizar Rol
    public async actualizarRol(): Promise<{ success: boolean; message: string }> {
        try {
        if (!this._objRol || this._idRol === null) {
            throw new Error("Datos incompletos para actualizar la Rol.");
        }

        const { Rol } = this._objRol;

        await conexion.execute("START TRANSACTION");

        const result = await conexion.execute(
            `UPDATE Rol SET Rol = ? WHERE IdRol = ?`,
            [Rol, this._idRol]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            await conexion.execute("COMMIT");
            return { success: true, message: "Rol actualizada correctamente" };
        } else {
            throw new Error("No se encontró la Rol o no se realizaron cambios.");
        }
        } catch (error) {
        await conexion.execute("ROLLBACK");
        return { success: false, message: "Error al actualizar Rol: " + String(error) };
        }
    }

    // Eliminar Rol
    public async eliminarRol(): Promise<{ success: boolean; message: string }> {
        try {
        if (this._idRol === null) {
            throw new Error("ID de Rol no proporcionado.");
        }

        await conexion.execute("START TRANSACTION");

        const result = await conexion.execute(`DELETE FROM Rol WHERE IdRol = ?`, [this._idRol]);

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            await conexion.execute("COMMIT");
            return { success: true, message: "Rol eliminada correctamente" };
        } else {
            throw new Error("No se encontró la Rol para eliminar.");
        }
        } catch (error) {
        await conexion.execute("ROLLBACK");
        return { success: false, message: "Error al eliminar Rol: " + String(error) };
        }
    }
  
}