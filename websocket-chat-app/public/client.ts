/**
 * ============================================================================
 * CLIENT-SIDE WEBSOCKET CODE - Understanding Socket.IO Client
 * ============================================================================
 *
 * This file demonstrates:
 * 1. Socket.IO client initialization
 * 2. Event emission and listening
 * 3. Connection lifecycle management
 * 4. Error handling and reconnection
 * 5. DOM manipulation and UI updates
 * 6. Message handling and display
 * ============================================================================
 */

// ============================================================================
// TYPE DEFINITIONS - Client-side data structures
// ============================================================================

interface User {
  id: string;
  username: string;
  joinedAt: Date;
}

interface ChatMessage {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  type: "user" | "system";
}

interface AckResponse {
  success: boolean;
  error?: string;
  message?: string;
}

// ============================================================================
// SOCKET.IO INITIALIZATION
// ============================================================================

/**
 * io() - Creates a Socket.IO client connection
 *
 * How it works:
 * 1. Creates WebSocket connection to server
 * 2. If WebSocket fails, falls back to HTTP polling
 * 3. Automatically handles reconnection
 * 4. Returns Socket object for event handling
 *
 * Connection states:
 * - CONNECTING (0): Initial connection attempt
 * - CONNECTED (1): Successfully connected
 * - DISCONNECTING (2): Closing connection
 * - DISCONNECTED (3): Fully disconnected
 */
const socket = io({
  // Configuration options
  reconnection: true, // Automatically reconnect if disconnected
  reconnectionDelay: 1000, // Wait 1 second before first reconnect attempt
  reconnectionDelayMax: 5000, // Max wait between attempts is 5 seconds
  reconnectionAttempts: 5, // Try 5 times before giving up
  transports: ["websocket", "polling"], // Try WebSocket first, fallback to polling
});

// ============================================================================
// UI STATE MANAGEMENT
// ============================================================================

interface UIState {
  username: string | null;
  room: string;
  isConnected: boolean;
  usersInRoom: User[];
  isTyping: Map<string, boolean>;
}

const state: UIState = {
  username: null,
  room: "general",
  isConnected: false,
  usersInRoom: [],
  isTyping: new Map(),
};

// ============================================================================
// DOM ELEMENT REFERENCES
// ============================================================================

// Get references to DOM elements - cache them for performance
const elements = {
  // Join room form
  joinForm: document.getElementById("join-form") as HTMLFormElement,
  usernameInput: document.getElementById("username-input") as HTMLInputElement,
  roomInput: document.getElementById("room-input") as HTMLInputElement,
  joinBtn: document.getElementById("join-btn") as HTMLButtonElement,

  // Chat interface
  chatContainer: document.getElementById("chat-container") as HTMLDivElement,
  messagesContainer: document.getElementById("messages") as HTMLDivElement,
  messageInput: document.getElementById("message-input") as HTMLInputElement,
  sendBtn: document.getElementById("send-btn") as HTMLButtonElement,

  // Status displays
  statusIndicator: document.getElementById("status") as HTMLDivElement,
  roomName: document.getElementById("room-name") as HTMLDivElement,
  userCount: document.getElementById("user-count") as HTMLDivElement,
  usersList: document.getElementById("users-list") as HTMLDivElement,
  typingIndicator: document.getElementById(
    "typing-indicator"
  ) as HTMLDivElement,
};

// ============================================================================
// CONNECTION LIFECYCLE EVENTS
// ============================================================================

/**
 * socket.on('connect') - Fired when connection established
 *
 * Lifecycle:
 * 1. HTTP Upgrade request sent
 * 2. Server responds with 101 Switching Protocols
 * 3. WebSocket connection active
 * 4. This event fires
 * 5. Client can now emit events
 */
socket.on("connect", () => {
  console.log("[CONNECT] Successfully connected to server");
  console.log("[CONNECT] Socket ID:", socket.id); // Unique identifier for this connection

  state.isConnected = true;
  updateStatusUI();

  // Show chat interface if user already joined
  if (state.username) {
    elements.chatContainer.style.display = "block";
    elements.joinForm.style.display = "none";
    // Enable message input and send button when connected and joined
    if (elements.messageInput) elements.messageInput.disabled = false;
    if (elements.sendBtn) elements.sendBtn.disabled = false;
  }
});

/**
 * socket.on('disconnect') - Fired when connection lost
 *
 * Reasons for disconnection:
 * - 'io server disconnect' - Server explicitly disconnected
 * - 'io client disconnect' - Client called disconnect()
 * - 'transport close' - Connection dropped (network failure)
 * - 'transport error' - Transport error
 */
socket.on("disconnect", (reason: string) => {
  console.log("[DISCONNECT] Disconnected from server:", reason);

  state.isConnected = false;
  updateStatusUI();

  // Show appropriate message
  showSystemMessage(`Disconnected: ${reason}`);
  // Disable message input and send button while disconnected
  if (elements.messageInput) elements.messageInput.disabled = true;
  if (elements.sendBtn) elements.sendBtn.disabled = true;
});

