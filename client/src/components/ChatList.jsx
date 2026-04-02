// client/src/components/ChatList.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";

const ChatList = ({ onSelect }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users"); // make sure backend returns all users
        setUsers(res.data.data || []);
      } catch (err) {
        console.error("Fetch users error:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-[250px] h-[500px] overflow-y-auto border border-gray-700 p-2 bg-black text-white rounded">
      <h2 className="font-bold mb-2">Chats</h2>
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => onSelect(user)}
          className="cursor-pointer p-2 hover:bg-gray-800 rounded mb-1"
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default ChatList;