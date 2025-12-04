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
import { loginRouter } from "./Routes/loginRoutes.ts";
import { rolRouter } from "./Routes/rolRoutes.ts";
import { wsRouter } from "./Routes/wsRouter.ts";


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

app.use(loginRouter.routes());
app.use(loginRouter.allowedMethods());

app.use(rolRouter.routes());
app.use(rolRouter.allowedMethods());

app.use(wsRouter.routes());
app.use(wsRouter.allowedMethods());


console.log("🚀 Servidor de Geolocalización corriendo en http://localhost:8080");
console.log("Aplicación de Geolocalización - Ciudadela Industrial de Duitama");
await app.listen({ port: 8080, hostname: "0.0.0.0" });
