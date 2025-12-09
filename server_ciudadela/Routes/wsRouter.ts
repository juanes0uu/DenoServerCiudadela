import { Router } from "../Dependencies/deps.ts";

type WSClient = {
  socket: WebSocket;
  role?: "admin" | "visitante";
  userId?: string;
};

let clients: WSClient[] = [];

export const wsRouter = new Router();

wsRouter.get("/ws", (ctx) => {
  const socket = ctx.upgrade();

  const client: WSClient = { socket };
  clients.push(client);

  console.log("🟢 Cliente WS conectado");

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data);

      /* 🔐 REGISTRO */
      if (data.type === "register") {
        client.role = data.role;
        client.userId = data.userId;
        console.log(`✅ Registrado: ${client.role} (${client.userId})`);
        return;
      }

      /* 📍 UBICACIÓN */
      if (data.type === "location" && client.role === "visitante") {
        if (!client.userId || !data.position) return;

        console.log(
          `📍 Ubicación visitante ${client.userId}:`,
          data.position.lat,
          data.position.lng
        );

        const msg = JSON.stringify({
          type: "update",
          userId: client.userId,
          position: data.position,
        });

        clients = clients.filter(c => c.socket.readyState === WebSocket.OPEN);

        clients.forEach(c => {
          if (c.role === "admin") {
            c.socket.send(msg);
          }
        });
      }
    } catch (error) {
      console.error("❌ Error WS:", error);
    }
  });

  socket.addEventListener("close", () => {
    console.log("🔴 Cliente desconectado");
    clients = clients.filter((c) => c.socket !== socket);
  });

  socket.addEventListener("error", (err) => {
    console.log("❌ Error WS:", err);
  });
});
