// client/src/components/Stories.jsx
const Stories = ({ stories }) => {
  // ✅ fallback to default stories if none passed
  const storiesList = Array.isArray(stories) && stories.length > 0 ? stories : [1, 2, 3, 4, 5];

  return (
    <div className="w-full bg-black border-b border-gray-800">
      {/* STORIES CONTAINER */}
      <div className="flex gap-3 overflow-x-auto p-3 scroll-smooth">
        {storiesList.map((story, index) => (
          <div key={story.id || index} className="flex flex-col items-center min-w-[70px]">
            {/* GRADIENT STORY RING */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center justify-center">
              {/* INNER BLACK CIRCLE */}
              <div className="w-14 h-14 bg-black rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;