import React from "react";

const plans = [
  {
    duration: "1 Month",
    actual: "₹999",
    prelaunch: "₹499",
    coupon: "₹199",
  },
  {
    duration: "3 Months",
    actual: "₹2999",
    prelaunch: "₹1499",
    coupon: "₹499",
  },
  {
    duration: "12 Months",
    actual: "₹9999",
    prelaunch: "₹4999",
    coupon: "₹1999",
  },
];

export default function SubscriptionPlansCard({ onSubscribe }) {
  return (
    <div className="bg-gradient-to-br from-yellow-400/90 via-yellow-200/80 to-white/60 rounded-2xl shadow-xl p-8 my-8">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-3xl">💎</span>
        <h3 className="text-2xl font-bold text-gray-900">Subscription Plans</h3>
      </div>
      <div className="flex flex-col gap-6 my-6">
        {plans.map((plan, idx) => (
          <div key={idx} className="flex flex-col md:flex-row items-center bg-white/80 rounded-lg shadow p-4">
            <div className="w-32 font-bold text-gray-800">{plan.duration}</div>
            <div className="flex-1 flex flex-row justify-between w-full md:w-auto">
              <div className="px-4 py-2 text-gray-500">
                <div className="text-xs">Actual Price</div>
                <div className="font-semibold">{plan.actual}</div>
              </div>
              <div className="px-4 py-2 text-yellow-700">
                <div className="text-xs">Pre-Launch Price</div>
                <div className="font-semibold">{plan.prelaunch}</div>
              </div>
              <div className="px-4 py-2 text-green-700">
                <div className="text-xs">Exclusive Coupon</div>
                <div className="font-semibold">{plan.coupon}</div>
              </div>
            </div>
            <button
              className="ml-0 md:ml-6 mt-3 md:mt-0 bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-2 rounded-lg shadow"
              onClick={onSubscribe}
            >
              Choose
            </button>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-700 font-medium text-center">
        All plans include full access to premium features, events, and rewards.
      </div>
    </div>
  );
}