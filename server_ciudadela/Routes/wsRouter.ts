import { Router } from "../Dependencies/deps.ts";

type WSClient = {
  socket: WebSocket;
  role?: "admin" | "visitante";
  userId?: string;
  dbUserId?: string; // 👈 NUEVO: ID real de la base de datos
  userName?: string;
  email?: string;
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

      /* 🔐 REGISTRO MEJORADO */
      if (data.type === "register") {
        client.role = data.role;
        client.userId = data.userId;
        client.dbUserId = data.dbUserId; // 👈 Guardar ID de BD
        client.userName = data.userName;
        client.email = data.email;
        
        console.log(`✅ Registrado: ${client.role} - ${client.userName} (${client.userId}, DB: ${client.dbUserId})`);
        
        // Notificar a todos los admins que hay un nuevo visitante
        if (client.role === "visitante") {
          const msg = JSON.stringify({
            type: "new_visitor",
            userId: client.userId,
            dbUserId: client.dbUserId, // 👈 Incluir en notificación
            userName: client.userName,
            email: client.email
          });
          
          // Enviar a todos los admins
          clients.forEach(c => {
            if (c.role === "admin" && c.socket.readyState === WebSocket.OPEN) {
              c.socket.send(msg);
            }
          });
        }
        return;
      }

      /* 📍 UBICACIÓN - FILTRAR POR USERID */
      if (data.type === "location" && client.role === "visitante") {
        if (!client.userId || !data.position) return;

        console.log(
          `📍 ${client.userName || 'Visitante'} (${client.userId}):`,
          data.position.lat,
          data.position.lng
        );

        const msg = JSON.stringify({
          type: "update",
          userId: client.userId,
          dbUserId: client.dbUserId, // 👈 Incluir en actualización
          userName: client.userName,
          email: client.email,
          position: data.position,
        });

        // Filtrar clientes activos
        clients = clients.filter(c => c.socket.readyState === WebSocket.OPEN);

        // Enviar solo a admins
        clients.forEach(c => {
          if (c.role === "admin" && c.socket.readyState === WebSocket.OPEN) {
            c.socket.send(msg);
          }
        });
      }
    } catch (error) {
      console.error("❌ Error WS:", error);
    }
  });

  socket.addEventListener("close", () => {
    console.log("🔴 Cliente desconectado:", client.userName || "Desconocido");
    
    // Notificar a los admins si era un visitante
    if (client.role === "visitante") {
      const msg = JSON.stringify({
        type: "visitor_left",
        userId: client.userId
      });
      
      clients.forEach(c => {
        if (c.role === "admin" && c.socket.readyState === WebSocket.OPEN) {
          c.socket.send(msg);
        }
      });
    }
    
    clients = clients.filter((c) => c.socket !== socket);
  });

  socket.addEventListener("error", (err) => {
    console.log("❌ Error WS:", err);
  });
});