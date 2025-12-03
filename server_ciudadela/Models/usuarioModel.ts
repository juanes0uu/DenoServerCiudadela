// models/usuarioModel.ts
import { conexion } from "./conexion.ts";
import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

type ExecuteResult = {
  affectedRows?: number;
  insertId?: number;
};

export interface UsuarioData {
  IdUsuario: number | null;
  IdRol?: number;
  Nombre: string;
  Email: string;
  Documento: string;
  Password: string;
  FechaRegistro?: string;
}

// ------------------ CLASE ------------------
export class Usuario {
  public _objUsuario: UsuarioData | null;
  public _idUsuario: number | null;

  constructor(objUsuario: UsuarioData | null = null, idUsuario: number | null = null) {
    this._objUsuario = objUsuario;
    this._idUsuario = idUsuario;
  }

  // 📌 Obtener todos los usuarios
  public async seleccionarUsuarios(): Promise<UsuarioData[]> {
    const { rows } = await conexion.execute(`SELECT * FROM Usuario`);
    return rows as UsuarioData[];
  }

  // 📌 Obtener por ID
  public async seleccionarUsuarioPorId(id: number): Promise<UsuarioData | null> {
    const { rows } = await conexion.execute(
      `SELECT * FROM Usuario WHERE IdUsuario = ?`,
      [id]
    );
    return rows?.length ? (rows[0] as UsuarioData) : null;
  }

  // 📌 Buscar por email (IMPORTANTE PARA LOGIN)
  public async findUserByEmail(email: string): Promise<UsuarioData | null> {
    const { rows } = await conexion.execute(
      `SELECT * FROM Usuario WHERE Email = ?`,
      [email]
    );

    return rows?.length ? (rows[0] as UsuarioData) : null;
  }

  // 📌 Validar login
  public async validateLogin(email: string, password: string): Promise<UsuarioData | null> {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    const valid = await compare(password, user.Password);
    return valid ? user : null;
  }

  // 📌 Insertar usuario
  public async insertarUsuario(): Promise<{ success: boolean; message: string; usuario?: unknown }> {
    try {
      if (!this._objUsuario) throw new Error("No se ha proporcionado un objeto de usuario válido.");

      const { IdRol, Nombre, Email, Documento, Password } = this._objUsuario;

      if (!IdRol || !Nombre || !Email || !Documento || !Password) {
        throw new Error("Faltan campos requeridos para insertar el usuario.");
      }

      await conexion.execute("START TRANSACTION");

      const result = await conexion.execute(
        `INSERT INTO Usuario (IdRol, Nombre, Email, Documento, Password) VALUES (?, ?, ?, ?, ?)`,
        [IdRol, Nombre, Email, Documento, Password]
      );

      if (result && result.affectedRows !== undefined && result.affectedRows > 0) {
        const [usuario] = await conexion.query(`SELECT * FROM Usuario WHERE IdUsuario = LAST_INSERT_ID()`);
        await conexion.execute("COMMIT");

        return { success: true, message: "Usuario registrado correctamente", usuario };
      } else {
        throw new Error("No fue posible registrar el usuario.");
      }

    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: error instanceof Error ? error.message : "Error interno en el servidor" };
    }
  }

  // 📌 Actualizar usuario
  public async actualizarUsuario(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this._objUsuario || this._idUsuario === null) {
        throw new Error("Datos incompletos para actualizar el usuario.");
      }

      const { Nombre, Email, Documento } = this._objUsuario;

      await conexion.execute("START TRANSACTION");

      const result = await conexion.execute(
        `UPDATE Usuario SET Nombre = ?, Email = ?, Documento = ? WHERE IdUsuario = ?`,
        [Nombre, Email, Documento, this._idUsuario]
      );

      if (result && result.affectedRows !== undefined && result.affectedRows > 0) {
        await conexion.execute("COMMIT");
        return { success: true, message: "Usuario actualizado correctamente" };
      } else {
        throw new Error("No se encontró el usuario o no se realizaron cambios.");
      }

    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: "Error al actualizar usuario: " + String(error) };
    }
  }

  // 📌 Eliminar usuario
  public async eliminarUsuario(): Promise<{ success: boolean; message: string }> {
    try {
      if (this._idUsuario === null) throw new Error("ID de usuario no proporcionado.");

      await conexion.execute("START TRANSACTION");

      const result = await conexion.execute(
        `DELETE FROM Usuario WHERE IdUsuario = ?`,
        [this._idUsuario]
      );

      if (result && result.affectedRows !== undefined && result.affectedRows > 0) {
        await conexion.execute("COMMIT");
        return { success: true, message: "Usuario eliminado correctamente" };
      } else {
        throw new Error("No se encontró el usuario para eliminar.");
      }

    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: "Error al eliminar usuario: " + String(error) };
    }
  }
}
