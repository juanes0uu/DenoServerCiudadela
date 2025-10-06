import { conexion } from "./conexion.ts";

interface RutaDetalleData {
    IdRutaDetalle: number | null;
    IdRuta: number;
    Latitud: number;
    Longitud: number;
    Orden: number;
}

export class RutaDetalle {
    public _objRutaDetalle: RutaDetalleData | null;
    public _idRutaDetalle: number | null;

    constructor(objRutaDetalle: RutaDetalleData | null = null, idRutaDetalle: number | null = null) {
        this._objRutaDetalle = objRutaDetalle;
        this._idRutaDetalle = idRutaDetalle;
    }

    public async seleccionarRutaDetalles(): Promise<RutaDetalleData[]> {
        const { rows } = await conexion.execute(`SELECT * FROM RutaDetalle`);
        return rows as RutaDetalleData[];
    }

    public async seleccionarRutaDetallePorId(id: number): Promise<RutaDetalleData[]> {
        const { rows } = await conexion.execute(`SELECT * FROM RutaDetalle WHERE IdRutaDetalle = ?`, [id]);
        return rows as RutaDetalleData[];
    }

    public async insertarRutaDetalle(): Promise<{ success: boolean; message: string; data?: Record<string, unknown> }> {
        try {
        if (!this._objRutaDetalle) throw new Error("No se ha proporcionado un objeto válido.");

        const { IdRuta, Latitud, Longitud, Orden } = this._objRutaDetalle;
        if (!IdRuta || !Latitud || !Longitud || !Orden) throw new Error("Faltan campos requeridos.");

        await conexion.execute("START TRANSACTION");

        const result = await conexion.execute(
            `INSERT INTO RutaDetalle (IdRuta, Latitud, Longitud, Orden) VALUES (?, ?, ?, ?)`,
            [IdRuta, Latitud, Longitud, Orden]
        );

        if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
            const [nuevo] = await conexion.query(`SELECT * FROM RutaDetalle WHERE IdRutaDetalle = LAST_INSERT_ID()`);
            await conexion.execute("COMMIT");
            return { success: true, message: "RutaDetalle registrado correctamente", data: nuevo };
        } else {
            throw new Error("No se pudo insertar el registro.");
        }
        } catch (error) {
        await conexion.execute("ROLLBACK");
        return { success: false, message: "Error al insertar RutaDetalle: " + String(error) };
        }
    }

    public async actualizarRutaDetalle(): Promise<{ success: boolean; message: string }> {
        try {
        if (!this._objRutaDetalle || this._idRutaDetalle === null)
            throw new Error("Datos incompletos para actualizar.");

        const { IdRuta, Latitud, Longitud, Orden } = this._objRutaDetalle;

        await conexion.execute("START TRANSACTION");
        const result = await conexion.execute(
            `UPDATE RutaDetalle SET IdRuta = ?, Latitud = ?, Longitud = ?, Orden = ? WHERE IdRutaDetalle = ?`,
            [IdRuta, Latitud, Longitud, Orden, this._idRutaDetalle]
        );

        if (result && result.affectedRows && result.affectedRows > 0) {
            await conexion.execute("COMMIT");
            return { success: true, message: "RutaDetalle actualizado correctamente" };
        } else {
            throw new Error("No se encontró el registro para actualizar.");
        }
        } catch (error) {
        await conexion.execute("ROLLBACK");
        return { success: false, message: "Error al actualizar: " + String(error) };
        }
    }

    public async eliminarRutaDetalle(): Promise<{ success: boolean; message: string }> {
        try {
        if (this._idRutaDetalle === null) throw new Error("ID no proporcionado.");

        await conexion.execute("START TRANSACTION");

        const result = await conexion.execute(
            `DELETE FROM RutaDetalle WHERE IdRutaDetalle = ?`,
            [this._idRutaDetalle]
        );

        if (result && result.affectedRows && result.affectedRows > 0) {
            await conexion.execute("COMMIT");
            return { success: true, message: "RutaDetalle eliminado correctamente" };
        } else {
            throw new Error("No se encontró el registro para eliminar.");
        }
        } catch (error) {
        await conexion.execute("ROLLBACK");
        return { success: false, message: "Error al eliminar: " + String(error) };
        }
    }
}
