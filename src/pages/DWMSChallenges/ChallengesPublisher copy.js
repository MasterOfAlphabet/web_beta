import React, { useEffect, useState } from "react";
import { getDoc, doc, updateDoc, Timestamp } from "firebase/firestore";

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
} from "lucide-react";

export default function ChallengesPublisher() {
  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  // Filter states
  const [selectedClassGroup, setSelectedClassGroup] = useState("all");
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("all");
  const [selectedAnswerType, setSelectedAnswerType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // Derived data
  const [classGroups, setClassGroups] = useState([]);
  const [modules, setModules] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [answerTypes, setAnswerTypes] = useState([]);

  // Add this function to generate colors based on index
  const getCardGradient = (index) => {
    const gradients = [
      "from-blue-500/20 via-purple-500/20 to-pink-500/20",
      "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
      "from-orange-500/20 via-red-500/20 to-pink-500/20",
      "from-violet-500/20 via-purple-500/20 to-indigo-500/20",
      "from-lime-500/20 via-green-500/20 to-emerald-500/20",
      "from-rose-500/20 via-pink-500/20 to-purple-500/20",
      "from-amber-500/20 via-orange-500/20 to-red-500/20",
      "from-sky-500/20 via-blue-500/20 to-indigo-500/20",
    ];
    return gradients[index % gradients.length];
  };

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

  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const docRef = doc(firestore, "MoAChallenges", "DWMSChallenges");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const challengesData = docSnap.data().questions || [];

          // Add answer types to challenges
          const challengesWithAnswerTypes = challengesData.map((challenge) => ({
            ...challenge,
            answerType: extractAnswerType(challenge.id),
          }));

          setChallenges(challengesWithAnswerTypes);

          // Extract unique values for filters
          const uniqueClassGroups = [
            ...new Set(challengesWithAnswerTypes.map((c) => c.classGroup)),
          ].sort();
          const uniqueModules = [
            ...new Set(challengesWithAnswerTypes.map((c) => c.category)),
          ].sort();
          const uniqueSkillLevels = [
            ...new Set(challengesWithAnswerTypes.map((c) => c.difficultyLevel)),
          ].sort();
          const uniqueAnswerTypes = [
            ...new Set(challengesWithAnswerTypes.map((c) => c.answerType)),
          ].sort();

          setClassGroups(uniqueClassGroups);
          setModules(uniqueModules);
          setSkillLevels(uniqueSkillLevels);
          setAnswerTypes(uniqueAnswerTypes);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  // Filter challenges
  const filteredChallenges = challenges.filter((challenge) => {
    const matchesClassGroup =
      selectedClassGroup === "all" ||
      challenge.classGroup === selectedClassGroup;
    const matchesModule =
      selectedModule === "all" || challenge.category === selectedModule;
    const matchesSkillLevel =
      selectedSkillLevel === "all" ||
      challenge.difficultyLevel === selectedSkillLevel;
    const matchesAnswerType =
      selectedAnswerType === "all" ||
      challenge.answerType === selectedAnswerType;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "published" && challenge.published) ||
      (selectedStatus === "unpublished" && !challenge.published);
    const matchesSearch =
      searchTerm === "" ||
      challenge.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.category.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesClassGroup &&
      matchesModule &&
      matchesSkillLevel &&
      matchesAnswerType &&
      matchesStatus &&
      matchesSearch
    );
  });

  // Publish challenge
  const handlePublish = async (id) => {
    if (!selected) return;
    setPublishing(true);
    const updated = challenges.map((c) =>
      c.id === id
        ? {
            ...c,
            published: true,
            publishedAt: Timestamp.now(),
            publishedBy: "adminId",
          }
        : c
    );
    await updateDoc(doc(firestore, "MoAChallenges", "DWMSChallenges"), {
      questions: updated,
    });
    setChallenges(updated);
    setSelected({ ...selected, published: true });
    setPublishing(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedClassGroup("all");
    setSelectedModule("all");
    setSelectedSkillLevel("all");
    setSelectedAnswerType("all");
    setSelectedStatus("all");
    setSearchTerm("");
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
      Easy: "from-green-400 to-emerald-500",
      Medium: "from-yellow-400 to-orange-500",
      Hard: "from-red-400 to-pink-500",
      Expert: "from-purple-400 to-indigo-500",
    };
    return colors[difficulty] || "from-blue-400 to-cyan-500";
  };

  const getAnswerTypeIcon = (answerType) => {
    const icons = {
      "Multiple Choice": <CheckCircle className="w-4 h-4" />,
      "True/False": <Target className="w-4 h-4" />,
      "Short Answer": <BookOpen className="w-4 h-4" />,
      Essay: <Star className="w-4 h-4" />,
      "Fill in the Blank": <HelpCircle className="w-4 h-4" />,
      default: <HelpCircle className="w-4 h-4" />,
    };
    return icons[answerType] || icons.default;
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            Challenge Publisher
          </h1>
          <p className="text-lg text-white/80">
            Organize and publish educational challenges efficiently
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
            <p className="text-white/80 text-lg">Loading challenges...</p>
          </div>
        ) : (
          <>
            {/* Filters Panel */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">
                  Filter Challenges
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
                    placeholder="Search challenges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  />
                </div>
              </div>

              {/* Filter Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <FilterDropdown
                  label="Class Groups"
                  value={selectedClassGroup}
                  onChange={setSelectedClassGroup}
                  options={classGroups}
                  icon={Users}
                />
                <FilterDropdown
                  label="Modules"
                  value={selectedModule}
                  onChange={setSelectedModule}
                  options={modules}
                  icon={BookOpen}
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
                  label="Status"
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  options={["published", "unpublished"]}
                  icon={Settings}
                />
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-white/80">
                    Showing{" "}
                    <span className="font-bold text-blue-400">
                      {filteredChallenges.length}
                    </span>{" "}
                    of {challenges.length} challenges
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-blue-500/30 text-blue-400"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-blue-500/30 text-blue-400"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenges Grid/List */}
            {filteredChallenges.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  No challenges found
                </h3>
                <p className="text-white/60">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredChallenges.map((challenge, index) => (
                  <div
                    key={challenge.id}
                    onClick={() => setSelected(challenge)}
                    className="group cursor-pointer relative transform transition-all duration-300 hover:scale-105"
                  >
                    <div
                      className={`relative bg-gradient-to-br ${getCardGradient(
                        index
                      )} backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:bg-white/15 hover:ring-2 hover:ring-cyan-400/50`}
                    >
                      {challenge.published && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          Live
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
                          {getCategoryIcon(challenge.category)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">
                            {challenge.category}
                          </h3>
                          <p className="text-sm text-white/60">
                            ID: {challenge.id}
                          </p>
                        </div>
                      </div>

                      {/* Question Preview */}
                      <p className="text-white/90 mb-4 line-clamp-3 leading-relaxed">
                        {challenge.questionText}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs font-medium">
                          {challenge.classGroup}
                        </span>
                        <span
                          className={`px-3 py-1 bg-gradient-to-r ${getDifficultyColor(
                            challenge.difficultyLevel
                          )}/20 rounded-full text-xs font-medium text-white`}
                        >
                          {challenge.difficultyLevel}
                        </span>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-medium">
                          {challenge.answerType}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex items-center gap-2 text-sm ${
                            challenge.published
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {challenge.published ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Published
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4" />
                              Draft
                            </>
                          )}
                        </div>
                        <Eye className="w-4 h-4 text-white/60 group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Enhanced Challenge Details Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl max-h-[95vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              {/* Modal Background with Gradient */}
              <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl">
                {/* Header */}

                <div className="relative bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-4 border-b border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-t-3xl"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl">
                        {getCategoryIcon(selected.category)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                          {selected.category}
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-white/70">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {selected.classGroup}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {selected.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 text-white/60 hover:text-white group"
                    >
                      <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                  {/* Question Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Question</h3>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                      <p className="text-white/95 leading-relaxed text-lg">
                        {selected.questionText}
                      </p>
                    </div>
                  </div>
                  {/* Answer Options */}

                  {selected.options && selected.options.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          {getAnswerTypeIcon(selected.answerType)}
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          Answer Options
                        </h3>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs font-medium">
                          {selected.answerType}
                        </span>
                      </div>
                      <div className="grid gap-2">
                        {selected.options.map((option, idx) => (
                          <div
                            key={idx}
                            className={`relative p-3 rounded-lg border transition-all duration-200 ${
                              option === selected.correctAnswer
                                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                                    option === selected.correctAnswer
                                      ? "bg-green-400 text-white"
                                      : "bg-white/10 text-white/80"
                                  }`}
                                >
                                  {String.fromCharCode(65 + idx)}
                                </div>
                                <span
                                  className={`text-sm ${
                                    option === selected.correctAnswer
                                      ? "text-green-100 font-medium"
                                      : "text-white/90"
                                  }`}
                                >
                                  {option}
                                </span>
                              </div>
                              {option === selected.correctAnswer && (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Hint Section */}
                  {selected.hint && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <Sparkles className="w-5 h-5 text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Hint</h3>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-6">
                        <p className="text-yellow-100 italic leading-relaxed">
                          {selected.hint}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Metadata Section */}

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-400" />
                      Challenge Details
                    </h4>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          <span>
                            Difficulty:{" "}
                            <span className="font-medium text-white">
                              {selected.difficultyLevel}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4" />
                          <span>
                            Type:{" "}
                            <span className="font-medium text-white">
                              {selected.answerType}
                            </span>
                          </span>
                        </div>

                        {selected.published && selected.publishedAt && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              Published:{" "}
                              <span className="font-medium text-white">
                                {new Date(
                                  selected.publishedAt.toDate()
                                ).toLocaleDateString()}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      Publication Status
                    </h4>
                    <div className="space-y-2 text-white/80">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            selected.published
                              ? "bg-green-400"
                              : "bg-yellow-400"
                          }`}
                        ></div>
                        <span>
                          Status:{" "}
                          <span
                            className={`font-medium ${
                              selected.published
                                ? "text-green-400"
                                : "text-yellow-400"
                            }`}
                          >
                            {selected.published ? "Published" : "Draft"}
                          </span>
                        </span>
                      </div>
                      {selected.published && selected.publishedAt && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            Published:{" "}
                            <span className="font-medium text-white">
                              {new Date(
                                selected.publishedAt.toDate()
                              ).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Footer */}

              <div className="p-4 border-t border-white/10 bg-gradient-to-r from-slate-900/50 via-purple-900/50 to-slate-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(
                        selected.difficultyLevel
                      )}/20 text-white border border-white/10`}
                    >
                      {selected.difficultyLevel}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-medium border border-blue-400/20">
                      {selected.answerType}
                    </span>
                  </div>

                  {selected.published ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium text-sm">
                        Published & Live
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePublish(selected.id)}
                      disabled={publishing}
                      className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 shadow-lg shadow-pink-500/25 text-sm"
                    >
                      {publishing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Publishing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Rocket className="w-4 h-4" />
                          Publish Challenge
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
