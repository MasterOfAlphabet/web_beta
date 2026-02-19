import React, { forwardRef } from 'react';
import { Trophy, Award, Sparkles } from 'lucide-react';

const ResultShareCard = forwardRef(({ 
  name, 
  level,
  module = "Spelling",
  classLevel,
  date
}, ref) => {
  
  // Production data - will be replaced with real values
  const phoneNumber = "+91-98765-43210";
  const website = "www.MasterOfAlphabet.com";
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + encodeURIComponent("https://masterofalphabet.com/register");
  
  // Get level-specific data
  const getLevelData = (levelName) => {
    const levelMap = {
      "Rookie": { 
        emoji: "🎯", 
        color: "#ef4444", 
        bgGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      },
      "Racer": { 
        emoji: "⚡", 
        color: "#eab308", 
        bgGradient: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)"
      },
      "Master": { 
        emoji: "🌟", 
        color: "#22c55e", 
        bgGradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
      },
      "Prodigy": { 
        emoji: "💎", 
        color: "#3b82f6", 
        bgGradient: "linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)"
      },
      "Wizard": { 
        emoji: "🧙‍♂️", 
        color: "#8b5cf6", 
        bgGradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
      }
    };
    return levelMap[levelName] || levelMap["Master"];
  };

  const levelData = getLevelData(level);
  const currentDate = date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div 
      ref={ref}
      style={{
        width: '1080px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: '#ffffff',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        borderRadius: '24px',
        overflow: 'hidden'
      }}
    >
      {/* Main Achievement Section - No fixed height */}
      <div 
        style={{
          background: levelData.bgGradient,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 60px 40px',
          position: 'relative'
        }}
      >
        {/* Decorative sparkles */}
        <div style={{ position: 'absolute', top: '30px', left: '40px', fontSize: '50px', opacity: 0.2 }}>✨</div>
        <div style={{ position: 'absolute', top: '30px', right: '40px', fontSize: '50px', opacity: 0.2 }}>✨</div>
        <div style={{ position: 'absolute', bottom: '30px', left: '50px', fontSize: '40px', opacity: 0.15 }}>⭐</div>
        <div style={{ position: 'absolute', bottom: '30px', right: '50px', fontSize: '40px', opacity: 0.15 }}>⭐</div>

        {/* Logo */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '80px',
            padding: '12px 30px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Award size={28} color="#ffffff" strokeWidth={2.5} />
            <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '22px', letterSpacing: '0.5px' }}>
              MASTER OF ALPHABET
            </span>
          </div>
        </div>

        {/* Congratulations */}
        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Sparkles size={50} color="#fde047" fill="#fde047" />
          <h1 style={{ 
            fontSize: '70px', 
            fontWeight: 900, 
            color: '#ffffff', 
            margin: 0,
            lineHeight: 1,
            letterSpacing: '1px'
          }}>
            CONGRATULATIONS!
          </h1>
          <Sparkles size={50} color="#fde047" fill="#fde047" />
        </div>

        {/* Student Name & Grade */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '30px 70px',
          marginBottom: '25px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ 
            fontSize: '70px', 
            fontWeight: 900, 
            color: '#1f2937', 
            margin: 0,
            marginBottom: '8px',
            textAlign: 'center',
            lineHeight: 1
          }}>
            {name}
          </h2>
          <p style={{ 
            fontSize: '32px', 
            fontWeight: 700, 
            color: '#6b7280', 
            margin: 0,
            textAlign: 'center'
          }}>
            {classLevel}
          </p>
        </div>

        {/* "has achieved" */}
        <p style={{ fontSize: '32px', fontWeight: 600, color: '#ffffff', margin: '0 0 25px 0' }}>
          has achieved
        </p>

        {/* Level Badge */}
        <div style={{ position: 'relative', marginBottom: '25px' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '35px 70px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
            border: '6px solid #fbbf24',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '100px', marginBottom: '10px', lineHeight: 1 }}>
                {levelData.emoji}
              </div>
              <h3 style={{ 
                fontSize: '70px', 
                fontWeight: 900, 
                color: levelData.color, 
                margin: '0 0 5px 0',
                lineHeight: 1
              }}>
                {level.toUpperCase()}
              </h3>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#6b7280', margin: 0 }}>
                LEVEL
              </p>
            </div>
          </div>
          
          {/* Verified Seal */}
          <div style={{
            position: 'absolute',
            top: '-25px',
            right: '-20px',
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
            border: '4px solid #fde047'
          }}>
            <Trophy size={40} color="#ffffff" strokeWidth={2.5} />
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
              VERIFIED
            </span>
          </div>
        </div>

        {/* Module & Date */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <p style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>
            in {module} Skills
          </p>
          <p style={{ fontSize: '22px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
            {currentDate}
          </p>
        </div>
      </div>

      {/* Footer Section - No fixed height */}
      <div style={{
        background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
        padding: '30px 50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* FREE Health Check */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ 
            fontSize: '32px', 
            fontWeight: 900, 
            color: '#ffffff', 
            margin: '0 0 5px 0',
            lineHeight: 1.2
          }}>
            ✨ FREE Skills Health Check
          </p>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#e9d5ff', margin: 0 }}>
            (Limited Time)
          </p>
        </div>

        {/* All Modules */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ 
            fontSize: '18px', 
            fontWeight: 700, 
            color: '#f3e8ff', 
            margin: 0,
            lineHeight: 1.5
          }}>
            Spelling • Grammar • Reading • Writing • Listening • Pronunciation • Vocabulary • S.H.A.R.P
          </p>
        </div>

        {/* Contact & QR Code */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Contact Info */}
          <div>
            <p style={{ 
              fontSize: '22px', 
              fontWeight: 800, 
              color: '#ffffff', 
              margin: 0,
              whiteSpace: 'nowrap'
            }}>
              📱 {phoneNumber}
            </p>
            <p style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#e9d5ff', 
              margin: '5px 0 0',
              whiteSpace: 'nowrap'
            }}>
              🌐 {website}
            </p>
          </div>

          {/* QR Code */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '8px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
          }}>
            <img 
              src={qrCodeUrl}
              alt="Scan to Register"
              style={{ width: '90px', height: '90px', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

ResultShareCard.displayName = 'ResultShareCard';

export default ResultShareCard;