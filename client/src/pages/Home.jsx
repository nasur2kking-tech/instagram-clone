import Stories from "../components/Stories";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import CreatePost from "../components/CreatePost";

import { useEffect, useState } from "react";
import { getPosts } from "../api/postApi";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPosts();

        // ✅ FIX HERE
        setPosts(res.data.data || []);
        
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]); // safety fallback
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex bg-black text-white min-h-screen">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MAIN FEED */}
      <div className="flex-1 md:ml-[220px] max-w-xl mx-auto w-full px-2">

        {/* STORIES */}
        <Stories />

        {/* CREATE POST */}
        <CreatePost />

        {/* POSTS */}
        {posts.length === 0 ? (
          <p className="text-center mt-10">No posts yet...</p>
        ) : (
          Array.isArray(posts) &&
          posts.map((post) => (
            <Post key={post._id} post={post} />
          ))
        )}
      </div>

      {/* MOBILE NAV */}
      <div className="md:hidden fixed bottom-0 w-full">
        <MobileNav />
      </div>
    </div>
  );
}