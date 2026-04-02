// client/src/components/Chat.jsx
import { useEffect, useState, useRef } from "react";
import { sendMessage, getMessages } from "../api/messageApi";

const Chat = ({ receiverId, receiverName }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch messages safely
  useEffect(() => {
    if (!receiverId) return;

    const fetchMessages = async () => {
      try {
        const res = await getMessages(receiverId);
        if (res.success) setMessages(res.data); // success check depends on backend
        else setMessages(res); // fallback if API returns array directly
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };

    fetchMessages();
  }, [receiverId]); // ✅ fetchMessages is defined inside, no dependency warning

  // Send a new message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await sendMessage(receiverId, text);
      if (res.success) setMessages((prev) => [...prev, res.data]);
      else setMessages((prev) => [...prev, res]); // fallback
      setText("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[500px] w-full md:w-[400px] border border-gray-700 bg-black text-white p-3 rounded">
      {/* Header */}
      <div className="border-b border-gray-700 pb-2 mb-2 font-bold text-lg">
        Chat with {receiverName || "User"}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm">No messages yet</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg._id}
            ref={scrollRef}
            className={`my-1 p-2 rounded max-w-[70%] ${
              msg.senderId === user.id ? "bg-blue-600 ml-auto" : "bg-gray-800"
            }`}
          >
            <p>{msg.text}</p>
            <span className="text-xs text-gray-400 float-right">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          className="flex-1 bg-gray-900 p-2 rounded outline-none text-white"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;