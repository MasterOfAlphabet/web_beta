import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu as MenuIcon,
  User,
  LogOut,
  UserCircle,
  UserCog
} from "lucide-react";

import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

// Replace with your actual authentication logic
const isSignedIn = false; // <-- Set to true to see profile dropdown
const user = { name: "Aanya", avatar: "" }; // Optionally: avatar URL

const navItems = [
  { label: "Home", path: "/" },
  { label: "Hub", path: "/hub" },
  { label: "Challenges", path: "/challenges" },
  { label: "Winners", path: "/winners" },
  { label: "Leaderboards", path: "/leaderboards" },
];

export default function MenuBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const closeMenu = () => setMobileOpen(false);

  // Firebase sign out function
  async function handleSignOut() {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-30">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo - Left */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-pink-400 flex items-center justify-center font-extrabold text-2xl text-white shadow">
            MOA
          </div>
          <span className="hidden sm:inline font-extrabold text-xl tracking-wide text-gray-800">
            Master of Alphabet
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`px-3 py-1 rounded font-semibold transition 
                ${location.pathname === item.path
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Controls - Right */}
        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/signin"
                className="text-blue-700 hover:underline font-semibold px-2"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-pink-500 text-white px-4 py-1.5 rounded-xl font-bold shadow hover:bg-pink-600 transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded-xl transition"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border-2 border-pink-400" />
                ) : (
                  <UserCircle className="w-8 h-8 text-pink-400" />
                )}
                <span className="font-bold text-gray-700">{user.name}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-lg min-w-[180px] z-50 animate-fade-in">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserCog className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 text-red-600 font-semibold border-t"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Burger */}
          <button
            className="block md:hidden rounded-full p-2 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open menu"
          >
            <MenuIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-40"
          onClick={closeMenu}
        >
          <nav
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg flex flex-col z-50 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-2"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-pink-400 flex items-center justify-center font-extrabold text-xl text-white shadow">
                  MOA
                </div>
                <span className="font-extrabold text-lg tracking-wide text-gray-800">
                  Master of Alphabet
                </span>
              </Link>
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <MenuIcon className="w-6 h-6 text-gray-700 rotate-90" />
              </button>
            </div>
            <div className="flex-1 flex flex-col py-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={closeMenu}
                  className={`px-6 py-2 font-semibold transition
                    ${location.pathname === item.path
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
              {!isSignedIn ? (
                <div className="flex items-center gap-2 px-6 py-4">
                  <Link
                    to="/signin"
                    onClick={closeMenu}
                    className="text-blue-700 hover:underline font-semibold px-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="bg-pink-500 text-white px-4 py-1.5 rounded-xl font-bold shadow hover:bg-pink-600 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="px-6 py-2 flex items-center gap-2 font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="px-6 py-2 flex items-center gap-2 font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <UserCog className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-6 py-2 flex items-center gap-2 w-full font-semibold text-red-600 hover:bg-red-50 border-t transition"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-6px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.14s cubic-bezier(.4,0,.2,1);
        }
        @keyframes slide-in {
          from { transform: translateX(-100%);}
          to { transform: translateX(0);}
        }
        .animate-slide-in {
          animation: slide-in 0.19s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </header>
  );
}