import React, { useContext, useEffect } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { loggedInUser } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  // Redirect to signin if not logged in
  useEffect(() => {
    if (loggedInUser === null) {
      navigate("/signin");
    }
  }, [loggedInUser, navigate]);

  // While loading or redirecting, render nothing (or loader)
  if (!loggedInUser) {
    return null;
  }

  // Helper for initials
  const getInitials = (name = "") =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const profileData = [
    { icon: "📧", label: "Email", value: loggedInUser.email },
    { icon: "🎓", label: "Class", value: loggedInUser.class },
    { icon: "👤", label: "Gender", value: loggedInUser.gender },
    { icon: "🏙️", label: "City", value: loggedInUser.city },
    { icon: "🗺️", label: "District", value: loggedInUser.district },
    { icon: "📍", label: "State", value: loggedInUser.state },
    { icon: "🏫", label: "School", value: loggedInUser.school },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex justify-center items-start py-8 px-4 min-h-screen">
        <div className="max-w-4xl w-full flex flex-col gap-6">
          {/* Header card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 mb-0">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 shadow-2xl">
                  <div className="w-full h-full rounded-full border-4 border-white/20 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold select-none overflow-hidden">
                    {loggedInUser.avatar ? (
                      <img
                        src={loggedInUser.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      getInitials(loggedInUser.name)
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg" title="Online">
                  <div className="w-full h-full bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                  {loggedInUser.name}
                </h1>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-4">
                  {loggedInUser.subscriptionStatus === "active" && (
                    <div className="relative group">
                      <span className="px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-sm shadow-lg border border-green-300/50 backdrop-blur-sm">
                        ⭐ Premium Member
                      </span>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md"></div>
                    </div>
                  )}
                  {loggedInUser.subscriptionStatus === "trial" && (
                    <div className="relative group">
                      <span className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm shadow-lg border border-yellow-300/50 backdrop-blur-sm">
                        🚀 Trial User
                      </span>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md"></div>
                    </div>
                  )}
                </div>
                <p className="text-gray-300 text-lg">Welcome to your profile dashboard</p>
              </div>
            </div>
          </div>

          {/* Profile Info Box */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Profile Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {profileData.map((item, index) => (
                <ProfileCard key={item.label} item={item} index={index} />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                onClick={() => navigate("/dashboard")}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🏠 Go to Dashboard
                </span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </button>
              <button 
                className="group relative px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
                onClick={() => alert("Edit Profile")}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  ⚙️ Edit Profile
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ item, index }) {
  return (
    <div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 hover:bg-white/15 transition-all duration-300 group hover:shadow-2xl hover:scale-105 min-w-0"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-300 text-sm uppercase tracking-wider mb-1">
            {item.label}
          </h3>
          <p className="text-white text-lg font-bold break-words">
            {item.value || <span className="text-gray-400 italic">Not specified</span>}
          </p>
        </div>
      </div>
    </div>
  );
}