// client/src/components/Chat.jsx
import { useEffect, useState, useRef } from "react";
import { sendMessage, getMessages } from "../api/messageApi";
import { io } from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([]); // ✅ always array
  const [text, setText] = useState("");

  // ✅ Lazy state initializer for receiverId
  const [receiverId] = useState(() => prompt("Enter receiver userId") || "");

  const socket = useRef();

  // 🔌 SOCKET.IO
  useEffect(() => {
    socket.current = io("http://localhost:5000"); // backend URL

    const userId = localStorage.getItem("userId");
    if (userId) socket.current.emit("addUser", userId);

    socket.current.on("getMessage", (data) => {
      // ✅ only append if data has text
      if (data && data.text) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // 📥 Fetch messages safely
  useEffect(() => {
    if (!receiverId) return;

    (async () => {
      try {
        const res = await getMessages(receiverId);

        // ✅ ensure we get an array
        const msgs = Array.isArray(res.data)
          ? res.data
          : res.data?.messages && Array.isArray(res.data.messages)
          ? res.data.messages
          : [];

        setMessages(msgs);
      } catch (err) {
        console.error("Fetch messages error:", err);
        setMessages([]); // fallback
      }
    })();
  }, [receiverId]);

  // ✅ Send message
  const handleSend = async () => {
    if (!receiverId || !text.trim()) return;

    const senderId = localStorage.getItem("userId") || "guest";

    try {
      const res = await sendMessage(receiverId, text);

      const newMsg =
        (res.data && typeof res.data === "object" ? res.data : { senderId, receiverId, text }) ||
        { senderId, receiverId, text };

      setMessages((prev) => [...prev, newMsg]);

      socket.current.emit("sendMessage", newMsg);

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
        {Array.isArray(messages) && messages.length === 0 && (
          <p className="text-gray-400 text-center mt-4">No messages yet</p>
        )}

        {Array.isArray(messages) &&
          messages.map((msg, i) => (
            <p
              key={i}
              className={`text-sm p-2 rounded max-w-[70%] ${
                msg.senderId === localStorage.getItem("userId")
                  ? "bg-blue-600 self-end"
                  : "bg-gray-800 self-start"
              }`}
            >
              {msg.text || ""}
            </p>
          ))}
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