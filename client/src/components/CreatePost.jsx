import React, { useState } from "react";
import { createPost } from "../api/postApi";

const CreatePost = ({ userId }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Image preview
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image!");
      return;
    }

    try {
      setLoading(true);

      const post = await createPost(file, caption, userId);

      console.log("✅ Post uploaded:", post);
      alert("Post created successfully!");

      // Reset form
      setFile(null);
      setCaption("");
      setPreview(null);

      // Optional: refresh or update UI
      window.location.reload();
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-black text-white max-w-md mx-auto mb-4 rounded-lg">
      <form onSubmit={handleSubmit}>
        
        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mb-3 rounded-lg w-full object-cover max-h-60"
          />
        )}

        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-3 w-full"
        />

        {/* Caption */}
        <input
          type="text"
          placeholder="Write caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border border-gray-600 bg-black text-white p-2 w-full mb-3 rounded"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Share Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;