import { Router } from "../Dependencies/deps.ts";
import { getUsuarios, getUsuarioById, postUsuario,  putUsuario,  deleteUsuario } from "../Controllers/usuarioController.ts";

const usuarioRouter = new Router();

usuarioRouter
  .get("/usuarios", getUsuarios)
  .get("/usuarios/:id", getUsuarioById)
  .post("/usuarios", postUsuario)
  .put("/usuarios/:id", putUsuario)
  .delete("/usuarios/:id", deleteUsuario);

export { usuarioRouter };