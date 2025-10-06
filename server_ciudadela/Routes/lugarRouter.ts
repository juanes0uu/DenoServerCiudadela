import { Router } from "../Dependencies/deps.ts";
import { Lugar } from "../Models/lugarModel.ts";

// Función para obtener todos los lugares
const getLugares = async (ctx: any) => {
  try {
    const objLugar = new Lugar();
    const listaLugares = await objLugar.seleccionarLugares();
    ctx.response.body = { success: true, data: listaLugares };
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = { success: false, message: "Error al obtener lugares" };
  }
};

// Función para obtener lugar por ID
const getLugarById = async (ctx: any) => {
  try {
    const id = parseInt(ctx.params.id);
    const objLugar = new Lugar();
    const lugar = await objLugar.seleccionarLugarPorId(id);

    if (lugar.length > 0) {
      ctx.response.body = { success: true, data: lugar[0] };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { success: false, message: "Lugar no encontrado" };
    }
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = { success: false, message: "Error al obtener el lugar" };
  }
};

// Función para crear un nuevo lugar - SOLO ESTA FUNCIÓN CORREGIDA
const postLugar = async (ctx: any) => {
  try {
    // FORMA CORRECTA en Oak para obtener el body JSON
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = { success: false, message: "Cuerpo de la solicitud está vacío" };
      return;
    }

    const body = ctx.request.body();
    let value: any;

    if (body.type === "json") {
      value = await body.value;
    } else {
      ctx.response.status = 400;
      ctx.response.body = { success: false, message: "Formato JSON requerido" };
      return;
    }

    const { IdUsuario, Nombre, Descripcion, Latitud, Longitud } = value;

    const lugarData = {
      IdLugar: null,
      IdUsuario: IdUsuario,
      Nombre: Nombre,
      Descripcion: Descripcion,
      Latitud: parseFloat(Latitud),
      Longitud: parseFloat(Longitud),
    };

    const objLugar = new Lugar(lugarData);
    const resultado = await objLugar.insertarLugar();

    ctx.response.body = resultado;
  } catch (error) {
    console.error("Error en postLugar:", error);
    ctx.response.status = 400;
    ctx.response.body = {
      success: false,
      message: "Error al procesar la solicitud: " + String(error),
    };
  }
};

// Crear el router con las rutas
const lugarRouter = new Router();
lugarRouter
  .get("/lugares", getLugares)
  .get("/lugares/:id", getLugarById)
  .post("/lugares", postLugar);

export { lugarRouter };