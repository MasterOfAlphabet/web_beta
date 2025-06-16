import React, { forwardRef, useMemo } from "react";

/**
 * UniversalResultShareCard
 * -------------------------------------------
 * A flexible, Tailwind CSS-based card for results/achievements,
 * supporting both printable "Certificate" and compact "Social Share" (WhatsApp/Insta) modes.
 * 
 * PROPS:
 * - mode: "certificate" | "social" ("certificate" = wide, formal; "social" = compact, visually striking)
 * - name, score, total, module, badge, level, classLevel, city, school, date
 * - avatar: image URL or emoji
 * - meta: array of { label, value }
 * - summary: section-wise/category performance (array of { label, value })
 * - logo: image url (for certificate mode)
 * - accentColor: CSS color for highlight (default: "#4f46e5")
 * - bgColor: background color (default: "#fff")
 * - watermark: faint text for branding (optional)
 * - style: custom style
 */

const UniversalResultShareCard = forwardRef(
  (
    {
      mode = "social",
      name = "",
      score = null,
      total = null,
      module = "",
      badge = "",
      level = "",
      classLevel = "",
      city = "",
      school = "",
      date = new Date().toLocaleDateString(),
      avatar = "",
      meta = [],
      summary = [],
      logo = "",
      accentColor = "#4f46e5",
      bgColor = "#fff",
      watermark = "",
      style = {},
      resultText = "",
    },
    ref
  ) => {
    // Compose meta info
    const metaData = useMemo(() => {
      const arr = [];
      if (classLevel) arr.push({ label: "Class", value: classLevel });
      if (school) arr.push({ label: "School", value: school });
      if (city) arr.push({ label: "City", value: city });
      if (date) arr.push({ label: "Date", value: date });
      return meta && meta.length ? [...arr, ...meta] : arr;
    }, [classLevel, school, city, date, meta]);

    // Certificate mode: wide, paper-like, logo, all details
    if (mode === "certificate") {
      return (
        <div
          ref={ref}
          className="w-[600px] max-w-full px-8 py-8 rounded-3xl shadow-2xl bg-white border border-gray-200 relative overflow-hidden"
          style={{
            fontFamily: "Inter, ui-sans-serif, system-ui",
            background: bgColor,
            ...style,
          }}
        >
          {/* Watermark */}
          {watermark && (
            <div className="absolute bottom-8 right-8 text-xs text-gray-300 font-bold opacity-60 z-10 pointer-events-none select-none">
              {watermark}
            </div>
          )}
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {logo && (
                <img
                  src={logo}
                  alt="Logo"
                  className="w-14 h-14 rounded-full border-2 border-gray-300 bg-gray-100"
                />
              )}
              <span
                className="text-2xl font-extrabold"
                style={{ color: accentColor }}
              >
                Certificate
              </span>
            </div>
            {badge && (
              <div
                className="px-4 py-1 rounded-full text-white font-bold shadow"
                style={{ background: accentColor, fontSize: 17 }}
              >
                {badge}
              </div>
            )}
          </div>
          <div className="h-1 w-full rounded bg-gradient-to-r from-blue-200 to-purple-200 mb-4" />
          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Student Info */}
            <div className="flex-1 bg-blue-50/80 rounded-xl p-5 flex flex-col items-center justify-center shadow-sm">
              {avatar && (
                avatar.startsWith("http") ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-2 border-white shadow mb-2 object-cover"
                  />
                ) : (
                  <span className="w-20 h-20 flex items-center justify-center text-6xl rounded-full bg-white border shadow mb-2">
                    {avatar}
                  </span>
                )
              )}
              <div className="text-2xl font-bold text-gray-800">{name}</div>
              {level && (
                <div
                  className="mt-1 px-3 py-0.5 rounded-full border font-medium text-base"
                  style={{
                    borderColor: accentColor,
                    color: accentColor,
                  }}
                >
                  {level}
                </div>
              )}
              <div className="mt-3 text-sm text-gray-600 flex flex-col gap-1">
                {metaData.map((m) => (
                  <span key={m.label}>
                    <span className="font-semibold">{m.label}:</span> {m.value}
                  </span>
                ))}
              </div>
            </div>
            {/* Right: Score/Details */}
            <div className="flex-1 flex flex-col justify-center gap-2">
              <div
                className="text-4xl font-extrabold mb-2"
                style={{ color: accentColor }}
              >
                {score} <span className="text-lg text-gray-500">/ {total}</span>
              </div>
              {resultText && (
                <div className="text-2xl font-bold text-green-600 mb-1">{resultText}</div>
              )}
              <div className="text-md text-gray-700 font-semibold mb-2">
                {module}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                {summary.map((cat) => (
                  <div
                    key={cat.label}
                    className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-800 font-semibold text-center"
                  >
                    {cat.label}: <span className="font-bold">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-8 flex justify-center">
            <span className="text-gray-400 text-xs font-semibold tracking-widest">
              Master of Alphabet • web.masterofalphabet.com
            </span>
          </div>
        </div>
      );
    }

    // --- "Social" Mode (WhatsApp/Insta): Compact, share-friendly ---
    return (
      <div
        ref={ref}
        className={`w-[380px] px-6 py-6 rounded-3xl shadow-2xl bg-white border border-gray-200 text-center relative overflow-hidden`}
        style={{
          fontFamily: "Inter, ui-sans-serif, system-ui",
          minHeight: "340px",
          background: bgColor,
          ...style,
        }}
      >
        {/* Accent ribbon */}
        <div
          className="absolute top-0 left-0 w-full h-2 rounded-t-3xl"
          style={{
            background: accentColor,
          }}
        />
        {/* Watermark */}
        {watermark && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-300 font-bold opacity-60 z-10 pointer-events-none select-none">
            {watermark}
          </div>
        )}
        {/* Badge */}
        {badge && (
          <div
            className="absolute top-3 right-4 px-3 py-1 text-xs font-bold rounded-full shadow"
            style={{
              background: accentColor,
              color: "white",
              letterSpacing: "0.01em",
            }}
          >
            {badge}
          </div>
        )}
        {/* Avatar */}
        <div className="flex justify-center mt-2 mb-2">
          {avatar &&
            (avatar.startsWith("http") ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full shadow border-2 border-white object-cover"
                style={{ background: "#f3f4f6" }}
              />
            ) : (
              <span className="w-16 h-16 flex items-center justify-center text-5xl rounded-full shadow border-2 border-white bg-white">
                {avatar}
              </span>
            ))}
        </div>
        {/* Name */}
        <div className="text-2xl font-bold text-gray-800 mt-1 mb-0.5">{name}</div>
        {/* Level/Emoji */}
        {level && (
          <div
            className="inline-block px-2 py-0.5 mb-2 rounded-full text-sm font-semibold"
            style={{
              background: "#f3f4f6",
              color: accentColor,
              border: `1.5px solid ${accentColor}`,
            }}
          >
            {level}
          </div>
        )}
        {/* Module */}
        {module && (
          <div className="text-sm text-gray-500 mb-1 font-semibold">{module}</div>
        )}
        {/* Meta info */}
        {metaData.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {metaData.map((m) => (
              <div
                key={m.label}
                className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium"
              >
                {m.label}: <span className="font-bold">{m.value}</span>
              </div>
            ))}
          </div>
        )}
        {/* Score */}
        {score !== null && total !== null && (
          <div className="text-4xl font-extrabold text-gray-900 mb-1" style={{ color: accentColor }}>
            {score} <span className="text-lg text-gray-500 font-semibold">/ {total}</span>
          </div>
        )}
        {/* Result Text */}
        {resultText && (
          <div className="text-lg font-semibold text-green-600 mb-2">{resultText}</div>
        )}
        {/* Section-wise summary */}
        {summary.length > 0 && (
          <div className="mb-2 flex flex-wrap justify-center gap-2">
            {summary.map((s) => (
              <div
                key={s.label}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-700 font-medium shadow"
              >
                {s.label}: <b>{s.value}</b>
              </div>
            ))}
          </div>
        )}
        {/* Brand */}
        <div className="absolute bottom-3 left-0 w-full flex justify-center">
          <span className="text-xs text-gray-400 tracking-wide font-semibold">
            Master of Alphabet • web.masterofalphabet.com
          </span>
        </div>
      </div>
    );
  }
);

export default UniversalResultShareCard;