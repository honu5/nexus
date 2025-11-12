/**
 * ============================================================================
 * WEBSOCKET EDUCATIONAL PROJECT: Real-time Chat with Socket.IO & Express
 * ============================================================================
 *
 * This project demonstrates:
 * 1. WebSocket handshake and communication
 * 2. Socket.IO event handling (emit, on, broadcast)
 * 3. Server-Side Rendering (SSR) with Express
 * 4. TypeScript for type safety
 * 5. Room management and user presence
 * 6. Message acknowledgments
 * 7. Error handling and reconnection logic
 * ============================================================================
 */

import express, { Express, Request, Response } from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import path from "path";

// ============================================================================
// TYPE DEFINITIONS - Understanding Socket.IO data structures
// ============================================================================

interface User {
  id: string; // Socket ID - unique identifier for each connection
  username: string;
  room: string;
  joinedAt: Date;
  isActive: boolean;
}

interface ChatMessage {
  id: string;
  username: string;
  content: string;
  room: string;
  timestamp: Date;
  type: "user" | "system"; // system messages for join/leave events
}

interface RoomInfo {
  name: string;
  userCount: number;
  createdAt: Date;
  messages: ChatMessage[];
}

// ============================================================================
// APPLICATION SETUP
// ============================================================================

const app: Express = express();
const server = http.createServer(app);

/**
 * Socket.IO Server Configuration
 * - cors: Enable cross-origin requests
 * - transports: Specify connection methods (WebSocket primary, polling fallback)
 * - pingInterval: Server sends ping every 25s to detect dead connections
 * - pingTimeout: Disconnect if no pong received within 60s
 */
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"], // Fallback to polling if WebSocket unavailable
  pingInterval: 25000,
  pingTimeout: 60000,
});

// ============================================================================
// MIDDLEWARE & CONFIGURATION
// ============================================================================

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// ============================================================================
// IN-MEMORY DATA STORAGE
// ============================================================================
// In production, use a database like MongoDB or PostgreSQL

const users = new Map<string, User>();
const rooms = new Map<string, RoomInfo>();
const messageHistory = new Map<string, ChatMessage[]>();

// Helper function to get or create a room
function getOrCreateRoom(roomName: string): RoomInfo {
  if (!rooms.has(roomName)) {
    rooms.set(roomName, {
      name: roomName,
      userCount: 0,
      createdAt: new Date(),
      messages: messageHistory.get(roomName) || [],
    });
  }
  return rooms.get(roomName)!;
}

// ============================================================================
// EXPRESS ROUTES - Server-Side Rendering
// ============================================================================

/**
 * GET / - Main page
 * Renders the chat interface with initial data from server
 * This is SSR - the HTML is generated on the server before sending to client
 */
app.get("/", (req: Request, res: Response) => {
  const defaultRoom = "general";
  const room = getOrCreateRoom(defaultRoom);

  // Pass server-side data to the template
  res.render("index", {
    room: defaultRoom,
    userCount: room.userCount,
    messageHistory: room.messages.slice(-50), // Last 50 messages for context
  });
});

/**
 * GET /room/:name - Room page
 * Allows users to join specific chat rooms
 */
app.get("/room/:name", (req: Request, res: Response) => {
  const roomName = req.params.name.toLowerCase();
  const room = getOrCreateRoom(roomName);

  res.render("index", {
    room: roomName,
    userCount: room.userCount,
    messageHistory: room.messages.slice(-50),
  });
});

/**
 * GET /api/rooms - Get all active rooms
 * Used for the room list sidebar
 */
app.get("/api/rooms", (req: Request, res: Response) => {
  const roomList = Array.from(rooms.values()).map((room) => ({
    name: room.name,
    userCount: room.userCount,
    messageCount: room.messages.length,
  }));

  res.json(roomList);
});

// ============================================================================
// SOCKET.IO EVENTS - Real-time Communication
// ============================================================================

