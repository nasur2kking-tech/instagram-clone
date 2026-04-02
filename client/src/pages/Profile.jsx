import { useEffect, useState } from "react";
import { getUserPosts } from "../api/postApi";
import { followUser } from "../api/userApi";
import jwtDecode from "jwt-decode";
import { useParams } from "react-router-dom";

import Chat from "../components/Chat";

const Profile = () => {
  const { id } = useParams(); // profile user ID

  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // ✅ Chat state
  const [chatUser, setChatUser] = useState(null);

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  // =======================
  // FETCH DATA
  // =======================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        setUserId(decoded.id);

        // fetch posts of profile user
        const res = await getUserPosts(id);
        setPosts(res.data || []);
      } catch (err) {
        console.error("❌ Profile error:", err);
        setPosts([]);
      }
    };

    fetchData();
  }, [id]);

  // =======================
  // FOLLOW USER
  // =======================
  const handleFollow = async () => {
    try {
      await followUser(id);
      setIsFollowing(true);
      alert("Followed ✅");
    } catch (err) {
      console.error(err);
      alert("Follow failed");
    }
  };

  // =======================
  // START CHAT
  // =======================
  const handleStartChat = () => {
    setChatUser({
      id: id,
      name: `User ${id}`, // you can replace with real username from API
    });
  };

  return (
    <div className="flex bg-black text-white min-h-screen">

      {/* ======================= */}
      {/* PROFILE CONTENT */}
      {/* ======================= */}
      <div className="flex-1 p-4">

        {/* HEADER */}
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-700"></div>

          <div>
            {/* username */}
            <h2 className="text-xl font-bold">
              {loggedUser?.username || "User"}
            </h2>

            <div className="flex gap-4 mt-2 text-sm text-gray-400">
              <span><b>{posts.length}</b> posts</span>
              <span><b>0</b> followers</span>
              <span><b>0</b> following</span>
            </div>

            {/* FOLLOW BUTTON */}
            {userId && id && userId !== id && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleFollow}
                  className="bg-blue-600 px-4 py-1 rounded"
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>

                {/* 💬 MESSAGE BUTTON */}
                <button
                  onClick={handleStartChat}
                  className="bg-gray-700 px-4 py-1 rounded"
                >
                  Message
                </button>
              </div>
            )}

            <p className="mt-2 text-gray-300 text-xs break-all">
              Profile ID: {id}
            </p>
          </div>
        </div>

        {/* POSTS GRID */}
        <div className="grid grid-cols-3 gap-2">
          {posts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            posts.map((post) => (
              <img
                key={post._id}
                src={post.image}
                alt="post"
                className="w-full h-32 object-cover"
              />
            ))
          )}
        </div>
      </div>

      {/* ======================= */}
      {/* CHAT PANEL (DESKTOP) */}
      {/* ======================= */}
      <div className="hidden lg:block w-[350px] border-l border-gray-800">
        {chatUser ? (
          <Chat
            receiverId={chatUser.id}
            receiverName={chatUser.name}
          />
        ) : (
          <div className="p-4 text-gray-400">
            Click "Message" to start chat 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;