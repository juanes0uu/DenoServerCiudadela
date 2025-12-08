import { Router } from "../Dependencies/deps.ts";
import { getUsuarios, getUsuarioById, postUsuario,  putUsuario,  deleteUsuario, postAdmin } from "../Controllers/usuarioController.ts";

const usuarioRouter = new Router();

usuarioRouter
  .get("/usuarios", getUsuarios)

  // ✅ ESPECÍFICA PRIMERO
  .post("/usuarios/admin", postAdmin)

  .post("/usuarios", postUsuario)

  // ❌ DINÁMICA SIEMPRE AL FINAL
  .get("/usuarios/:id", getUsuarioById)
  .put("/usuarios/:id", putUsuario)
  .delete("/usuarios/:id", deleteUsuario);

export { usuarioRouter };