import { useState } from "react";
import { likePost, commentPost } from "../api/postApi";

const Post = ({ post }) => {
  // ✅ Likes state
  const [likes, setLikes] = useState(post.likes || []);

  // ✅ Comments state
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");

  // ✅ OPTIMISTIC LIKE HANDLER
  const handleLike = async () => {
    try {
      const userId = localStorage.getItem("userId");

      let updatedLikes;

      if (likes.includes(userId)) {
        updatedLikes = likes.filter((id) => id !== userId);
      } else {
        updatedLikes = [...likes, userId];
      }

      setLikes(updatedLikes); // ⚡ instant UI
      await likePost(post._id); // 🔁 backend sync

    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // ✅ OPTIMISTIC COMMENT HANDLER
  const handleComment = async () => {
    if (!newComment.trim()) return;

    const userId = localStorage.getItem("userId");

    const tempComment = {
      userId,
      text: newComment,
    };

    setComments([...comments, tempComment]);
    setNewComment("");

    try {
      await commentPost(post._id, newComment);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="border p-4 rounded-lg mb-4 bg-black text-white shadow max-w-md mx-auto">

      {/* IMAGE */}
      <img
        src={post.image || "https://picsum.photos/500/500"}
        alt="post"
        onError={(e) => (e.target.src = "https://picsum.photos/500/500")}
        className="w-full h-auto rounded-md hover:scale-[1.02] transition"
      />

      {/* CAPTION */}
      <p className="mt-2 text-sm text-gray-300">{post.caption}</p>

      {/* LIKE BUTTON */}
      <button
        onClick={handleLike}
        className={`mt-2 font-semibold ${
          likes.includes(localStorage.getItem("userId"))
            ? "text-red-500"
            : "text-gray-400"
        }`}
      >
        ❤️ {likes.length} likes
      </button>

      {/* COMMENT INPUT */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border border-gray-600 bg-black text-blue-400 placeholder-gray-500 px-3 py-2 rounded w-full outline-none"
        />
        <button
          onClick={handleComment}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
        >
          Post
        </button>
      </div>

      {/* ✅ SAFE COMMENTS LIST */}
      <div className="mt-3">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet</p>
        ) : (
          (comments || []).map((comment, index) => (
            <p key={index} className="text-sm border-b border-gray-700 py-1">
              <span className="font-semibold text-white">
                {(comment?.userId || "user").slice(0, 6)}:
              </span>{" "}
              <span className="text-blue-400">{comment?.text || ""}</span>
            </p>
          ))
        )}
      </div>

    </div>
  );
};

export default Post;