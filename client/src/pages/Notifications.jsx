import { useEffect, useState } from "react";
import { getNotifications } from "../api/notificationApi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((n, i) => (
          <p key={i} className="border-b border-gray-700 py-2">
            <span className="text-blue-400">
              {n.senderId.slice(0, 6)}
            </span>{" "}
            {n.type === "like"
              ? "liked your post ❤️"
              : "started following you 👤"}
          </p>
        ))
      )}
    </div>
  );
};

export default Notifications;