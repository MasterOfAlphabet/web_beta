import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { firestore } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

import "../styles/ChallengeAttemptPage.css";

function renderQuestion(q, answer, setAnswer) {
  switch (q.type) {
    case "MCQ":
      return (
        <div className="challenge-question-block">
          <div className="challenge-question-text">{q.questionText}</div>
          <div className="challenge-options">
            {q.options.map((opt, idx) => (
              <label key={idx} className="challenge-option">
                <input
                  type="radio"
                  name="answer"
                  value={opt}
                  checked={answer === opt}
                  onChange={() => setAnswer(opt)}
                  required
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      );
    case "Dictation":
    case "Find the correct spelling":
    case "Find the missing letter":
    case "Unscramble":
    case "Spell the pic":
      return (
        <div className="challenge-question-block">
          <div className="challenge-question-text">{q.questionText}</div>
          <input
            className="challenge-answer-input"
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer"
            required
          />
        </div>
      );
    default:
      return <div>Unknown question type.</div>;
  }
}

export default function ChallengeAttemptPage() {
  const { classGroup } = useParams();
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state?.student;

  useEffect(() => {
    const fetchChallenge = async () => {
     
            const docRef = doc(firestore, "MoAChallenges", "DWMSChallenges");
            const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const allQuestions = docSnap.data().questions || [];
        const found = allQuestions.find(
          (q) =>
            q.classGroup === decodeURIComponent(classGroup) &&
            q.difficultyLevel === "Rookie"
        );
        setChallenge(found);
      }
      setLoading(false);
    };
    fetchChallenge();
  }, [classGroup]);

  if (!student) {
    // If student info missing, redirect to main page
    navigate("/");
    return null;
  }

  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!answer || !challenge) {
      setError("Please provide your answer.");
      return;
    }
    try {
      // Save to ChallengeSubmissions collection
      
      const submissionsRef = doc(
        firestore,
        "ChallengeSubmissions",
        `${Date.now()}_${student.name.replace(/\s/g, "")}_${challenge.classGroup.replace(/\s/g, "")}`
      );
      await submissionsRef.set({
        studentName: student.name,
        parentMobile: student.parentMobile,
        class: student.class,
        school: student.school,
        challengeId: challenge.id,
        challengeCategory: challenge.category,
        classGroup: challenge.classGroup,
        submittedAt: new Date().toISOString(),
        answer,
      });
      // Go to submission thank you screen, pass student name and challenge info
      navigate("/challenge/submitted", {
        state: {
          studentName: student.name,
          challenge,
        },
      });
    } catch (err) {
      setError("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="challenge-attempt-root">
      <div className="challenge-attempt-card">
        <h2>Challenge for {challenge?.classGroup}</h2>
        {loading && <div>Loading challenge...</div>}
        {!loading && !challenge && (
          <div>
            <em>Challenge not found.</em>
          </div>
        )}
        {!loading && challenge && (
          <form onSubmit={handleSubmit} className="challenge-attempt-form">
            {renderQuestion(challenge, answer, setAnswer)}
            {error && <div className="challenge-error">{error}</div>}
            <div className="challenge-attempt-actions">
              <button
                type="button"
                className="challenge-cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="challenge-submit-btn"
                disabled={!answer}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}