import { useState } from "react";
import API from "../api/axios";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      await API.post("/posts", formData);

      alert("Post created!");
      setCaption("");
      setImage(null);

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-4 bg-black text-white max-w-md mx-auto mb-4 rounded-lg">
      
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-2 w-full"
      />

      <input
        type="text"
        placeholder="Write caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="border border-gray-600 bg-black text-white p-2 w-full mb-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 px-4 py-2 rounded w-full"
      >
        Share Post
      </button>

    </div>
  );
};

export default CreatePost;