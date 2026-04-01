import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex">
      
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden lg:block w-[350px] p-4">
        <h2 className="text-gray-400">Suggestions</h2>
      </div>

    </div>
  );
}