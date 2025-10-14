import { Context } from "../Dependencies/deps.ts";
import type { RouterContext } from "../Dependencies/deps.ts";
import { RutaDetalle } from "../Models/rutaDetalleModel.ts";

export const getRutaDetalles = async (ctx: Context) => {
    const { response } = ctx;
    try {
        const obj = new RutaDetalle();
        const data = await obj.seleccionarRutaDetalles();
        response.status = 200;
        response.body = { success: true, data };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al obtener los registros", error };
    }
};

// ✅ Nueva versión: obtiene todos los puntos de una ruta específica
export const getRutaDetalleById = async (ctx: RouterContext<"/ruta-detalle/:id">) => {
  const { params, response } = ctx;
  try {
    const idRuta = parseInt(params.id);
    const obj = new RutaDetalle();
    const data = await obj.seleccionarRutaDetallePorRuta(idRuta); // <-- nueva función
    response.status = 200;
    response.body = { success: true, data };
  } catch (error) {
    response.status = 400;
    response.body = { success: false, message: "Error al obtener detalles de la ruta", error };
  }
};


export const postRutaDetalle = async (ctx: Context) => {
    const { request, response } = ctx;
    try {
        const body = await request.body.json();

        const objData = {
        IdRutaDetalle: null,
        IdRuta: body.IdRuta,
        Latitud: body.Latitud,
        Longitud: body.Longitud,
        Orden: body.Orden,
        };

        const obj = new RutaDetalle(objData);
        const resultado = await obj.insertarRutaDetalle();

        response.status = resultado.success ? 200 : 400;
        response.body = resultado;
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al procesar solicitud", error };
    }
};

export const putRutaDetalle = async (ctx: RouterContext<"/ruta-detalle/:id">) => {
    const { params, request, response } = ctx;
    try {
        const id = parseInt(params.id);
        const body = await request.body.json();

        const objData = {
        IdRutaDetalle: id,
        IdRuta: body.IdRuta,
        Latitud: body.Latitud,
        Longitud: body.Longitud,
        Orden: body.Orden,
        };

        const obj = new RutaDetalle(objData, id);
        const resultado = await obj.actualizarRutaDetalle();

        response.status = resultado.success ? 200 : 400;
        response.body = resultado;
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al actualizar", error };
    }
};

export const deleteRutaDetalle = async (ctx: RouterContext<"/ruta-detalle/:id">) => {
    const { params, response } = ctx;
    try {
        const id = parseInt(params.id);
        const obj = new RutaDetalle(null, id);
        const resultado = await obj.eliminarRutaDetalle();

        response.status = resultado.success ? 200 : 400;
        response.body = resultado;
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al eliminar", error };
    }
};
