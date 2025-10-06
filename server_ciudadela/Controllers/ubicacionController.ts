import { Context } from "../Dependencies/deps.ts";
import { Ubicacion } from "../Models/ubicacionModel.ts";
import type { RouterContext } from "../Dependencies/deps.ts";



export const getUbicaciones = async (ctx: Context) => {
    const { response } = ctx;
    try {
        const objUbicacion = new Ubicacion();
        const lista = await objUbicacion.seleccionarUbicaciones();

        response.status = 200;
        response.body = { success: true, data: lista };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al procesar la solicitud", errors: error };
    }
};

export const getUbicacionById = async (ctx: RouterContext<"/ubicaciones/:id">) => {
    const { params, response } = ctx;
    try {
        const id = parseInt(params.id);
        const objUbicacion = new Ubicacion();
        const ubicacion = await objUbicacion.seleccionarUbicacionPorId(id);

        if (ubicacion.length > 0) {
        response.status = 200;
        response.body = { success: true, data: ubicacion[0] };
        } else {
        response.status = 404;
        response.body = { success: false, message: "Ubicación no encontrada" };
        }
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al obtener ubicación", errors: error };
    }
};

export const postUbicacion = async (ctx: Context) => {
    const { request, response } = ctx;
    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
        response.status = 400;
        response.body = { success: false, message: "Cuerpo de la solicitud está vacío" };
        return;
        }

        const body = await request.body.json();

        const ubicacionData = {
        IdUbicacion: null,
        IdUsuario: body.IdUsuario,
        Latitud: body.Latitud,
        Longitud: body.Longitud,
        };

        const objUbicacion = new Ubicacion(ubicacionData);
        const resultado = await objUbicacion.insertarUbicacion();

        response.status = 200;
        response.body = resultado;
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al procesar la solicitud: " + error };
    }
};

export const putUbicacion = async (ctx: RouterContext<"/ubicaciones/:id">) => {
    const { params, request, response } = ctx;
    try {
        const id = parseInt(params.id);
        const body = await request.body.json();

        const ubicacionData = {
        IdUbicacion: id,
        IdUsuario: body.IdUsuario,
        Latitud: body.Latitud,
        Longitud: body.Longitud,
        };

        const objUbicacion = new Ubicacion(ubicacionData, id);
        const resultado = await objUbicacion.actualizarUbicacion();

        response.status = resultado.success ? 200 : 400;
        response.body = resultado;
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al actualizar: " + error };
    }
};

export const deleteUbicacion = async (ctx: RouterContext<"/ubicaciones/:id">) => {
    const { params, response } = ctx;
    try {
        const id = parseInt(params.id);

        const objUbicacion = new Ubicacion(null, id);
        const resultado = await objUbicacion.eliminarUbicacion();

        response.status = resultado.success ? 200 : 400;
        response.body = resultado;
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al eliminar: " + error };
    }
};
