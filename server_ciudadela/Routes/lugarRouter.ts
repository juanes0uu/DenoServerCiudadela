import { Router } from "../Dependencies/deps.ts";
import { getLugares, getLugarById, postLugar } from "../Controllers/lugarController.ts";

const lugarRouter = new Router();

lugarRouter
  .get("/lugares", getLugares)
  .get("/lugares/:id", getLugarById)
  .post("/lugares", postLugar);

export { lugarRouter };