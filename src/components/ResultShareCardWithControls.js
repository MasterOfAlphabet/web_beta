import React, { useState } from "react";
import UniversalResultShareCard from "./UniversalResultShareCard";
import { useDownloadableCardImage } from "./useDownloadableCardImage";

/**
 * ResultShareCardWithControls
 * -------------------------------------------
 * Self-contained, universal social/certificate result card component.
 * Features:
 *  - Mode switcher: Certificate, WhatsApp Status, Insta Post
 *  - Live preview (auto resizes for each format)
 *  - Magic download button for selected mode
 *  - All data passed as props; easy to drop into any page
 * 
 * Props:
 *  - All UniversalResultShareCard props (student info, avatar, badge, etc.)
 *  - showControls (default: true): show mode switcher and download button
 *  - initialMode: "certificate" | "social" | "insta" (default: "certificate")
 *  - certificateLabel, whatsappLabel, instaLabel: overrides for tab labels
 *  - className: for outer container
 */

const MODE_OPTIONS = [
  {
    key: "certificate",
    label: "Certificate",
    desc: "Wide, formal, printable certificate",
    accentColor: "#4f46e5",
    previewSize: "w-[380px] md:w-[600px]",
    logo: "/logo192.png",
  },
  {
    key: "social",
    label: "WhatsApp Status",
    desc: "Portrait, 9:16 ratio for WhatsApp",
    accentColor: "#16a34a",
    previewSize: "w-[380px] h-[675px]",
    logo: undefined,
  },
  {
    key: "insta",
    label: "Insta Post",
    desc: "Square, 1:1 ratio for Instagram",
    accentColor: "#ec4899",
    previewSize: "w-[380px] h-[380px] md:w-[600px] md:h-[600px]",
    logo: undefined,
  },
];

export default function ResultShareCardWithControls({
  showControls = true,
  initialMode = "certificate",
  certificateLabel,
  whatsappLabel,
  instaLabel,
  className = "",
  ...cardProps
}) {
  const [mode, setMode] = useState(initialMode);
  const { cardRef, downloadCertificate, downloadSocial, downloadInsta } = useDownloadableCardImage();

  // Customizable labels
  const modeConfig = MODE_OPTIONS.map((m) => ({
    ...m,
    label:
      m.key === "certificate"
        ? certificateLabel || m.label
        : m.key === "social"
        ? whatsappLabel || m.label
        : m.key === "insta"
        ? instaLabel || m.label
        : m.label,
  })).find((m) => m.key === mode);

  const handleDownload = () => {
    if (mode === "certificate") downloadCertificate();
    else if (mode === "social") downloadSocial();
    else if (mode === "insta") downloadInsta();
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Controls */}
      {showControls && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center mb-4">
            {MODE_OPTIONS.map((m) => {
              const label =
                m.key === "certificate"
                  ? certificateLabel || m.label
                  : m.key === "social"
                  ? whatsappLabel || m.label
                  : m.key === "insta"
                  ? instaLabel || m.label
                  : m.label;
              return (
                <button
                  key={m.key}
                  className={`px-7 py-2.5 rounded-full font-bold border-2 transition 
                    ${mode === m.key
                      ? "bg-white border-blue-700 text-blue-700 shadow"
                      : "bg-blue-100 border-blue-200 text-blue-800 hover:bg-white"
                    }`}
                  title={m.desc}
                  onClick={() => setMode(m.key)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="flex justify-center gap-4 text-xs text-gray-500 min-h-[24px]">
            {MODE_OPTIONS.map(m => (
              <span key={m.key} className={`${mode === m.key ? "font-bold text-blue-700" : ""}`}>
                {mode === m.key && m.desc}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Live Card Preview */}
      <div
        className={`flex justify-center items-center bg-white rounded-2xl shadow-2xl p-4 ${modeConfig.previewSize}`}
        style={{
          transition: "width 0.2s, height 0.2s",
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <UniversalResultShareCard
          ref={cardRef}
          mode={mode === "certificate" ? "certificate" : "social"}
          {...cardProps}
          accentColor={modeConfig.accentColor}
          logo={modeConfig.logo}
          bgColor="#fff"
          watermark="MoA Learning"
          style={
            mode === "insta"
              ? { width: 600, height: 600 }
              : mode === "social"
              ? { width: 380, height: 675 }
              : { width: 600 }
          }
        />
      </div>
      {/* Download Button */}
      {showControls && (
        <div className="mt-8">
          <button
            className="px-10 py-3 rounded-full bg-blue-600 hover:bg-blue-800 text-white font-bold text-lg shadow-lg transition"
            onClick={handleDownload}
          >
            Download {modeConfig.label} Image
          </button>
        </div>
      )}
    </div>
  );
}