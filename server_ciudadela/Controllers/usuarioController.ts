import { Context } from "../Dependencies/deps.ts";
import { Usuario } from "../Models/usuarioModel.ts";
import type { RouterContext } from "../Dependencies/deps.ts";

export const getUsuarios = async (ctx: Context) => {
  const { response } = ctx;

  try {
    const objUsuario = new Usuario();
    const listaUsuarios = await objUsuario.seleccionarUsuarios();

    response.status = 200;
    response.body = { success: true, data: listaUsuarios };
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al procesar la solicitud", errors: error };
  }
};

export const getUsuarioById = async (ctx: RouterContext<"/usuarios/:id">) => {
  const { params, response } = ctx;

  try {
    const id = parseInt(params.id);
    const objUsuario = new Usuario();
    const usuario = await objUsuario.seleccionarUsuarioPorId(id);

    if (usuario.length > 0) {
      response.status = 200;
      response.body = { success: true, data: usuario[0] };
    } else {
      response.status = 404;
      response.body = { success: false, message: "Usuario no encontrado" };
    }
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al obtener usuario", errors: error };
  }
};

export const postUsuario = async (ctx: Context) => {
  const { request, response } = ctx;

  try {
    const contentLength = request.headers.get("Content-Length");
    if (contentLength === "0") {
      response.status = 400;
      response.body = { success: false, message: "Cuerpo de la solicitud está vacío" };
      return;
    }

    const body = await request.body.json();

    const usuarioData = {
      IdUsuario: null,
      Nombre: body.Nombre,
      Email: body.Email,
      Documento: body.Documento,
    };

    const objUsuario = new Usuario(usuarioData);
    const resultado = await objUsuario.insertarUsuario();

    response.status = 200;
    response.body = resultado;
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      message: "Error al procesar la solicitud: " + error,
    };
  }
};

export const putUsuario = async (ctx: RouterContext<"/usuarios/:id">) => {
  const { params, request, response } = ctx;
  try {
    const id = parseInt(params.id);
    const body = await request.body.json();

    const usuarioData = {
      IdUsuario: id,
      Nombre: body.Nombre,
      Email: body.Email,
      Documento: body.Documento,
    };

    const objUsuario = new Usuario(usuarioData, id);
    const resultado = await objUsuario.actualizarUsuario();

    response.status = resultado.success ? 200 : 400;
    response.body = resultado;
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al actualizar: " + error };
  }
};

export const deleteUsuario = async (ctx: RouterContext<"/usuarios/:id">) => {
  const { params, response } = ctx;
  try {
    const id = parseInt(params.id);

    const objUsuario = new Usuario(null, id);
    const resultado = await objUsuario.eliminarUsuario();

    response.status = resultado.success ? 200 : 400;
    response.body = resultado;
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al eliminar: " + error };
  }
};