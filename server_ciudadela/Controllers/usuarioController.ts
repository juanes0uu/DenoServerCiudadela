import { Context } from "../Dependencies/deps.ts";
import { Usuario } from "../Models/usuarioModel.ts";
import type { RouterContext } from "../Dependencies/deps.ts";


// GET TODOS LOS USUARIOS

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


// GET USUARIO POR ID

export const getUsuarioById = async (ctx: RouterContext<"/usuarios/:id">) => {
  const { params, response } = ctx;

  try {
    const id = parseInt(params.id);
    const objUsuario = new Usuario();
    const usuario = await objUsuario.seleccionarUsuarioPorId(id);

    // Valida que usuario no sea null
    if (usuario) {
      response.status = 200;
      response.body = { success: true, data: usuario };
    } else {
      response.status = 404;
      response.body = { success: false, message: "Usuario no encontrado" };
    }
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al obtener usuario", errors: error };
  }
}


// POST CREAR USUARIO

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

   
    const rolId = Number(body.IdRol) || 1; // Extrae IdRol o usa 1 por defecto

    let rolNombre = "Usuario";
    if (rolId === 2) {
      rolNombre = "Administrador";
    }
  

    const usuarioData = {
      IdUsuario: null,
      Rol: rolNombre, //  Asigna la cadena de texto adecuada (VARCHAR)
      Nombre: body.Nombre,
      Email: body.Email,
      Documento: body.Documento,
      Password: body.Password,
      FechaRegistro: undefined
    };

    // Opcional: Para verificar en consola antes de insertar
    console.log("Datos que se enviarán al modelo:", usuarioData);

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


// PUT ACTUALIZAR USUARIO

export const putUsuario = async (ctx: RouterContext<"/usuarios/:id">) => {
  const { params, request, response } = ctx;
  try {
    const id = parseInt(params.id);

    // Valida que el ID sea válido
    if (isNaN(id)) {
      response.status = 400;
      response.body = { success: false, message: "ID inválido" };
      return;
    }

    const body = await request.body.json();

    // Valida que existan los campos requeridos
    if (!body.Nombre || !body.Email) {
      response.status = 400;
      response.body = { success: false, message: "Faltan campos requeridos" };
      return;
    }

    const usuarioData = {
      IdUsuario: id,
      Nombre: body.Nombre,
      Email: body.Email,
      Documento: body.Documento,
      Password: body.Password,
      FechaRegistro: undefined
    };

    const objUsuario = new Usuario(usuarioData, id);
    const resultado = await objUsuario.actualizarUsuario();

    // Verifica que resultado no sea null antes de usarlo
    if (resultado) {
      response.status = resultado.success ? 200 : 400;
      response.body = resultado;
    } else {
      response.status = 500;
      response.body = { success: false, message: "Error inesperado al actualizar" };
    }
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al actualizar: " + error };
  }
};

// DELETE ELIMINAR USUARIO

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