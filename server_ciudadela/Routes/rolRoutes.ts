// routes/rolRouter.ts
import { Router } from "../Dependencies/deps.ts";
import {
    getRoles,
    getRolById,
    postRol,
    putRol,
    deleteRol
} from "../Controllers/rolController.ts";

const rolRouter = new Router();

rolRouter
    .get("/rol", getRoles)
    .get("/rol/:id", getRolById)
    .post("/rol", postRol)
    .put("/rol/:id", putRol)
    .delete("/rol/:id", deleteRol);

export { rolRouter };
