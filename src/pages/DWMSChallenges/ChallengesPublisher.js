import React, { useEffect, useState, useMemo } from "react";
import { 
  getDoc,
  doc,
  setDoc, // Add this
  updateDoc,
  Timestamp,
  collection,
  getDocs,
  serverTimestamp // Add this
} from "firebase/firestore";
import { auth, firestore } from "../../services/firebase";
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Zap,
  Trophy,
  BookOpen,
  Target,
  Rocket,
  Star,
  Filter,
  Search,
  X,
  ChevronDown,
  Users,
  Brain,
  HelpCircle,
  Grid,
  List,
  Eye,
  Settings,
  Calendar,
  User,
  Hash,
  Clock,
  Plus,
  Check,
  ChevronRight,
} from "lucide-react";

export default function ChallengesPublisher() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Challenge configuration state
  const [challengeType, setChallengeType] = useState("Daily");
  const [module, setModule] = useState("Spelling");

  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");

  // Filter states
  const [selectedClassGroup, setSelectedClassGroup] = useState("all");
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("all");
  const [selectedAnswerType, setSelectedAnswerType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Derived data
  const [classGroups, setClassGroups] = useState([]);
  const [modules, setModules] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [answerTypes, setAnswerTypes] = useState([]);

  // Filter states
  const [selectedPublishedStatus, setSelectedPublishedStatus] = useState("all");
  const [selectedChallengeTypes, setSelectedChallengeTypes] = useState("all");
  const [selectedPublishedCount, setSelectedPublishedCount] = useState("all");

  // Add these with your other state declarations
  const [publishedStatuses] = useState(["Yes", "No"]);
  const [challengeTypesUsed, setChallengeTypesUsed] = useState([]);
  const [publishedCounts] = useState(["0", "1", "2", "3", ">3"]);

  const [selectedmoduleName, setSelectedmoduleName] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [moduleNames, setmoduleNames] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  const [currentModule, setCurrentModule] = useState("Not Selected");

  const now = new Date();
  const [scheduledDate, setScheduledDate] = useState(
    now.toISOString().split("T")[0]
  );
  const [scheduledTime, setScheduledTime] = useState(
    `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`
  );
  const [endDate, setEndDate] = useState(now.toISOString().split("T")[0]);
  const [endTime, setEndTime] = useState("23:59");

  // Extract answer type from question ID
  const extractAnswerType = (questionId) => {
    if (!questionId) return "Unknown";

    const idLower = questionId.toLowerCase();
    if (idLower.includes("mcq")) return "Multiple Choice";
    if (idLower.includes("tf") || idLower.includes("truefalse"))
      return "True/False";
    if (idLower.includes("short") || idLower.includes("sa"))
      return "Short Answer";
    if (idLower.includes("essay") || idLower.includes("long")) return "Essay";
    if (idLower.includes("fill") || idLower.includes("blank"))
      return "Fill in the Blank";

    return "Multiple Choice"; // Default fallback
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "MoAChallenges", "DWMSChallenges", "Questions")
        );

        const questionsData = [];
        querySnapshot.forEach((doc) => {
          questionsData.push({ id: doc.id, ...doc.data() });
        });

        const questionsWithAnswerTypes = questionsData.map((question) => ({
          ...question,
          answerType: extractAnswerType(question.id),
        }));

        setQuestions(questionsWithAnswerTypes);

        // Extract ALL unique values for filters
        setClassGroups(
          [...new Set(questionsData.map((q) => q.classGroup))].sort()
        );
        setModules([...new Set(questionsData.map((q) => q.category))].sort());
        setSkillLevels(
          [...new Set(questionsData.map((q) => q.difficultyLevel))].sort()
        );
        setAnswerTypes(
          [...new Set(questionsWithAnswerTypes.map((q) => q.answerType))].sort()
        );
        setmoduleNames(
          [...new Set(questionsData.map((q) => q.moduleName))].sort()
        );
        setCategories(
          [...new Set(questionsData.map((q) => q.category))].sort()
        );
        setChallengeTypesUsed(
          [
            ...new Set(
              questionsData.flatMap((q) => q.challengeTypesUsed || [])
            ),
          ].sort()
        );
      } catch (e) {
        console.error("Error fetching questions:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesClassGroup =
        selectedClassGroup === "all" ||
        question.classGroup === selectedClassGroup;
      const matchesModule =
        selectedModule === "all" || question.category === selectedModule;
      const matchesSkillLevel =
        selectedSkillLevel === "all" ||
        question.difficultyLevel === selectedSkillLevel;
      const matchesAnswerType =
        selectedAnswerType === "all" ||
        question.answerType === selectedAnswerType;
      const matchesPublishedStatus =
        selectedPublishedStatus === "all" ||
        (selectedPublishedStatus === "Yes"
          ? question.isPublished
          : !question.isPublished);
      const matchesChallengeTypes =
        selectedChallengeTypes === "all" ||
        (question.challengeTypesUsed || []).includes(selectedChallengeTypes);
      const matchesPublishedCount =
        selectedPublishedCount === "all" ||
        (selectedPublishedCount === ">3"
          ? question.publishedCount > 3
          : question.publishedCount === parseInt(selectedPublishedCount));
      const matchesmoduleName =
        selectedmoduleName === "all" ||
        question.moduleName === selectedmoduleName;
      const matchesCategory =
        selectedCategory === "all" || question.category === selectedCategory;
      const matchesSearch =
        searchTerm === "" ||
        question.questionText
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        question.category.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        matchesClassGroup &&
        matchesModule &&
        matchesSkillLevel &&
        matchesAnswerType &&
        matchesPublishedStatus &&
        matchesChallengeTypes &&
        matchesPublishedCount &&
        matchesmoduleName &&
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    questions,
    selectedClassGroup,
    selectedModule,
    selectedSkillLevel,
    selectedAnswerType,
    selectedPublishedStatus,
    selectedChallengeTypes,
    selectedPublishedCount,
    selectedmoduleName,
    selectedCategory,
    searchTerm,
  ]);

  // Get selection limit based on challenge type
  const getSelectionLimit = () => {
    switch (challengeType) {
      case "Daily":
        return 1;
      case "Weekly":
        return 2;
      case "Monthly":
        return 5;
      case "Special":
        return 10;
      default:
        return 1;
    }
  };

  // Corrected toggleQuestionSelection function
  const toggleQuestionSelection = (questionId) => {
    const limit = getSelectionLimit();

    if (!selectedQuestions.includes(questionId)) {
      if (selectedQuestions.length >= limit) {
        setLimitMessage(
          `Maximum ${limit} question${
            limit !== 1 ? "s" : ""
          } allowed for ${challengeType} challenges`
        );
        setShowLimitModal(true);
        return;
      }
    }

    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Select all filtered questions with limit check
  const selectAllQuestions = () => {
    const limit = getSelectionLimit();
    const availableQuestions = filteredQuestions.slice(0, limit);

    if (filteredQuestions.length > limit) {
      setLimitMessage(
        `Only ${limit} question${
          limit !== 1 ? "s" : ""
        } can be selected for ${challengeType} challenges`
      );
      setShowLimitModal(true);
      setSelectedQuestions(availableQuestions.map((q) => q.id));
    } else {
      setSelectedQuestions(filteredQuestions.map((q) => q.id));
    }
  };

  // Clear all selections
  const clearAllQuestions = () => {
    setSelectedQuestions([]);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedClassGroup("all");
    setSelectedModule("all");
    setSelectedSkillLevel("all");
    setSelectedAnswerType("all");
    setSelectedPublishedStatus("all");
    setSelectedChallengeTypes("all");
    setSelectedPublishedCount("all");
    setSearchTerm("");
    setSelectedmoduleName("all");
    setSelectedCategory("all");
  };

  // Publish challenge
  const handlePublishChallenge = async () => {
  if (selectedQuestions.length === 0) return;

  setPublishing(true);

  try {
    // 1. Get metadata from first selected question
    const firstQuestion = questions.find(q => q.id === selectedQuestions[0]);
    const classGroup = (firstQuestion?.classGroup || "ClassI-II").replace(/\s+/g, '');
    const moduleName = firstQuestion?.moduleName || module;
    const moduleCategory = (firstQuestion?.category || "Dictation").replace(/\s+/g, '');

    // 2. Get or create counter
    const counterRef = doc(
      firestore,
      "MoAChallenges", 
      "DWMSChallenges",
      "ChallengeCounters",
      `${challengeType}_${moduleName}`
    );

    const counterSnap = await getDoc(counterRef);
    let sequenceNumber = 1;

    if (counterSnap.exists()) {
      sequenceNumber = counterSnap.data().count + 1;
      await updateDoc(counterRef, { count: sequenceNumber });
    } else {
      await setDoc(counterRef, { 
        type: challengeType,
        moduleName,
        count: sequenceNumber 
      });
    }

    // 3. Generate challenge ID
    const challengeId = `${classGroup}_${challengeType}_${moduleName}_${moduleCategory}_${
      sequenceNumber.toString().padStart(3, '0')}`;

    // 4. Prepare challenge data
    const challengeData = {
      title: challengeTitle,
      description: challengeDescription,
      type: challengeType,
      moduleName,
      moduleCategory,
      skillLevel: firstQuestion?.difficultyLevel || "Beginner",
      classGroup: firstQuestion?.classGroup || "Class I-II",
      status: "published",
      questions: selectedQuestions,
      schedule: {
        start: Timestamp.fromDate(new Date(`${scheduledDate}T${scheduledTime}:00`)),
        end: Timestamp.fromDate(new Date(`${endDate}T${endTime}:00`))
      },
      createdAt: serverTimestamp()
    };

    // 5. Save to Firestore
    await setDoc(
      doc(firestore, "MoAChallenges", "DWMSChallenges", "Challenges", challengeId),
      challengeData
    );

    // 6. Success handling
    setShowPublishModal(false);
    setSelectedQuestions([]);
    setAlertMessage(`${challengeType} Challenge Published! (ID: ${challengeId})`);
    setShowAlert(true);

  } catch (error) {
    console.error("Publish error:", error);
    setAlertMessage(`Publish failed: ${error.message}`);
    setShowAlert(true);
  } finally {
    setPublishing(false);
  }
};
  const getCategoryIcon = (category) => {
    const icons = {
      Science: <Zap className="w-5 h-5" />,
      Math: <Target className="w-5 h-5" />,
      History: <BookOpen className="w-5 h-5" />,
      Literature: <Star className="w-5 h-5" />,
      Geography: <Rocket className="w-5 h-5" />,
      default: <Sparkles className="w-5 h-5" />,
    };
    return icons[category] || icons.default;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: "bg-green-500/20 text-green-400",
      Medium: "bg-yellow-500/20 text-yellow-400",
      Hard: "bg-red-500/20 text-red-400",
      Expert: "bg-purple-500/20 text-purple-400",
    };
    return colors[difficulty] || "bg-blue-500/20 text-blue-400";
  };

  const getPublishedStatusColor = (isPublished) => {
    return isPublished
      ? "bg-green-500/20 text-green-400"
      : "bg-gray-500/20 text-gray-400";
  };

  const renderQuestionAnswers = (question) => {
    if (!question.options && !question.answer) {
      return null;
    }

    if (question.options) {
      const optionEntries = Object.entries(question.options);
      return (
        <div className="mt-2 ml-6">
          <div className="grid grid-cols-2 gap-2">
            {optionEntries.map(([key, value]) => (
              <div
                key={key}
                className={`text-sm px-3 py-2 rounded ${
                  question.answer === key
                    ? "bg-green-500/20 text-green-300 border border-green-500/50"
                    : "text-white/60 border border-white/10"
                }`}
              >
                <span className="font-medium">{key}.</span> {value}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-2 ml-6">
        <div className="text-sm px-3 py-2 rounded bg-green-500/20 text-green-300 border border-green-500/50">
          <span className="font-medium">Answer:</span> {question.answer}
        </div>
      </div>
    );
  };

  const FilterDropdown = ({ label, value, onChange, options, icon: Icon }) => (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-white/60" />
        <span className="text-sm font-medium text-white/80">{label}</span>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
      >
        <option value="all" className="bg-gray-800 text-white">
          All {label}
        </option>
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-gray-800 text-white"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Alert Notification */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in zoom-in-95">
          <div className="bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            <span>{alertMessage}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            Challenge Publisher
          </h1>
          <p className="text-lg text-white/80">
            Select questions and create new challenges
          </p>
        </div>

        {/* Challenge Type Selector */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Challenge Type
              </label>
              <select
                value={challengeType}
                onChange={(e) => setChallengeType(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                disabled={selectedQuestions.length > 0}
              >
                <option value="Daily">Daily (Max: 1 question)</option>
                <option value="Weekly">Weekly (Max: 2 questions)</option>
                <option value="Monthly">Monthly (Max: 5 questions)</option>
                <option value="Special">Special (Max: 10 questions)</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-white/60">
                Current selection: {selectedQuestions.length} /{" "}
                {getSelectionLimit()}
              </span>
            </div>
          </div>
        </div>

        {/* Compact Selected Questions Bar */}
        {selectedQuestions.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-medium text-white">
                  {selectedQuestions.length} Question
                  {selectedQuestions.length !== 1 ? "s" : ""} Selected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAllQuestions}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Select All
                </button>
                <span className="text-white/20">|</span>
                <button
                  onClick={clearAllQuestions}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowPublishModal(true)}
                  className="ml-4 px-4 py-2 rounded-lg flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  <Rocket className="w-4 h-4" />
                  Create Challenge
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
            <p className="text-white/80 text-lg">Loading questions...</p>
          </div>
        ) : (
          <>
            {/* Filters Panel */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">
                  Filter Questions
                </h2>
                <div className="flex-1"></div>
                <button
                  onClick={clearFilters}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  />
                </div>
              </div>

              {/* Filter Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <FilterDropdown
                  label="Class Groups"
                  value={selectedClassGroup}
                  onChange={setSelectedClassGroup}
                  options={classGroups}
                  icon={Users}
                />
                {/* New Module Group dropdown */}
                <FilterDropdown
                  label="Module Groups"
                  value={selectedmoduleName}
                  onChange={setSelectedmoduleName}
                  options={moduleNames}
                  icon={Grid}
                />

                {/* New Category dropdown */}
                <FilterDropdown
                  label="Categories"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categories}
                  icon={List}
                />
                <FilterDropdown
                  label="Skill Levels"
                  value={selectedSkillLevel}
                  onChange={setSelectedSkillLevel}
                  options={skillLevels}
                  icon={Brain}
                />
                <FilterDropdown
                  label="Answer Types"
                  value={selectedAnswerType}
                  onChange={setSelectedAnswerType}
                  options={answerTypes}
                  icon={HelpCircle}
                />
                <FilterDropdown
                  label="Published Status"
                  value={selectedPublishedStatus}
                  onChange={setSelectedPublishedStatus}
                  options={["Yes", "No"]}
                  icon={CheckCircle}
                />
                <FilterDropdown
                  label="Challenge Types Used"
                  value={selectedChallengeTypes}
                  onChange={setSelectedChallengeTypes}
                  options={[...challengeTypesUsed]}
                  icon={Trophy}
                />
                <FilterDropdown
                  label="Times Published"
                  value={selectedPublishedCount}
                  onChange={setSelectedPublishedCount}
                  options={["0", "1", "2", "3", ">3"]}
                  icon={Hash}
                />
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-white/80">
                    Showing{" "}
                    <span className="font-bold text-blue-400">
                      {filteredQuestions.length}
                    </span>{" "}
                    of {questions.length} questions
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={selectAllQuestions}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Select All
                  </button>
                  <span className="text-white/20">|</span>
                  <button
                    onClick={clearAllQuestions}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Questions List */}
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  No questions found
                </h3>
                <p className="text-white/60">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className={`bg-white/5 backdrop-blur-sm border rounded-xl p-4 transition-all ${
                      selectedQuestions.includes(question.id)
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleQuestionSelection(question.id)}
                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                          selectedQuestions.includes(question.id)
                            ? "bg-purple-500 border-purple-500"
                            : "bg-white/5 border-white/20 hover:border-white/40"
                        }`}
                      >
                        {selectedQuestions.includes(question.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(question.category)}
                            <span className="text-sm font-medium text-white/80">
                              {question.category}
                            </span>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                              question.difficultyLevel
                            )}`}
                          >
                            {question.difficultyLevel}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                            {question.answerType}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">
                            {question.classGroup}
                          </span>

                          {typeof question.publishedCount === "number" && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                question.publishedCount > 0
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {question.publishedCount > 0
                                ? `Published ${question.publishedCount} time${
                                    question.publishedCount !== 1 ? "s" : ""
                                  }`
                                : "Unpublished"}
                            </span>
                          )}
                        </div>
                        <p className="text-white/90">{question.questionText}</p>
                        {renderQuestionAnswers(question)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {showLimitModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-400/30 rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-white">
                  Selection Limit Reached
                </h3>
              </div>
              <p className="text-white/80 mb-6">{limitMessage}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="px-4 py-2 bg-red-500/90 hover:bg-red-500 text-white rounded-lg transition-all"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Publish Challenge Modal */}
        {showPublishModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl max-h-[95vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 border-b border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-t-3xl"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl">
                        <Rocket className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        Create New Challenge
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowPublishModal(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 text-white/60 hover:text-white group"
                    >
                      <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                  {/* Challenge Configuration */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Challenge Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Challenge Title
                        </label>
                        <input
                          type="text"
                          value={challengeTitle}
                          onChange={(e) => setChallengeTitle(e.target.value)}
                          placeholder="Enter challenge title"
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Challenge Description
                        </label>
                        <textarea
                          value={challengeDescription}
                          onChange={(e) =>
                            setChallengeDescription(e.target.value)
                          }
                          placeholder="Enter challenge description"
                          rows={3}
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                        />
                      </div>
                      <div className="space-y-6">
                        {/* Challenge Type and Module Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Challenge Type
                            </label>
                            <select
                              value={challengeType}
                              onChange={(e) => setChallengeType(e.target.value)}
                              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                            >
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Special">Special</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Module
                            </label>
                            <select
                              value={module}
                              onChange={(e) => setModule(e.target.value)}
                              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                            >
                              <option value="Spelling">Spelling</option>
                              <option value="Reading">Reading</option>
                              <option value="Pronunciation">
                                Pronunciation
                              </option>
                              <option value="Grammar">Grammar</option>
                              <option value="Writing">Writing</option>
                              <option value="Listening">Listening</option>
                              <option value="Vocabulary">Vocabulary</option>
                              <option value="S.H.A.R.P">S.H.A.R.P</option>
                              <option value="8-In-One">8-In-One</option>
                            </select>
                          </div>
                        </div>

                        {/* Date/Time Section with Header */}
                        <div className="bg-orange-900/20 border border-orange-400/20 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-orange-200 mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-300" />
                            Challenge Schedule
                          </h4>

                          <div className="space-y-4">
                            {/* Start Date/Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  value={scheduledDate}
                                  onChange={(e) =>
                                    setScheduledDate(e.target.value)
                                  }
                                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">
                                  Start Time
                                </label>
                                <input
                                  type="time"
                                  value={scheduledTime}
                                  onChange={(e) =>
                                    setScheduledTime(e.target.value)
                                  }
                                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white"
                                />
                              </div>
                            </div>

                            {/* End Date/Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">
                                  End Time
                                </label>
                                <input
                                  type="time"
                                  value={endTime}
                                  onChange={(e) => setEndTime(e.target.value)}
                                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Questions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        Selected Questions ({selectedQuestions.length})
                      </h3>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 max-h-60 overflow-y-auto">
                      {selectedQuestions.length === 0 ? (
                        <p className="text-white/60 text-center py-4">
                          No questions selected
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {questions
                            .filter((q) => selectedQuestions.includes(q.id))
                            .map((question) => (
                              <div
                                key={question.id}
                                className="bg-white/5 border border-white/10 rounded-lg p-3"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0">
                                    {getCategoryIcon(question.category)}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-white/90 text-sm">
                                      {question.questionText}
                                    </p>
                                    {renderQuestionAnswers(question)}
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                      <span
                                        className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                                          question.difficultyLevel
                                        )}`}
                                      >
                                        {question.difficultyLevel}
                                      </span>
                                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                                        {question.answerType}
                                      </span>
                                      <span
                                        className={`text-xs px-2 py-1 rounded-full ${getPublishedStatusColor(
                                          question.isPublished
                                        )}`}
                                      >
                                        {question.isPublished
                                          ? "Published"
                                          : "Unpublished"}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() =>
                                      toggleQuestionSelection(question.id)
                                    }
                                    className="text-white/60 hover:text-white"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-gradient-to-r from-slate-900/50 via-purple-900/50 to-slate-900/50">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setShowPublishModal(false)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePublishChallenge}
                      disabled={publishing || selectedQuestions.length === 0}
                      className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        publishing || selectedQuestions.length === 0
                          ? "bg-gray-600/50 text-white/50 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                      }`}
                    >
                      {publishing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Publishing...
                        </div>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4" />
                          Publish Challenge
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
