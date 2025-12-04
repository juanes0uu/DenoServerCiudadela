import { Context } from "../Dependencies/deps.ts";
import type { RouterContext } from "../Dependencies/deps.ts";
import { Rol } from "../Models/rolModel.ts";

// ===============================
//  GET TODOS LOS ROLES
// ===============================
export const getRoles = async (ctx: Context) => {
  const { response } = ctx;

  try {
    const objRol = new Rol();
    const listaRoles = await objRol.seleccionarRoles();

    response.status = 200;
    response.body = { success: true, data: listaRoles };
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      message: "Error al obtener los Roles",
      errors: error,
    };
  }
};

// ===============================
//  GET ROL POR ID
// ===============================
export const getRolById = async (ctx: RouterContext<"/rol/:id">) => {
  const { params, response } = ctx;

  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      response.status = 400;
      response.body = { success: false, message: "ID inválido" };
      return;
    }

    const objRol = new Rol();
    const rol = await objRol.seleccionarRolPorId(id);

    if (rol.length > 0) {
      response.status = 200;
      response.body = { success: true, data: rol[0] };
    } else {
      response.status = 404;
      response.body = { success: false, message: "Rol no encontrado" };
    }
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      message: "Error al obtener el Rol",
      errors: error,
    };
  }
};

// ===============================
//  POST CREAR ROL
// ===============================
export const postRol = async (ctx: Context) => {
  const { request, response } = ctx;

  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Cuerpo de la solicitud vacío",
      };
      return;
    }

    const body = await request.body?.json();

    if (!body?.Rol) {
      response.status = 400;
      response.body = {
        success: false,
        message: "El campo 'Rol' es obligatorio",
      };
      return;
    }

    const rolData = {
      IdRol: null,
      Rol: body.Rol,
    };

    const objRol = new Rol(rolData);
    const resultado = await objRol.insertarRol();

    response.status = resultado.success ? 200 : 400;
    response.body = resultado;
  } catch (error) {
    console.error("❌ Error en postRol:", error);
    response.status = 500;
    response.body = {
      success: false,
      message: "Error interno al registrar el Rol",
      error: String(error),
    };
  }
};

// ===============================
//  PUT ACTUALIZAR ROL
// ===============================
export const putRol = async (ctx: RouterContext<"/rol/:id">) => {
  const { params, request, response } = ctx;

  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      response.status = 400;
      response.body = { success: false, message: "ID inválido" };
      return;
    }

    const body = await request.body.json();

    const rolData = {
      IdRol: id,
      Rol: body.Rol,
    };

    const objRol = new Rol(rolData, id);
    const resultado = await objRol.actualizarRol();

    response.status = resultado.success ? 200 : 400;
    response.body = resultado;
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      message: "Error al actualizar Rol: " + error,
    };
  }
};

// ===============================
//  DELETE ELIMINAR ROL
// ===============================
export const deleteRol = async (ctx: RouterContext<"/rol/:id">) => {
  const { params, response } = ctx;

  try {
    const id = Number(params.id);

    if (isNaN(id)) {
      response.status = 400;
      response.body = { success: false, message: "ID inválido" };
      return;
    }

    const objRol = new Rol(null, id);
    const resultado = await objRol.eliminarRol();

    response.status = resultado.success ? 200 : 400;
    response.body = resultado;
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      message: "Error al eliminar Rol: " + error,
    };
  }
};
