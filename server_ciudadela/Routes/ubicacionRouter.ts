import { Router } from "../Dependencies/deps.ts";
import { getUbicaciones, getUbicacionById, postUbicacion, putUbicacion, deleteUbicacion } from "../Controllers/ubicacionController.ts";

const ubicacionRouter = new Router();

ubicacionRouter
    .get("/ubicaciones", getUbicaciones)
    .get("/ubicaciones/:id", getUbicacionById)
    .post("/ubicaciones", postUbicacion)
    .put("/ubicaciones/:id", putUbicacion)
    .delete("/ubicaciones/:id", deleteUbicacion);

export { ubicacionRouter };
