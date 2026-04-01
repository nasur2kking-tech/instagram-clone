import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";

// ✅ TEMP PAGES
const Search = () => <div className="text-white p-4">Search Page</div>;
const Reels = () => <div className="text-white p-4">Reels Page</div>;
const Messages = Chat;

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>

      {/* ✅ DEFAULT ROUTE FIX */}
      <Route
        path="/"
        element={
          token ? <Navigate to="/home" /> : <Navigate to="/register" />
        }
      />

      {/* 🔓 PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 PROTECTED ROUTES */}

      {/* HOME */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* CREATE */}
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />

      {/* NOTIFICATIONS */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* MESSAGES */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />

      {/* SEARCH */}
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />

      {/* REELS */}
      <Route
        path="/reels"
        element={
          <ProtectedRoute>
            <Reels />
          </ProtectedRoute>
        }
      />

      {/* OPTIONAL CHAT */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      {/* 🚨 FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;