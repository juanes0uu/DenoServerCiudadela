import { Application, oakCors, Router } from "./Dependencies/deps.ts";
import { 
    getUsuarios, 
    getUsuarioById, 
    postUsuario, 
    putUsuario, 
    deleteUsuario 
} from "./Controllers/usuarioController.ts";
import { lugarRouter } from "./Routes/lugarRouter.ts";
import { ubicacionRouter } from "./Routes/ubicacionRouter.ts";
import { rutaRouter } from "./Routes/rutaRouter.ts";
import { rutaDetalleRouter } from "./Routes/rutaDetalleRouter.ts";

const app = new Application();

// Configurar CORS
app.use(oakCors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Crear routers
const usuarioRouter = new Router();
usuarioRouter
    .get("/usuarios", getUsuarios)
    .get("/usuarios/:id", getUsuarioById)
    .post("/usuarios", postUsuario)
    .put("/usuarios/:id", putUsuario)
    .delete("/usuarios/:id", deleteUsuario);

// Middleware para logging
app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    await next();
});

// Rutas
app.use(usuarioRouter.routes());
app.use(usuarioRouter.allowedMethods());

app.use(lugarRouter.routes());
app.use(lugarRouter.allowedMethods());

app.use(ubicacionRouter.routes());
app.use(ubicacionRouter.allowedMethods());

app.use(rutaRouter.routes());
app.use(rutaRouter.allowedMethods());

app.use(rutaDetalleRouter.routes());
app.use(rutaDetalleRouter.allowedMethods());

console.log("🚀 Servidor de Geolocalización corriendo en http://localhost:8080");
console.log("Aplicación de Geolocalización - Ciudadela Industrial de Duitama");
await app.listen({ port: 8080 });