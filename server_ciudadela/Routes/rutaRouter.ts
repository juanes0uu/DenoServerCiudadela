import { Router } from "../Dependencies/deps.ts";
import { getRutas, getRutaById, postRuta, putRuta, deleteRuta } from "../Controllers/rutaController.ts";

const rutaRouter = new Router();

rutaRouter
    .get("/rutas", getRutas)
    .get("/rutas/:id", getRutaById)
    .post("/rutas", postRuta)
    .put("/rutas/:id", putRuta)
    .delete("/rutas/:id", deleteRuta);

export { rutaRouter };
