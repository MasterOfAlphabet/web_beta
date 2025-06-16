import React, { forwardRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { FiDownload, FiShare2, FiInstagram, FiMessageSquare } from 'react-icons/fi';

const SocialResultCard = forwardRef((props, ref) => {
  const {
    title = "Congratulations!",
    subtitle = "",
    avatar = "🎓",
    name = "Student Name",
    meta = [],
    score = 0,
    total = 100,
    resultText = "Excellent!",
    level = "Beginner",
    badge = "Achiever",
    accentColor = "#6366f1",
    watermark = "Powered by EduApp",
    style = {}
  } = props;

  const [activeFormat, setActiveFormat] = useState('certificate');
  const [isGenerating, setIsGenerating] = useState(false);

  // Format configurations
  const formats = {
    certificate: {
      label: "Certificate",
      icon: <FiDownload className="mr-2" />,
      dimensions: { width: 1200, height: 800 },
      previewClass: "aspect-[3/2]",
      description: "Perfect for printing and framing"
    },
    whatsapp: {
      label: "WhatsApp",
      icon: <FiMessageSquare className="mr-2" />,
      dimensions: { width: 1080, height: 1920 },
      previewClass: "aspect-[9/16]",
      description: "Optimized for status updates"
    },
    instagram: {
      label: "Instagram",
      icon: <FiInstagram className="mr-2" />,
      dimensions: { width: 1080, height: 1080 },
      previewClass: "aspect-square",
      description: "Ideal for square posts"
    }
  };

  // Dynamic card scaling
  const getCardStyle = useCallback(() => ({
    transform: `scale(${activeFormat === 'certificate' ? 0.6 : activeFormat === 'whatsapp' ? 0.4 : 0.5})`,
    transformOrigin: 'top left',
    width: '166%',
    height: '166%',
    backgroundColor: '#ffffff',
    fontFamily: '"Inter", sans-serif',
    ...style
  }), [activeFormat, style]);

  // Download handler
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const format = formats[activeFormat];
      const dataUrl = await toPng(ref.current, {
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        ...format.dimensions
      });

      const link = document.createElement('a');
      link.download = `${name}_${format.label}_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl">
      {/* Format Selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {Object.entries(formats).map(([key, { label, icon }]) => (
          <button
            key={key}
            onClick={() => setActiveFormat(key)}
            className={`flex items-center px-4 py-2 rounded-full font-medium transition-all ${
              activeFormat === key 
                ? 'text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            style={activeFormat === key ? { backgroundColor: accentColor } : {}}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className={`${formats[activeFormat].previewClass} relative mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200`}>
            <div 
              ref={ref}
              className="absolute top-0 left-0 w-full h-full p-8"
              style={getCardStyle()}
            >
              {/* Card Content */}
              <div className="relative h-full flex flex-col items-center justify-center">
                {/* Accent Bar */}
                <div 
                  className="absolute top-0 left-0 w-full h-3 rounded-t-xl"
                  style={{ backgroundColor: accentColor }}
                />

                {/* Badge */}
                <div 
                  className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full shadow"
                  style={{ backgroundColor: accentColor, color: 'white' }}
                >
                  {badge}
                </div>

                {/* Avatar */}
                <div className="w-24 h-24 flex items-center justify-center text-6xl rounded-full shadow-md border-4 border-white bg-white">
                  {avatar}
                </div>

                {/* Name */}
                <h1 className="mt-4 text-3xl font-bold text-gray-800">{name}</h1>

                {/* Level */}
                <span 
                  className="mt-2 px-4 py-1 text-sm font-semibold rounded-full border-2"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  {level}
                </span>

                {/* Title */}
                <h2 
                  className="mt-4 text-4xl font-extrabold text-center"
                  style={{ color: accentColor }}
                >
                  {title}
                </h2>

                {/* Subtitle */}
                {subtitle && (
                  <p className="mt-2 text-lg text-gray-500 font-medium">{subtitle}</p>
                )}

                {/* Score */}
                <div className="mt-6 text-center">
                  <span 
                    className="text-6xl font-black"
                    style={{ color: accentColor }}
                  >
                    {score}
                  </span>
                  <span className="text-2xl text-gray-500 font-semibold">/{total}</span>
                </div>

                {/* Result Text */}
                <p className="mt-4 text-2xl font-semibold text-green-600">{resultText}</p>

                {/* Meta Info */}
                {meta.length > 0 && (
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {meta.map((item, index) => (
                      <div 
                        key={index}
                        className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium"
                      >
                        {item.label}: <span className="font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Watermark */}
                <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">
                  {watermark}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Download Options</h3>
          <p className="text-gray-600 mb-6">{formats[activeFormat].description}</p>
          
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className={`w-full py-3 px-6 rounded-lg font-bold flex items-center justify-center transition-all ${
              isGenerating ? 'bg-gray-300' : 'hover:shadow-md'
            }`}
            style={isGenerating ? {} : { backgroundColor: accentColor, color: 'white' }}
          >
            <FiShare2 className="mr-2" />
            {isGenerating ? 'Generating...' : `Download ${formats[activeFormat].label}`}
          </button>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-1">Pro Tip</h4>
              <p className="text-sm text-blue-600">
                For best results on social media, use the <strong>Instagram</strong> format even when posting elsewhere.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-1">Format Details</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Certificate: {formats.certificate.dimensions.width}×{formats.certificate.dimensions.height}px</li>
                <li>• WhatsApp: {formats.whatsapp.dimensions.width}×{formats.whatsapp.dimensions.height}px</li>
                <li>• Instagram: {formats.instagram.dimensions.width}×{formats.instagram.dimensions.height}px</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SocialResultCard;