import { Router } from "../Dependencies/deps.ts";

let clients: WebSocket[] = [];

export const wsRouter = new Router();

wsRouter.get("/ws", (ctx) => {

  const sock = ctx.upgrade();

  // Cliente conectado
  sock.addEventListener("open", () => {
    console.log("Cliente conectado correctamente");
    clients.push(sock);
  });

  // Recepción de mensajes
  sock.addEventListener("message", (event) => {
    console.log("Mensaje WS recibido: ", event.data);

    try {
      const data = JSON.parse(event.data);

      if (data.type === "location") {
        // reenviar al resto
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "update",
                userId: data.userId,
                position: data.position,
              }),
            );
          }
        });
      }

    } catch (error) {
      console.log("Error procesando WS:", error);
    }
  });

  // Cliente desconectado
  sock.addEventListener("close", () => {
    console.log("Cliente desconectado");
    clients = clients.filter((c) => c !== sock);
  });

  sock.addEventListener("error", (err) => {
    console.log("Error WS:", err);
  });

});
