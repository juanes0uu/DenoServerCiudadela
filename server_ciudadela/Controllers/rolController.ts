import { Context } from "../Dependencies/deps.ts";
import { Rol } from "../Models/rolModel.ts";
import type { RouterContext } from "../Dependencies/deps.ts";

export const getRoles = async (ctx: Context) => {
  const { response } = ctx;

  try {
    const objRol = new Rol();
    const listaRoles = await objRol.seleccionarRoles();

    response.status = 200;
    response.body = { success: true, data: listaRoles };
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al obtener los Roles", errors: error };
  }
};

export const getRolById = async (ctx: RouterContext<"/Roles/:id">) => {
  const { params, response } = ctx;

  try {
    const id = parseInt(params.id);
    const objRol: Rol = new rol();
    const Rol = await objRol.seleccionarRolPorId(id);

    if (Rol.length > 0) {
      response.status = 200;
      response.body = { success: true, data: Rol[0] };
    } else {
      response.status = 404;
      response.body = { success: false, message: "Rol no encontrado" };
    }
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al obtener el Rol", errors: error };
  }
};

export const postRol = async (ctx: Context) => {
  const { request, response } = ctx;

  try {
    // Verificar si el request tiene cuerpo
    if (!request.hasBody) {
      response.status = 400;
      response.body = { success: false, message: "Cuerpo de la solicitud vacío" };
      return;
    }

    // ✅ Leer el cuerpo como JSON (forma moderna en Oak 17)
    const body = await request.body?.json();

    const RolData = {
      IdRol: null,
      Rol: body.Rol,
    };

    const objRol = new Rol(RolData);
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
  
  export const putRol = async (ctx: RouterContext<"/Rol/:id">) => {
      const { params, request, response } = ctx;
      try {
          const id = parseInt(params.id);
          const body = await request.body.json();
  
          const RolData = {
          IdRol: id,
          Rol: body.Rol,
          };
  
          const objRol = new Rol(RolData, id);
          const resultado = await objRol.actualizarRol();
  
          response.status = resultado.success ? 200 : 400;
          response.body = resultado;
      } catch (error) {
          response.status = 400;
          response.body = { success: false, message: "Error al actualizar Rol: " + error };
      }
  };
  
  export const deleteRol = async (ctx: RouterContext<"/Rol/:id">) => {
      const { params, response } = ctx;
      try {
          const id = parseInt(params.id);
  
          const objRol = new Rol(null, id);
          const resultado = await objRol.eliminarRol();
  
          response.status = resultado.success ? 200 : 400;
      } catch (error) {
          response.status = 400;
          response.body = { success: false, message: "Error al eliminar Rol: " + error };
      }
};

