import { useEffect, useState, useRef } from "react";
import { sendMessage, getMessages } from "../api/messageApi";
import { io } from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // ✅ prompt only once
  const [receiverId] = useState(() => prompt("Enter receiver userId") || "");

  const socket = useRef();

  // 🔌 SOCKET
  useEffect(() => {
    socket.current = io("http://localhost:5000");

    const userId = localStorage.getItem("userId");

    socket.current.emit("addUser", userId);

    socket.current.on("getMessage", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          senderId: data.senderId,
          text: data.text,
        },
      ]);
    });

    return () => socket.current.disconnect();
  }, []);

  // 📥 FETCH MESSAGES
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(receiverId);
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (receiverId) fetchMessages();
  }, [receiverId]);

  // ✅ IMPORTANT: KEEP THIS INSIDE COMPONENT
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
      console.error("SEND ERROR:", err);
      alert("Message failed");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">

      <h2 className="text-xl mb-4">Chat</h2>

      {/* 💬 MESSAGES */}
      <div className="mb-4 space-y-2">
        {messages.map((msg, i) => (
          <p key={i} className="text-sm bg-gray-800 p-2 rounded">
            {msg.text}
          </p>
        ))}
      </div>

      {/* ✍️ INPUT */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 bg-black border border-gray-600 rounded"
          placeholder="Type a message..."
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 px-4 rounded"
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default Chat;