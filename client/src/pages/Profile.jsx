import { useEffect, useState } from "react";
import { getUserPosts } from "../api/postApi";
import { followUser } from "../api/userApi";
import jwtDecode from "jwt-decode";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // ✅ Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // ✅ Decode token
        const decoded = jwtDecode(token);
        const id = decoded.id;

        setUserId(id);

        // ✅ Fetch posts for this user
        const res = await getUserPosts(id);
        setPosts(res.data.data || []);
      } catch (err) {
        console.error("Profile error:", err);
        setPosts([]);
      }
    };

    fetchData();
  }, []);

  const handleFollow = async () => {
    try {
      await followUser(userId);
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      {/* PROFILE HEADER */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-700"></div>

        <div>
          {/* ✅ Display username from localStorage */}
          <h2 className="text-xl font-bold">{user?.username || "User"}</h2>

          <div className="flex gap-4 mt-2 text-sm text-gray-400">
            <span><b>{posts.length}</b> posts</span>
            <span><b>0</b> followers</span>
            <span><b>0</b> following</span>
          </div>

          {/* ✅ Prevent self-follow */}
          {userId && userId !== user?.id && (
            <button
              onClick={handleFollow}
              className="bg-blue-600 px-4 py-1 mt-2 rounded"
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

          <p className="mt-2 text-gray-300 text-xs break-all">
            {userId}
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
  );
};

export default Profile;