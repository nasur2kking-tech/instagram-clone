import { useEffect, useState, useRef } from "react";
import { sendMessage, getMessages } from "../api/messageApi";
import { io } from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // ✅ Lazy state initializer for receiverId
  const [receiverId] = useState(() => prompt("Enter receiver userId") || "");

  const socket = useRef();

  // 🔌 SOCKET
  useEffect(() => {
    socket.current = io("http://localhost:5000"); // change to your backend in prod
    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.current.emit("addUser", userId);
    }

    socket.current.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.current.disconnect();
  }, []);

  // 📥 Fetch messages whenever receiverId changes
  useEffect(() => {
    if (!receiverId) return;

    // ✅ Use async IIFE to avoid ESLint warning
    (async () => {
      try {
        const { data } = await getMessages(receiverId);
        setMessages(data);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    })();
  }, [receiverId]);

  // ✅ Send message
  const handleSend = async () => {
    if (!receiverId) {
      alert("Receiver ID missing");
      return;
    }

    if (!text.trim()) {
      alert("Type a message");
      return;
    }

    const senderId = localStorage.getItem("userId");

    try {
      const { data } = await sendMessage(receiverId, text);

      socket.current.emit("sendMessage", {
        senderId,
        receiverId,
        text,
      });

      setMessages((prev) => [...prev, data]);
      setText("");
    } catch (err) {
      console.error("Send message error:", err);
      alert("Message failed");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 flex flex-col">
      <h2 className="text-xl mb-4">Chat with {receiverId || "..."}</h2>

      {/* 💬 Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-4">No messages yet</p>
        ) : (
          messages.map((msg, i) => (
            <p
              key={i}
              className={`text-sm p-2 rounded ${
                msg.senderId === localStorage.getItem("userId")
                  ? "bg-blue-600 self-end"
                  : "bg-gray-800 self-start"
              }`}
            >
              {msg.text}
            </p>
          ))
        )}
      </div>

      {/* ✍️ Input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 bg-black border border-gray-600 rounded"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="bg-blue-600 px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;