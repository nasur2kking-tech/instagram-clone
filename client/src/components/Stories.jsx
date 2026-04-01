const Stories = () => {
  return (
    <div className="w-full bg-black border-b border-gray-800">
      
      {/* STORIES CONTAINER */}
      <div className="flex gap-3 overflow-x-auto p-3 scroll-smooth">
        
        {[1, 2, 3, 4, 5].map((story) => (
          <div
            key={story}
            className="flex flex-col items-center min-w-[70px]"
          >
            
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