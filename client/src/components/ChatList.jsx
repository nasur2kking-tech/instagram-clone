// client/src/components/ChatList.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";

const ChatList = ({ onSelect }) => {
  const [users, setUsers] = useState([]); // ✅ always an array

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users"); // backend endpoint

        // Normalize response: ensure it's an array
        const usersData = Array.isArray(res.data)
          ? res.data
          : res.data?.data && Array.isArray(res.data.data)
          ? res.data.data
          : [];

        setUsers(usersData);
      } catch (err) {
        console.error("Fetch users error:", err);
        setUsers([]); // fallback to empty array
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-[250px] h-[500px] overflow-y-auto border border-gray-700 p-2 bg-black text-white rounded">
      <h2 className="font-bold mb-2">Chats</h2>

      {users.length === 0 && (
        <p className="text-gray-500 text-sm">No users found</p>
      )}

      {Array.isArray(users) &&
        users.map((user) => (
          <div
            key={user._id}
            onClick={() => onSelect(user)}
            className="cursor-pointer p-2 hover:bg-gray-800 rounded mb-1"
          >
            {user.username || "Unknown"}
          </div>
        ))}
    </div>
  );
};

export default ChatList;