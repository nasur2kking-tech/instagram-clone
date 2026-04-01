import {
  Home,
  Search,
  Clapperboard,
  MessageCircle,
  Heart,
  PlusSquare,
  User,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  // ✅ FIX: active helper supports /home
  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`hidden md:flex flex-col justify-between h-screen border-r border-gray-800 p-4 fixed bg-black text-white transition-all duration-300
      ${isOpen ? "w-[240px]" : "w-[80px]"}`}
    >
      
      {/* LOGO + TOGGLE */}
      <div className="flex items-center justify-between mb-10">
        <Link to="/home">
          <h1 className="text-2xl font-bold tracking-wide cursor-pointer">
            {isOpen ? "Instagram" : "IG"}
          </h1>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xl"
        >
          ☰
        </button>
      </div>

      {/* MENU */}
      <div className="space-y-4 text-[16px]">

        {/* HOME */}
        <Link to="/home">
          <div
            className={`flex items-center ${
              isOpen ? "gap-4" : "justify-center"
            } p-2 rounded-lg transition ${
              isActive("/home") ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <Home />
            {isOpen && <span>Home</span>}
          </div>
        </Link>

        {/* SEARCH */}
        <Link to="/search">
          <div
            className={`flex items-center ${
              isOpen ? "gap-4" : "justify-center"
            } p-2 rounded-lg transition ${
              isActive("/search") ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <Search />
            {isOpen && <span>Search</span>}
          </div>
        </Link>

        {/* REELS */}
        <Link to="/reels">
          <div
            className={`flex items-center ${
              isOpen ? "gap-4" : "justify-center"
            } p-2 rounded-lg transition ${
              isActive("/reels") ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <Clapperboard />
            {isOpen && <span>Reels</span>}
          </div>
        </Link>

        {/* MESSAGES */}
        <Link to="/messages">
          <div
            className={`flex items-center ${
              isOpen ? "gap-4" : "justify-center"
            } p-2 rounded-lg transition ${
              isActive("/messages") ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <MessageCircle />
            {isOpen && <span>Messages</span>}
          </div>
        </Link>

        {/* NOTIFICATIONS */}
        <Link to="/notifications">
          <div
            className={`flex items-center ${
              isOpen ? "gap-4" : "justify-center"
            } p-2 rounded-lg transition ${
              isActive("/notifications") ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <Heart />
            {isOpen && <span>Notifications</span>}
          </div>
        </Link>

        {/* CREATE */}
        <Link to="/create">
          <div
            className={`flex items-center ${
              isOpen ? "gap-4" : "justify-center"
            } p-2 rounded-lg transition ${
              isActive("/create") ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <PlusSquare />
            {isOpen && <span>Create</span>}
          </div>
        </Link>

        {/* PROFILE */}
        <Link to="/profile">
          <div
            className={`flex items-center ${
              isOpen ? "gap-4" : "justify-center"
            } p-2 rounded-lg transition ${
              isActive("/profile") ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <User />
            {isOpen && <span>Profile</span>}
          </div>
        </Link>

      </div>

      {/* FOOTER */}
      <div className="text-gray-400 text-sm hover:text-white cursor-pointer text-center">
        {isOpen ? "More" : "..."}
      </div>

    </div>
  );
}