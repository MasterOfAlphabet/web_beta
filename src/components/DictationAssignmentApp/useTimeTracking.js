import { useState, useEffect, useRef } from 'react';

export const useTimeTracking = () => {
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState(null);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const startSession = () => {
    const now = Date.now();
    setSessionStartTime(now);
    setIsActive(true);
    setIsPaused(false);
  };

  const endSession = () => {
    setIsActive(false);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startQuestionTimer = (questionIndex) => {
    setCurrentQuestionStartTime(Date.now());
  };

  const endQuestionTimer = (questionIndex, isCorrect) => {
    if (currentQuestionStartTime) {
      const questionTime = Date.now() - currentQuestionStartTime;
      setQuestionTimes(prev => [...prev, {
        questionIndex,
        time: questionTime,
        isCorrect,
        timestamp: new Date().toISOString()
      }]);
      setCurrentQuestionStartTime(null);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetTracking = () => {
    setSessionStartTime(null);
    setTotalSessionTime(0);
    setCurrentQuestionStartTime(null);
    setQuestionTimes([]);
    setIsActive(false);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isActive && !isPaused && sessionStartTime) {
      intervalRef.current = setInterval(() => {
        setTotalSessionTime(Date.now() - sessionStartTime);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused, sessionStartTime]);

  const getStats = () => {
    if (questionTimes.length === 0) {
      return {
        averageTimePerQuestion: 0,
        fastestQuestion: 0,
        slowestQuestion: 0,
        accuracyRate: 0,
        totalQuestions: 0
      };
    }
    const times = questionTimes.map(q => q.time);
    const correctAnswers = questionTimes.filter(q => q.isCorrect).length;
    return {
      averageTimePerQuestion: times.reduce((a, b) => a + b, 0) / times.length,
      fastestQuestion: Math.min(...times),
      slowestQuestion: Math.max(...times),
      accuracyRate: (correctAnswers / questionTimes.length) * 100,
      totalQuestions: questionTimes.length
    };
  };

  return {
    sessionStartTime,
    totalSessionTime,
    currentQuestionStartTime,
    questionTimes,
    isActive,
    isPaused,
    startSession,
    endSession,
    startQuestionTimer,
    endQuestionTimer,
    togglePause,
    resetTracking,
    getStats
  };
};