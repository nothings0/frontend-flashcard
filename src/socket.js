import io from "socket.io-client";

// const URL = "https://backend-kfnn.onrender.com";
const URL = "http://localhost:3000";

export const socket = io(URL, {
  autoConnect: false,
});
