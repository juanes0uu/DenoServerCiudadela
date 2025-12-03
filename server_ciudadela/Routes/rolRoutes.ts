import { Router } from "../Dependencies/deps.ts";
import {
    getRoles,
    getRolById,
    postRol,
    putRol,
    deleteRol
} from "../Controllers/rolController.ts";

const RolRouter = new Router();

RolRouter
    .get("/ruta-detalle", getRoles)
    .get("/ruta-detalle/:id", getRolById)
    .post("/ruta-detalle", postRol)
    .put("/ruta-detalle/:id", putRol)
    .delete("/ruta-detalle/:id", deleteRol);

export { RolRouter };