/**
 * io.on('connection') - Called when a new client connects
 *
 * The handshake happens before this:
 * 1. Client sends HTTP GET with Upgrade header
 * 2. Server responds with 101 Switching Protocols
 * 3. WebSocket connection established
 * 4. Socket object created and this callback fires
 */
io.on("connection", (socket: Socket) => {
  console.log(`[CONNECTION] User connected: ${socket.id}`);
  console.log(`[ACTIVE CONNECTIONS] Total: ${io.engine.clientsCount}`);
  

  /**
   * EVENT: user:join
   * Fired when user enters a room
   *
   * Flow:
   * 1. Client emits with username and room
   * 2. Server validates and stores user data
   * 3. Server joins socket to a Socket.IO room (different from chat room)
   * 4. Server broadcasts user joined message to room
   * 5. Server sends user list back to joining user
   */
  socket.on(
    "user:join",
    (data: { username: string; room: string }, callback) => {
      try {
        const { username, room } = data;

        // Validation
        if (!username || !room) {
          callback({ success: false, error: "Username and room required" });
          return;
        }

        // Create user object
        const user: User = {
          id: socket.id,
          username: username.trim().slice(0, 20), // Limit to 20 characters
          room,
          joinedAt: new Date(),
          isActive: true,
        };

        // Store user
        users.set(socket.id, user);

        // Join Socket.IO room (namespace for organizing connections)
        socket.join(room);

        // Get room info
        const room_info = getOrCreateRoom(room);
        room_info.userCount = io.sockets.adapter.rooms.get(room)?.size || 0;

        // Create system message
        const systemMessage: ChatMessage = {
          id: `${Date.now()}-${Math.random()}`,
          username: "System",
          content: `${username} joined the room`,
          room,
          timestamp: new Date(),
          type: "system",
        };

        // Store message
        const messages = messageHistory.get(room) || [];
        messages.push(systemMessage);
        messageHistory.set(room, messages);

        // Get all users in room
        const roomUsers = Array.from(users.values()).filter(
          (u) => u.room === room
        );

        // Acknowledgment pattern - send response back to client confirming join
        callback({ success: true, message: "Joined successfully" });

        // Broadcast user joined to all in room
        io.to(room).emit("user:joined", {
          message: systemMessage,
          usersInRoom: roomUsers,
        });

        // Emit to all rooms update (for room list)
        io.emit("room:updated", {
          name: room,
          userCount: room_info.userCount,
        });

        console.log(`[USER JOINED] ${username} joined room: ${room}`);
      } catch (error) {
        console.error("[ERROR] user:join handler:", error);
        callback({ success: false, error: "Join failed" });
      }
    }
  );

  /**
   * EVENT: message:send
   * Fired when user sends a message
   *
   * This demonstrates:
   * 1. Getting user data from storage
   * 2. Creating message object
   * 3. Broadcasting to room (not to sender)
   * 4. Emitting back to sender
   * 5. Persisting message history
   */
  socket.on("message:send", (messageData: { content: string }, callback) => {
    try {
      // Get user who sent message
      const user = users.get(socket.id);

      if (!user) {
        callback({ success: false, error: "User not found" });
        return;
      }

      const { content } = messageData;

      // Validation
      if (!content || !content.trim()) {
        callback({ success: false, error: "Message cannot be empty" });
        return;
      }

      // Create message object
      const message: ChatMessage = {
        id: `${Date.now()}-${Math.random()}`,
        username: user.username,
        content: content.trim().slice(0, 500), // Limit message length
        room: user.room,
        timestamp: new Date(),
        type: "user",
      };

      // Store in message history
      const messages = messageHistory.get(user.room) || [];
      messages.push(message);
      messageHistory.set(user.room, messages);

      /**
       * io.to(room).emit() - Send to all clients in room
       * socket.emit() - Send only to sender
       * socket.broadcast.to(room).emit() - Send to all except sender
       */

      // Broadcast to all in room (including sender)
      io.to(user.room).emit("message:received", {
        message,
        userCount: io.sockets.adapter.rooms.get(user.room)?.size || 0,
      });

      // Acknowledgment - confirm delivery to sender
      callback({ success: true, message: "Message sent" });

      console.log(
        `[MESSAGE] ${user.username} → ${user.room}: ${content.slice(0, 30)}...`
      );
    } catch (error) {
      console.error("[ERROR] message:send handler:", error);
      callback({ success: false, error: "Failed to send message" });
    }
  });

  /**
   * EVENT: typing:start
   * Fired when user starts typing (for real-time typing indicator)
   *
   * This shows how to handle frequent updates efficiently:
   * - Only broadcast to room, not persisted
   * - Includes user info for typing indicator
   */
  socket.on("typing:start", () => {
    const user = users.get(socket.id);
    if (!user) return;

    // Broadcast typing indicator to others in room (not sender)
    socket.broadcast.to(user.room).emit("typing:indicator", {
      username: user.username,
      isTyping: true,
    });
  });

  /**
   * EVENT: typing:stop
   * Fired when user stops typing
   */
  socket.on("typing:stop", () => {
    const user = users.get(socket.id);
    if (!user) return;

    socket.broadcast.to(user.room).emit("typing:indicator", {
      username: user.username,
      isTyping: false,
    });
  });

  /**
   * EVENT: user:list:request
   * Client requests updated user list (used for UI sync)
   */
  socket.on("user:list:request", (callback) => {
    const user = users.get(socket.id);
    if (!user) return;

    const roomUsers = Array.from(users.values())
      .filter((u) => u.room === user.room)
      .map((u) => ({ id: u.id, username: u.username, joinedAt: u.joinedAt }));

    callback({ users: roomUsers });
  });

  /**
   * EVENT: disconnect
   * Fired when client disconnects
   *
   * Handles:
   * 1. User cleanup
   * 2. System message broadcast
   * 3. Room update
   * 4. Dead connection detection via ping/pong
   */
  socket.on("disconnect", (reason) => {
    const user = users.get(socket.id);

    if (user) {
      // Remove user from storage
      users.delete(socket.id);

      // Create system message
      const systemMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random()}`,
        username: "System",
        content: `${user.username} left the room (${reason})`,
        room: user.room,
        timestamp: new Date(),
        type: "system",
      };

      // Store message
      const messages = messageHistory.get(user.room) || [];
      messages.push(systemMessage);
      messageHistory.set(user.room, messages);

      // Update room user count
      const room = getOrCreateRoom(user.room);
      room.userCount = io.sockets.adapter.rooms.get(user.room)?.size || 0;

      // Broadcast to remaining users in room
      io.to(user.room).emit("user:left", {
        message: systemMessage,
        usersInRoom: Array.from(users.values()).filter(
          (u) => u.room === user.room
        ),
      });

      // Update room list
      io.emit("room:updated", {
        name: user.room,
        userCount: room.userCount,
      });

      console.log(
        `[DISCONNECT] ${user.username} left room: ${user.room} (Reason: ${reason})`
      );
    }

    console.log(`[ACTIVE CONNECTIONS] Total: ${io.engine.clientsCount}`);
  });

  /**
   * ERROR EVENT
   * Handles errors in WebSocket communication
   */
  socket.on("error", (error) => {
    console.error(`[SOCKET ERROR] ${socket.id}:`, error);
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════╗
  ║     WebSocket Educational Server Started      ║
  ║                                                ║
  ║  🚀 Server running on http://localhost:${PORT}        ║
  ║  🔌 WebSocket ready for connections            ║
  ║  📚 Educational mode - Study the console logs  ║
  ╚════════════════════════════════════════════════╝
  `);

  // Log initial state
  console.log("[INIT] Server initialized");
  console.log("[INIT] Socket.IO ready");
  console.log("[INIT] Express SSR ready");
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on("SIGTERM", () => {
  console.log("[SHUTDOWN] SIGTERM received, closing server gracefully...");
  server.close(() => {
    console.log("[SHUTDOWN] Server closed");
    process.exit(0);
  });
});

export { server, io, users, rooms, messageHistory };
