import { Server, Socket } from "socket.io";
import { sql } from "./db.js";

export const setupSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins a location-based room
    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Handle incoming chat messages
    socket.on("send_message", async (data) => {
      const { sender_id, roomId, content } = data;

      // Save to database
      const [newMessage] = await sql`
        INSERT INTO messages (sender_id, room_id, content)
        VALUES (${sender_id}, ${roomId}, ${content})
        RETURNING *
      `;

      // Broadcast to everyone else in the room
      io.to(roomId).emit("receive_message", newMessage);
    });

    // Handle disconnects
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
