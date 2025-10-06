import { Router } from "../Dependencies/deps.ts";
import {
    getRutaDetalles,
    getRutaDetalleById,
    postRutaDetalle,
    putRutaDetalle,
    deleteRutaDetalle
} from "../Controllers/rutaDetalleController.ts";

const rutaDetalleRouter = new Router();

rutaDetalleRouter
    .get("/ruta-detalle", getRutaDetalles)
    .get("/ruta-detalle/:id", getRutaDetalleById)
    .post("/ruta-detalle", postRutaDetalle)
    .put("/ruta-detalle/:id", putRutaDetalle)
    .delete("/ruta-detalle/:id", deleteRutaDetalle);

export { rutaDetalleRouter };
