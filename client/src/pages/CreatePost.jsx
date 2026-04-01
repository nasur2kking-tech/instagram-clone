import { useState } from "react";
import API from "../api/axios";

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  // ✅ UPDATED HANDLE SUBMIT WITH VALIDATION
  const handleSubmit = async () => {
    console.log("IMAGE STATE:", image); // 🔍 debug

    if (!image || !(image instanceof File)) {
      alert("Please select a valid image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);

      const token = localStorage.getItem("token");

      await API.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Post created!");
      setImage(null);
      setCaption("");

    } catch (err) {
      console.error("CREATE POST ERROR:", err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center gap-4">

      <h2 className="text-xl font-bold">Create Post</h2>

      {/* ✅ FIXED IMAGE INPUT */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          console.log("FILE:", e.target.files[0]); // 🔍 debug
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

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 px-4 py-2 rounded font-semibold"
      >
        Upload
      </button>

    </div>
  );
};

export default CreatePost;