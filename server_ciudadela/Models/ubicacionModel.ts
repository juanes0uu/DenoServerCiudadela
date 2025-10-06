import { conexion } from "./conexion.ts";

interface UbicacionData {
    IdUbicacion: number | null;
    IdUsuario: number;
    Latitud: number;
    Longitud: number;
    FechaHora?: string;
}

export class Ubicacion {
    public _objUbicacion: UbicacionData | null;
    public _idUbicacion: number | null;

    constructor(objUbicacion: UbicacionData | null = null, idUbicacion: number | null = null) {
        this._objUbicacion = objUbicacion;
        this._idUbicacion = idUbicacion;
    }

    public async seleccionarUbicaciones(): Promise<UbicacionData[]> {
        const { rows } = await conexion.execute(`SELECT * FROM Ubicacion`);
        return rows as UbicacionData[];
    }

    public async seleccionarUbicacionPorId(id: number): Promise<UbicacionData[]> {
        const { rows } = await conexion.execute(`SELECT * FROM Ubicacion WHERE IdUbicacion = ?`, [id]);
        return rows as UbicacionData[];
    }

    public async insertarUbicacion(): Promise<{ success: boolean; message: string; ubicacion?: Record<string, unknown> }> {
        try {
        if (!this._objUbicacion) {
            throw new Error("No se ha proporcionado un objeto de ubicación válido.");
        }

        const { IdUsuario, Latitud, Longitud } = this._objUbicacion;

        if (!IdUsuario || Latitud === undefined || Longitud === undefined) {
            throw new Error("Faltan campos requeridos para insertar la ubicación.");
        }

        await conexion.execute("START TRANSACTION");

        const result = await conexion.execute(
            `INSERT INTO Ubicacion (IdUsuario, Latitud, Longitud) VALUES (?, ?, ?)`,
            [IdUsuario, Latitud, Longitud]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            const [ubicacion] = await conexion.query(`SELECT * FROM Ubicacion WHERE IdUbicacion = LAST_INSERT_ID()`);
            await conexion.execute("COMMIT");
            return { success: true, message: "Ubicación registrada correctamente", ubicacion: ubicacion };
        } else {
            throw new Error("No fue posible registrar la ubicación.");
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

    public async actualizarUbicacion(): Promise<{ success: boolean; message: string }> {
        try {
        if (!this._objUbicacion || this._idUbicacion === null) {
            throw new Error("Datos incompletos para actualizar la ubicación.");
        }

        const { IdUsuario, Latitud, Longitud } = this._objUbicacion;

        await conexion.execute("START TRANSACTION");

        const result = await conexion.execute(
            `UPDATE Ubicacion SET IdUsuario = ?, Latitud = ?, Longitud = ? WHERE IdUbicacion = ?`,
            [IdUsuario, Latitud, Longitud, this._idUbicacion]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            await conexion.execute("COMMIT");
            return { success: true, message: "Ubicación actualizada correctamente" };
        } else {
            throw new Error("No se encontró la ubicación o no se realizaron cambios.");
        }
        } catch (error) {
        await conexion.execute("ROLLBACK");
        return { success: false, message: "Error al actualizar ubicación: " + String(error) };
        }
    }

    public async eliminarUbicacion(): Promise<{ success: boolean; message: string }> {
        try {
        if (this._idUbicacion === null) {
            throw new Error("ID de ubicación no proporcionado.");
        }

        await conexion.execute("START TRANSACTION");

        const result = await conexion.execute(
            `DELETE FROM Ubicacion WHERE IdUbicacion = ?`,
            [this._idUbicacion]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            await conexion.execute("COMMIT");
            return { success: true, message: "Ubicación eliminada correctamente" };
        } else {
            throw new Error("No se encontró la ubicación para eliminar.");
        }
        } catch (error) {
        await conexion.execute("ROLLBACK");
        return { success: false, message: "Error al eliminar ubicación: " + String(error) };
        }
    }
}
