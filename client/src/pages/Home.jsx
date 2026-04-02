import { useEffect, useState } from "react";

import Stories from "../components/Stories";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import CreatePost from "../components/CreatePost";
import Chat from "../components/Chat";

import { getPosts } from "../api/postApi";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  // ✅ Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // =======================
  // FETCH POSTS
  // =======================
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPosts();

        // backend returns { success, data }
        setPosts(res.data || []);
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  // =======================
  // SELECT CHAT USER
  // =======================
  const handleSelectUser = (selectedUser) => {
    setChatUser(selectedUser);
  };

  return (
    <div className="flex bg-black text-white min-h-screen">

      {/* ======================= */}
      {/* SIDEBAR (DESKTOP) */}
      {/* ======================= */}
      <div className="hidden md:block">
        <Sidebar onSelectUser={handleSelectUser} />
      </div>

      {/* ======================= */}
      {/* MAIN FEED */}
      {/* ======================= */}
      <div className="flex-1 md:ml-[220px] max-w-xl mx-auto w-full px-2">

        {/* PROFILE HEADER */}
        <div className="flex items-center gap-4 p-4 border-b border-gray-800">
          <div className="w-12 h-12 rounded-full bg-gray-700"></div>
          <h2 className="text-xl font-bold">
            {user?.username || "User"}
          </h2>
        </div>

        {/* STORIES */}
        <Stories />

        {/* CREATE POST */}
        <CreatePost userId={user?._id} />

        {/* POSTS */}
        {posts.length === 0 ? (
          <p className="text-center mt-10">No posts yet...</p>
        ) : (
          posts.map((post) => (
            <Post key={post._id} post={post} />
          ))
        )}
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
            Select a user to start chatting 💬
          </div>
        )}
      </div>

      {/* ======================= */}
      {/* MOBILE NAV */}
      {/* ======================= */}
      <div className="md:hidden fixed bottom-0 w-full">
        <MobileNav />
      </div>
    </div>
  );
}