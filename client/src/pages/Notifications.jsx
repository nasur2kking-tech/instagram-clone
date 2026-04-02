// client/src/components/Notifications.jsx
import { useEffect, useState } from "react";
import { getNotifications } from "../api/notificationApi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]); // ✅ always array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getNotifications();

        // ✅ Normalize response
        const notifs = Array.isArray(res.data)
          ? res.data
          : res.data?.notifications && Array.isArray(res.data.notifications)
          ? res.data.notifications
          : [];

        setNotifications(notifs);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]); // fallback
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>

      {Array.isArray(notifications) && notifications.length === 0 && (
        <p className="text-gray-400">No notifications</p>
      )}

      {Array.isArray(notifications) &&
        notifications.map((n, i) => (
          <p key={i} className="border-b border-gray-700 py-2">
            <span className="text-blue-400">
              {(n?.senderId || "user").slice(0, 6)}
            </span>{" "}
            {n?.type === "like"
              ? "liked your post ❤️"
              : "started following you 👤"}
          </p>
        ))}
    </div>
  );
};

export default Notifications;