import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ChallengeSubmissionPage.css";

// Helper for WhatsApp sharing
const getWhatsAppShareUrl = (challengeTitle, classGroup) => {
  const text = encodeURIComponent(
    `I just took the "${challengeTitle}" challenge for ${classGroup} at Master of Alphabet! Think you can beat me? Try now: https://masterofalphabet.web.app/challenge/rookie/${encodeURIComponent(classGroup)}`
  );
  return `https://wa.me/?text=${text}`;
};

export default function ChallengeSubmissionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentName, challenge } = location.state || {};

  if (!studentName || !challenge) {
    // If required data missing, redirect to home
    navigate("/");
    return null;
  }

  return (
    <div className="challenge-thankyou-root">
      <div className="challenge-thankyou-card">
        <h2>
          Thank you, {studentName}!
        </h2>
        <p>
          Your answer for <strong>{challenge.category}</strong> challenge (
          {challenge.classGroup}) has been submitted.<br />
          Winners will be announced soon.<br />
          <strong>Invite your friends to compete and win!</strong>
        </p>
        <a
          className="challenge-thankyou-share-btn"
          href={getWhatsAppShareUrl(challenge.questionText, challenge.classGroup)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Share on WhatsApp"
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            style={{ width: 32, height: 32, verticalAlign: "middle", marginRight: 8 }}
          />
          Share Challenge on WhatsApp
        </a>
        <button
          className="challenge-thankyou-home-btn"
          onClick={() => navigate("/")}
        >
          Go to Challenges Home
        </button>
      </div>
    </div>
  );
}