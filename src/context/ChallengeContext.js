import React, { createContext, useContext, useState } from "react";

const ChallengeContext = createContext();

export function ChallengeProvider({ children }) {
  const [studentInfo, setStudentInfo] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);

  return (
    <ChallengeContext.Provider value={{
      studentInfo,
      setStudentInfo,
      challengeResult,
      setChallengeResult
    }}>
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenge() {
  return useContext(ChallengeContext);
}