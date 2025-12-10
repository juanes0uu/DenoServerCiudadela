import { Application, oakCors, Router } from "./Dependencies/deps.ts";
import { usuarioRouter } from "./Routes/usuarioRouter.ts";

import { lugarRouter } from "./Routes/lugarRouter.ts";
import { ubicacionRouter } from "./Routes/ubicacionRouter.ts";
import { rutaRouter } from "./Routes/rutaRouter.ts";
import { rutaDetalleRouter } from "./Routes/rutaDetalleRouter.ts";
import { loginRouter } from "./Routes/loginRoutes.ts";
import { rolRouter } from "./Routes/rolRoutes.ts";
import { wsRouter } from "./Routes/wsRouter.ts";


const app = new Application();

// CORS
app.use(oakCors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

// Health check
const router = new Router();
router.get("/", (ctx) => {
    ctx.response.body = {
        status: "OK",
        message: "Backend de geolocalización activo",
    };
});

app.use(router.routes());
app.use(router.allowedMethods());

// Routers del sistema
app.use(usuarioRouter.routes());
app.use(usuarioRouter.allowedMethods());

app.use(lugarRouter.routes());
app.use(lugarRouter.allowedMethods());

app.use(ubicacionRouter.routes());
app.use(ubicacionRouter.allowedMethods());

app.use(rutaRouter.routes());
app.use(rutaRouter.allowedMethods());

app.use(rutaDetalleRouter.routes());
app.use(rutaDetalleRouter.allowedMethods()); // ✅ ESTE ES CLAVE

app.use(loginRouter.routes());
app.use(loginRouter.allowedMethods());

app.use(rolRouter.routes());
app.use(rolRouter.allowedMethods());

app.use(wsRouter.routes());
app.use(wsRouter.allowedMethods());

console.log("Servidor activo en Deno Deploy");
await app.listen({ port: 8080 });
