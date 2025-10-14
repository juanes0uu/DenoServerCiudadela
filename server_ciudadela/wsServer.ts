import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

interface WSUser {
    id: number;
    socket: WebSocketClient;
    rol: "admin" | "usuario";
}

const clients: WSUser[] = [];
let rutaActiva: [number, number][] = [];

const wss = new WebSocketServer(8081); // 🔥 WebSocket en puerto distinto

wss.on("connection", (ws: WebSocketClient) => {
    console.log("Nuevo cliente conectado");

    ws.on("message", (msg: string) => {
        try {
        const data = JSON.parse(msg);

        if (data.type === "init") {
            const user: WSUser = { id: data.idUsuario, socket: ws, rol: data.rol };
            clients.push(user);
            console.log("Usuario conectado:", user);
        }

        if (data.type === "ruta_nueva" && data.rol === "admin") {
            rutaActiva = data.puntos;
            broadcast({ type: "ruta_actualizada", ruta: rutaActiva });
        }

        if (data.type === "ubicacion") {
            broadcast({ type: "ubicacion_usuario", id: data.idUsuario, coords: data.coords });
        }
        } catch (e) {
        console.error("Error WS:", e);
        }
    });

    ws.on("close", () => {
        console.log("Cliente desconectado");
    });
});

function broadcast(obj: unknown) {
    for (const c of clients) {
        try {
        c.socket.send(JSON.stringify(obj));
        } catch {
        console.log("Error enviando a cliente");
        }
    }
}

console.log("🛰️ Servidor WebSocket escuchando en ws://localhost:8081");
