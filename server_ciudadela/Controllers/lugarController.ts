import { Context } from "../Dependencies/deps.ts";
import { Lugar } from "../Models/lugarModel.ts";
import type { RouterContext } from "../Dependencies/deps.ts";

export const getLugares = async (ctx: Context) => {
  const { response } = ctx;

  try {
    const objLugar = new Lugar();
    const listaLugares = await objLugar.seleccionarLugares();

    response.status = 200;
    response.body = { success: true, data: listaLugares };
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al obtener los lugares", errors: error };
  }
};

export const getLugarById = async (ctx: RouterContext<"/lugares/:id">) => {
  const { params, response } = ctx;

  try {
    const id = parseInt(params.id);
    const objLugar = new Lugar();
    const lugar = await objLugar.seleccionarLugarPorId(id);

    if (lugar.length > 0) {
      response.status = 200;
      response.body = { success: true, data: lugar[0] };
    } else {
      response.status = 404;
      response.body = { success: false, message: "Lugar no encontrado" };
    }
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al obtener el lugar", errors: error };
  }
};

export const postLugar = async (ctx: Context) => {
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

    const lugarData = {
      IdLugar: null,
      IdUsuario: body.IdUsuario,
      Nombre: body.Nombre,
      Descripcion: body.Descripcion,
      Latitud: parseFloat(body.Latitud),
      Longitud: parseFloat(body.Longitud),
    };

    const objLugar = new Lugar(lugarData);
    const resultado = await objLugar.insertarLugar();

    response.status = resultado.success ? 200 : 400;
    response.body = resultado;
  } catch (error) {
    console.error("❌ Error en postLugar:", error);
    response.status = 500;
    response.body = {
      success: false,
      message: "Error interno al registrar el lugar",
      error: String(error),
    };
  }
};
