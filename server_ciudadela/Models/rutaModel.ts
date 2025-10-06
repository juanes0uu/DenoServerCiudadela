import { conexion } from "./conexion.ts";

interface RutaData {
    IdRuta: number | null;
    IdUsuario: number;
    Nombre: string;
    FechaCreacion?: string;
}

export class Ruta {
    public _objRuta: RutaData | null;
    public _idRuta: number | null;

    constructor(objRuta: RutaData | null = null, idRuta: number | null = null) {
        this._objRuta = objRuta;
        this._idRuta = idRuta;
    }

    // Obtener todas las rutas
    public async seleccionarRutas(): Promise<RutaData[]> {
        const { rows } = await conexion.execute(`SELECT * FROM Ruta`);
        return rows as RutaData[];
    }

    // Obtener una ruta por ID
    public async seleccionarRutaPorId(id: number): Promise<RutaData[]> {
        const { rows } = await conexion.execute(`SELECT * FROM Ruta WHERE IdRuta = ?`, [id]);
        return rows as RutaData[];
    }

    // Insertar una nueva ruta
    public async insertarRuta(): Promise<{ success: boolean; message: string; ruta?: Record<string, unknown> }> {
        try {
        if (!this._objRuta) {
            throw new Error("No se ha proporcionado un objeto de ruta válido.");
        }

        const { IdUsuario, Nombre } = this._objRuta;

        if (!IdUsuario || !Nombre) {
            throw new Error("Faltan campos requeridos para insertar la ruta.");
        }

        await conexion.execute("START TRANSACTION");

        const result = await conexion.execute(
            `INSERT INTO Ruta (IdUsuario, Nombre) VALUES (?, ?)`,
            [IdUsuario, Nombre]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            const [ruta] = await conexion.query(`SELECT * FROM Ruta WHERE IdRuta = LAST_INSERT_ID()`);
            await conexion.execute("COMMIT");
            return { success: true, message: "Ruta registrada correctamente", ruta: ruta };
        } else {
            throw new Error("No fue posible registrar la ruta.");
        }

        } catch (error) {
        await conexion.execute("ROLLBACK");
        if (error instanceof Error) {
            return { success: false, message: error.message };
        } else {
            return { success: false, message: "Error interno en el servidor" };
        }
        }
    }

    // Actualizar ruta
    public async actualizarRuta(): Promise<{ success: boolean; message: string }> {
        try {
        if (!this._objRuta || this._idRuta === null) {
            throw new Error("Datos incompletos para actualizar la ruta.");
        }

        const { Nombre } = this._objRuta;

        await conexion.execute("START TRANSACTION");

        const result = await conexion.execute(
            `UPDATE Ruta SET Nombre = ? WHERE IdRuta = ?`,
            [Nombre, this._idRuta]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            await conexion.execute("COMMIT");
            return { success: true, message: "Ruta actualizada correctamente" };
        } else {
            throw new Error("No se encontró la ruta o no se realizaron cambios.");
        }
        } catch (error) {
        await conexion.execute("ROLLBACK");
        return { success: false, message: "Error al actualizar ruta: " + String(error) };
        }
    }

    // Eliminar ruta
    public async eliminarRuta(): Promise<{ success: boolean; message: string }> {
        try {
        if (this._idRuta === null) {
            throw new Error("ID de ruta no proporcionado.");
        }

        await conexion.execute("START TRANSACTION");

        const result = await conexion.execute(`DELETE FROM Ruta WHERE IdRuta = ?`, [this._idRuta]);

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            await conexion.execute("COMMIT");
            return { success: true, message: "Ruta eliminada correctamente" };
        } else {
            throw new Error("No se encontró la ruta para eliminar.");
        }
        } catch (error) {
        await conexion.execute("ROLLBACK");
        return { success: false, message: "Error al eliminar ruta: " + String(error) };
        }
    }
}
