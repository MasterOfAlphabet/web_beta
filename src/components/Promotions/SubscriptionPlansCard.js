import React, { useState } from "react";

const plans = [
  {
    id: 1,
    duration: "1 Month",
    period: "Monthly",
    actual: "₹999",
    actualValue: 999,
    prelaunch: "₹499",
    prelaunchValue: 499,
    coupon: "₹199",
    couponValue: 199,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    popular: false,
    savings: 80
  },
  {
    id: 3,
    duration: "3 Months",
    period: "Quarterly",
    actual: "₹2999",
    actualValue: 2999,
    prelaunch: "₹1499",
    prelaunchValue: 1499,
    coupon: "₹499",
    couponValue: 499,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    popular: false,
    savings: 83
  },
  {
    id: 12,
    duration: "12 Months",
    period: "Yearly",
    actual: "₹9999",
    actualValue: 9999,
    prelaunch: "₹4999",
    prelaunchValue: 4999,
    coupon: "₹1999",
    couponValue: 1999,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    popular: true,
    bestValue: true,
    savings: 80
  },
];

export default function SubscriptionPlansCard({ onSubscribe }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    if (onSubscribe) {
      onSubscribe(plan);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl">💎</span>
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
        </div>
        <p className="text-gray-700 text-lg font-medium">Unlock premium features with our flexible subscription options</p>
      </div>

      {/* Pricing Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4 p-6">
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900">Pricing Tier</h3>
            </div>
            <div className="text-center relative">
              <h3 className="text-lg font-bold text-blue-700">1 Month</h3>
              <div className="text-xs text-gray-600 mt-1">Monthly</div>
            </div>
            <div className="text-center relative">
              <h3 className="text-lg font-bold text-purple-700">3 Months</h3>
              <div className="text-xs text-gray-600 mt-1">Quarterly</div>
              <div className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded-md text-xs font-bold mt-1">
                POPULAR
              </div>
            </div>
            <div className="text-center relative">
              <h3 className="text-lg font-bold text-emerald-700">12 Months</h3>
              <div className="text-xs text-gray-600 mt-1">Yearly</div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ⭐ BEST VALUE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {/* Actual Price Row */}
          <div className="grid grid-cols-4 gap-4 p-6 items-center hover:bg-gray-50 transition-all duration-300">
            <div className="text-left">
              <h4 className="text-lg font-bold text-gray-700 mb-1">Actual Price</h4>
              <div className="text-xs text-gray-500">Original pricing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400 line-through">₹999</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400 line-through">₹2999</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400 line-through">₹9999</div>
            </div>
          </div>

          {/* Pre-Launch Price Row */}
          <div className="grid grid-cols-4 gap-4 p-6 items-center hover:bg-gray-50 transition-all duration-300">
            <div className="text-left">
              <h4 className="text-lg font-bold text-yellow-700 mb-1">Pre-Launch Price</h4>
              <div className="text-xs text-yellow-600">Limited time offer</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">₹499</div>
              <div className="text-xs text-green-600 font-semibold mt-1">Save 50%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">₹1499</div>
              <div className="text-xs text-green-600 font-semibold mt-1">Save 50%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">₹4999</div>
              <div className="text-xs text-green-600 font-semibold mt-1">Save 50%</div>
            </div>
          </div>

          {/* Exclusive Coupon Row */}
          <div className="grid grid-cols-4 gap-4 p-6 items-center bg-green-50 border-l-4 border-green-400">
            <div className="text-left">
              <h4 className="text-lg font-bold text-green-700 mb-1">Exclusive Coupon</h4>
              <div className="text-xs text-green-600 font-medium">Best deal available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">₹199</div>
              <div className="text-xs text-green-600 font-semibold mb-2">Save 80%</div>
              <button
                onClick={() => handlePlanSelect(plans[0])}
                className={`w-full px-4 py-2 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 ${
                  selectedPlan?.id === 1
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
                }`}
              >
                {selectedPlan?.id === 1 ? 'Selected ✓' : 'Choose'}
              </button>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">₹499</div>
              <div className="text-xs text-green-600 font-semibold mb-2">Save 83%</div>
              <button
                onClick={() => handlePlanSelect(plans[1])}
                className={`w-full px-4 py-2 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 ${
                  selectedPlan?.id === 3
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                }`}
              >
                {selectedPlan?.id === 3 ? 'Selected ✓' : 'Choose'}
              </button>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">₹1999</div>
              <div className="text-xs text-green-600 font-semibold mb-2">Save 80%</div>
              <button
                onClick={() => handlePlanSelect(plans[2])}
                className={`w-full px-4 py-2 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 ${
                  selectedPlan?.id === 12
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300'
                }`}
              >
                {selectedPlan?.id === 12 ? 'Selected ✓' : 'Choose'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Footer */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            All plans include:
          </h3>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <span className="font-medium">Full Premium Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <span className="font-medium">Exclusive Events</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <span className="font-medium">Priority Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <span className="font-medium">Rewards Program</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Plan Summary */}
      {selectedPlan && (
        <div className="mt-6 bg-white border-2 border-green-300 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">Selected Plan: </span>
              <span className="font-bold text-gray-800">{selectedPlan.duration}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Final Price</div>
              <div className="text-xl font-bold text-green-600">
                {selectedPlan.coupon}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}