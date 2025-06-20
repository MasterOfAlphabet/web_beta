import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu as MenuIcon,
  User,
  LogOut,
  UserCog,
  Bell,
  UserCircle
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthContext } from "../App";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Skills Hub", path: "/skills-hub" },
  { label: "Challenges", path: "/challenges" },
  { label: "Games", path: "/english-skills-building-games" },
  { label: "Winners", path: "/winners" },
  { label: "Leaderboards", path: "/leaderboards" },
];

export default function MenuBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext) || {};
  const user = loggedInUser || {};

  const isSignedIn = Boolean(loggedInUser);

  const closeMenu = () => setMobileOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  async function handleSignOut() {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      if (typeof setLoggedInUser === "function") {
        setLoggedInUser(null);
      }
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  const getDaysRemaining = () => {
    const remaining = user?.subscriptionDaysRemaining;
    return typeof remaining === "number" ? `${remaining} days left` : null;
  };

  const getInitials = () => {
    const name = user?.name || "U N";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-30">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-pink-400 flex items-center justify-center font-extrabold text-2xl text-white shadow">
            MOA
          </div>
          <span className="hidden sm:inline font-extrabold text-xl tracking-wide text-gray-800">
            Master of Alphabet
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`px-3 py-1 rounded font-semibold transition ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
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
            </>
          ) : (
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="relative group flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 hover:ring-4 ring-blue-200 transition duration-300"
              >
                <span className="text-sm font-bold text-blue-700 group-hover:scale-105 transform transition">
                  {getInitials()}
                </span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  !
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-lg min-w-[200px] z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b">
                    <p className="font-bold text-gray-800 text-sm">
                      {user.name || "Student"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Subscription:{" "}
                      <span className="capitalize font-semibold">
                        {user.subscriptionType || "trial"}
                      </span>
                    </p>
                    {user.subscriptionType === "premium" &&
                      typeof user.subscriptionDaysRemaining === "number" && (
                        <p className="text-xs text-pink-600 mt-1 font-medium">
                          Expires in {user.subscriptionDaysRemaining} day(s)
                        </p>
                      )}
                  </div>

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
              <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
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
                  className={`px-6 py-2 font-semibold transition ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-6 pt-4">
                {isSignedIn ? (
                  <button
                    onClick={handleSignOut}
                    className="text-red-600 font-semibold hover:bg-red-50 w-full text-left px-4 py-2 rounded"
                  >
                    <LogOut className="inline w-4 h-4 mr-2" /> Sign Out
                  </button>
                ) : (
                  <>
                    <Link to="/signin" className="block text-blue-700 py-2 font-semibold">
                      Sign In
                    </Link>
                    <Link to="/signup" className="block bg-pink-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-pink-600 transition">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-6px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}
