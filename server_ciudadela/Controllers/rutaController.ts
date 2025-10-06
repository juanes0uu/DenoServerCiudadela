import { Context } from "../Dependencies/deps.ts";
import { Ruta } from "../Models/rutaModel.ts";
import type { RouterContext } from "../Dependencies/deps.ts";

export const getRutas = async (ctx: Context) => {
    const { response } = ctx;
    try {
        const objRuta = new Ruta();
        const listaRutas = await objRuta.seleccionarRutas();
        response.status = 200;
        response.body = { success: true, data: listaRutas };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al obtener rutas", errors: error };
    }
};

export const getRutaById = async (ctx: RouterContext<"/rutas/:id">) => {
    const { params, response } = ctx;
    try {
        const id = parseInt(params.id);
        const objRuta = new Ruta();
        const ruta = await objRuta.seleccionarRutaPorId(id);

        if (ruta.length > 0) {
        response.status = 200;
        response.body = { success: true, data: ruta[0] };
        } else {
        response.status = 404;
        response.body = { success: false, message: "Ruta no encontrada" };
        }
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al obtener ruta", errors: error };
    }
};

export const postRuta = async (ctx: Context) => {
    const { request, response } = ctx;
    try {
        const body = await request.body.json();

        const rutaData = {
        IdRuta: null,
        IdUsuario: body.IdUsuario,
        Nombre: body.Nombre,
        };

        const objRuta = new Ruta(rutaData);
        const resultado = await objRuta.insertarRuta();

        response.status = resultado.success ? 200 : 400;
        response.body = resultado;
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al crear ruta: " + error };
    }
};

export const putRuta = async (ctx: RouterContext<"/rutas/:id">) => {
    const { params, request, response } = ctx;
    try {
        const id = parseInt(params.id);
        const body = await request.body.json();

        const rutaData = {
        IdRuta: id,
        IdUsuario: body.IdUsuario,
        Nombre: body.Nombre,
        };

        const objRuta = new Ruta(rutaData, id);
        const resultado = await objRuta.actualizarRuta();

        response.status = resultado.success ? 200 : 400;
        response.body = resultado;
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al actualizar ruta: " + error };
    }
};

export const deleteRuta = async (ctx: RouterContext<"/rutas/:id">) => {
    const { params, response } = ctx;
    try {
        const id = parseInt(params.id);

        const objRuta = new Ruta(null, id);
        const resultado = await objRuta.eliminarRuta();

        response.status = resultado.success ? 200 : 400;
        response.body = resultado;
    } catch (error) {
        response.status = 400;
        response.body = { success: false, message: "Error al eliminar ruta: " + error };
    }
};