/**
 * socket.on('connect_error') - Fired when connection fails
 *
 * Possible errors:
 * - Authentication failure
 * - Server rejection
 * - Network timeout
 */
socket.on("connect_error", (error: any) => {
  console.error("[CONNECTION ERROR]", error);
  showSystemMessage(`Connection error: ${error.message}`);
});

/**
 * socket.on('reconnect_attempt') - Fired on each reconnection attempt
 */
socket.on("reconnect_attempt", () => {
  console.log("[RECONNECT] Attempting to reconnect...");
  showSystemMessage("Attempting to reconnect...");
});

/**
 * socket.on('reconnect') - Fired when successfully reconnected
 */
socket.on("reconnect", () => {
  console.log("[RECONNECT] Successfully reconnected");
  showSystemMessage("Reconnected to server!");

  // Re-join room after reconnection
  if (state.username) {
    joinRoom();
  }
});

// ============================================================================
// USER LIFECYCLE EVENTS
// ============================================================================

/**
 * USER:JOIN EVENT
 * Fired when current user joins a room
 */
function joinRoom() {
  if (!state.username || !state.room) {
    alert("Username and room are required");
    return;
  }

  // Emit with acknowledgment
  // Acknowledgment allows server to send response back
  socket.emit(
    "user:join",
    { username: state.username, room: state.room },
    (response: AckResponse) => {
      if (response.success) {
        console.log("[USER:JOIN] Successfully joined room");
        elements.joinForm.style.display = "none";
        elements.chatContainer.style.display = "block";
        updateStatusUI();

        // Focus on message input
        elements.messageInput.focus();
      } else {
        alert(`Failed to join: ${response.error}`);
      }
    }
  );
}

/**
 * socket.on('user:joined') - Broadcast when user joins
 *
 * This is received by:
 * - Users already in the room
 * - The joining user (if using socket.broadcast.emit with special logic)
 */
socket.on(
  "user:joined",
  (data: { message: ChatMessage; usersInRoom: User[] }) => {
    console.log("[USER:JOINED]", data.message.username, "joined");

    // Update users list
    state.usersInRoom = data.usersInRoom;
    updateUsersUI();

    // Display system message
    displayMessage(data.message);
  }
);

/**
 * socket.on('user:left') - Broadcast when user leaves
 */
socket.on(
  "user:left",
  (data: { message: ChatMessage; usersInRoom: User[] }) => {
    console.log("[USER:LEFT]", data.message.username, "left");

    // Update users list
    state.usersInRoom = data.usersInRoom;
    updateUsersUI();

    // Display system message
    displayMessage(data.message);

    // Clear typing indicator for this user
    state.isTyping.delete(data.message.username);
    updateTypingIndicator();
  }
);

// ============================================================================
// MESSAGE EVENTS
// ============================================================================

/**
 * MESSAGE:SEND EVENT
 * User sends a message - bound to send button click
 */
function sendMessage() {
  const content = elements.messageInput.value.trim();

  if (!content) {
    return; // Don't send empty messages
  }

  // Emit with acknowledgment for confirmation
  socket.emit("message:send", { content }, (response: AckResponse) => {
    if (response.success) {
      // Clear input on success
      elements.messageInput.value = "";

      // Send typing:stop event
      socket.emit("typing:stop");
      state.isTyping.delete(state.username!);
      updateTypingIndicator();
    } else {
      alert(`Failed to send: ${response.error}`);
    }
  });
}

/**
 * socket.on('message:received') - Broadcast when message received
 *
 * This is the most important event in a chat app
 * Fired for:
 * - Messages from other users
 * - Your own messages (if using io.to().emit())
 */
socket.on(
  "message:received",
  (data: { message: ChatMessage; userCount: number }) => {
    console.log("[MESSAGE:RECEIVED] From:", data.message.username);

    // Display message in UI
    displayMessage(data.message);

    // Update user count
    updateStatusUI();

    // Auto-scroll to bottom
    scrollMessagesToBottom();
  }
);

// ============================================================================
// TYPING INDICATOR EVENTS
// ============================================================================

/**
 * TYPING:START EVENT
 * Fired when user starts typing
 *
 * Optimization: This is throttled to avoid sending too many events
 * Typically every 300ms while typing
 */
let typingTimeout: NodeJS.Timeout;

function onMessageInputChange() {
  // Only send if connected and in room
  if (!state.isConnected || !state.username) {
    return;
  }

  // Clear previous timeout
  clearTimeout(typingTimeout);

  // Send typing:start
  socket.emit("typing:start");

  // Set timeout to send typing:stop after 2 seconds of inactivity
  typingTimeout = setTimeout(() => {
    socket.emit("typing:stop");
  }, 2000);
}

