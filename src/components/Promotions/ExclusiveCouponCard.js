import React from "react";

export default function ExclusiveCouponCard({ couponCode = "PREMIUM5" }) {
  return (
    <div className="bg-gradient-to-br from-blue-600/90 via-blue-400/80 to-cyan-200/60 rounded-2xl shadow-xl p-8 flex flex-col justify-between h-full min-h-[260px]">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🎟️</span>
          <h3 className="text-2xl font-bold text-white">Exclusive Coupon</h3>
        </div>
        <div className="text-3xl font-extrabold text-yellow-200 mb-2">More than 50% OFF</div>
        <p className="text-white/90 text-lg mb-2">
          Apply this coupon on top of the Pre-Launch Promotion for even greater savings!
        </p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="bg-white/80 text-blue-900 font-bold px-6 py-2 rounded-lg tracking-widest text-lg shadow-lg border border-blue-100 select-all">
          {couponCode}
        </span>
        <button className="bg-blue-800/90 text-white px-4 py-2 rounded font-bold shadow hover:bg-blue-900 transition-all">
          Copy Code
        </button>
      </div>
    </div>
  );
}