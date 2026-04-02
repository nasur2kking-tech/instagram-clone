import { useState } from "react";
import { createPost } from "../api/postApi"; // ✅ USE THIS

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  const handleSubmit = async () => {
    if (!image || !(image instanceof File)) {
      alert("Please select a valid image");
      return;
    }

    try {
      // ✅ USE createPost HERE
      await createPost({
        image,
        caption,
      });

      alert("Post created! ✅");

      setImage(null);
      setCaption("");

    } catch (err) {
      console.error("CREATE POST ERROR:", err);
      alert(err?.response?.data?.message || "Failed to create post ❌");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center gap-4">

      <h2 className="text-xl font-bold">Create Post</h2>

      {/* IMAGE INPUT */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
          }
        }}
        className="text-sm"
      />

      {/* CAPTION */}
      <input
        type="text"
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="border border-gray-600 bg-black text-white p-2 rounded w-64"
      />

      {/* ✅ BUTTON (ALREADY CORRECT PLACE) */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-700"
      >
        Upload
      </button>

    </div>
  );
};

export default CreatePost;