import { useEffect, useState } from "react";
import { getUserPosts } from "../api/postApi";
import { followUser } from "../api/userApi";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams(); // ✅ profile user id from URL

  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        setUserId(decoded.id); // logged-in user

        // ✅ fetch profile user's posts (NOT logged user)
        const res = await getUserPosts(id);
        setPosts(res.data.data || []);
      } catch (err) {
        console.error("Profile error:", err);
        setPosts([]);
      }
    };

    fetchData();
  }, [id]);

  // ✅ FIXED FOLLOW FUNCTION
  const handleFollow = async () => {
    try {
      await followUser(id); // ✅ correct target user id
      setIsFollowing(true);
      alert("Followed ✅");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      {/* PROFILE HEADER */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-700"></div>

        <div>
          {/* username */}
          <h2 className="text-xl font-bold">
            {user?.username || "User"}
          </h2>

          <div className="flex gap-4 mt-2 text-sm text-gray-400">
            <span><b>{posts.length}</b> posts</span>
            <span><b>0</b> followers</span>
            <span><b>0</b> following</span>
          </div>

          {/* ✅ FIXED CONDITION */}
          {userId && id && userId !== id && (
            <button
              onClick={handleFollow}
              className="bg-blue-600 px-4 py-1 mt-2 rounded"
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
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
  );
};

export default Profile;