/**
 * socket.on('typing:indicator') - Broadcast typing indicator
 *
 * Used to show "user is typing..." message in UI
 * More responsive user experience
 */
socket.on(
  "typing:indicator",
  (data: { username: string; isTyping: boolean }) => {
    if (data.isTyping) {
      state.isTyping.set(data.username, true);
    } else {
      state.isTyping.delete(data.username);
    }

    updateTypingIndicator();
  }
);

// ============================================================================
// UI UPDATE FUNCTIONS
// ============================================================================

/**
 * updateStatusUI - Update connection status display
 */
function updateStatusUI() {
  const statusText = state.isConnected ? "🟢 Connected" : "🔴 Disconnected";
  const statusClass = state.isConnected ? "connected" : "disconnected";

  elements.statusIndicator.textContent = statusText;
  elements.statusIndicator.className = statusClass;

  // Update room info
  elements.roomName.textContent = `Room: ${state.room}`;
  elements.userCount.textContent = `Users: ${state.usersInRoom.length}`;
}

/**
 * updateUsersUI - Update user list display
 */
function updateUsersUI() {
  // Request updated user list from server
  socket.emit("user:list:request", (response: { users: User[] }) => {
    elements.usersList.innerHTML = response.users
      .map((user) => `<div class="user-item">${user.username}</div>`)
      .join("");
  });
}

/**
 * updateTypingIndicator - Show who is typing
 */
function updateTypingIndicator() {
  const typingUsers = Array.from(state.isTyping.keys());

  if (typingUsers.length === 0) {
    elements.typingIndicator.textContent = "";
  } else {
    const names = typingUsers.join(", ");
    elements.typingIndicator.textContent = `${names} ${
      typingUsers.length === 1 ? "is" : "are"
    } typing...`;
  }
}

/**
 * displayMessage - Render a message in the UI
 *
 * This handles:
 * - User messages (styled one way)
 * - System messages (styled differently)
 * - Timestamp formatting
 */
function displayMessage(message: ChatMessage) {
  const messageEl = document.createElement("div");
  messageEl.className = `message message-${message.type}`;

  const timeString = new Date(message.timestamp).toLocaleTimeString();

  messageEl.innerHTML = `
    <div class="message-header">
      <span class="username">${escapeHtml(message.username)}</span>
      <span class="timestamp">${timeString}</span>
    </div>
    <div class="message-content">${escapeHtml(message.content)}</div>
  `;

  elements.messagesContainer.appendChild(messageEl);
}

/**
 * showSystemMessage - Display a system-level message
 */
function showSystemMessage(text: string) {
  const messageEl = document.createElement("div");
  messageEl.className = "message message-system";
  messageEl.textContent = text;
  elements.messagesContainer.appendChild(messageEl);
  scrollMessagesToBottom();
}

/**
 * scrollMessagesToBottom - Auto-scroll chat to bottom
 */
function scrollMessagesToBottom() {
  elements.messagesContainer.scrollTop =
    elements.messagesContainer.scrollHeight;
}

/**
 * escapeHtml - Prevent XSS attacks by escaping HTML characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================================
// EVENT LISTENERS - DOM Interaction
// ============================================================================

/**
 * Join form submission
 */
elements.joinBtn.addEventListener("click", (e) => {
  e.preventDefault();

  state.username = elements.usernameInput.value.trim();
  state.room = elements.roomInput.value.trim() || "general";

  if (!state.username) {
    alert("Please enter a username");
    return;
  }

  joinRoom();
});
// Also handle form submit (pressing Enter) to avoid full page reload
if (elements.joinForm) {
  elements.joinForm.addEventListener("submit", (e) => {
    e.preventDefault();

    state.username = elements.usernameInput.value.trim();
    state.room = elements.roomInput.value.trim() || "general";

    if (!state.username) {
      alert("Please enter a username");
      return;
    }

    joinRoom();
  });
}

/**
 * Message send button
 */
elements.sendBtn.addEventListener("click", () => {
  sendMessage();
});

/**
 * Message input - Enter to send
 */
elements.messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

/**
 * Message input change - Trigger typing indicator
 */
elements.messageInput.addEventListener("input", onMessageInputChange);

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Run on page load
 * Initialize UI and request room data
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("[INIT] Client initialized");
  console.log("[INIT] WebSocket connection ready");

  // Set initial room from URL or default
  const roomParam = new URLSearchParams(window.location.search).get("room");
  if (roomParam) {
    state.room = roomParam;
    elements.roomInput.value = roomParam;
  }

  updateStatusUI();
});

// ============================================================================
// ADVANCED: Connection Debugging
// ============================================================================

/**
 * Log all Socket.IO events (for learning purposes)
 * Comment out in production
 */
if (process.env.NODE_ENV === "development") {
  const originalOn = socket.on;
  socket.on = function (...args) {
    console.log("[SOCKET EVENT]", args[0]);
    return originalOn.apply(socket, args);
  };
}
