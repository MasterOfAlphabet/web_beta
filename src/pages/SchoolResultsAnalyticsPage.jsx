import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Award,
  Users,
  Download,
  Filter,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Trophy,
  Target,
  BookOpen,
  Mic,
  Headphones,
  PenTool,
  Eye,
  MessageSquare,
  FileText,
  Lightbulb,
  Building2,
  Star,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// MOCK DATA GENERATION (Replace with actual Firebase data)
// ══════════════════════════════════════════════════════════════════════════════

const modules = [
  { id: 1, name: "Spelling", icon: PenTool, color: "#8b5cf6" },
  { id: 2, name: "Reading", icon: Eye, color: "#f97316" },
  { id: 3, name: "Pronunciation", icon: Mic, color: "#ec4899" },
  { id: 4, name: "Grammar", icon: BookOpen, color: "#10b981" },
  { id: 5, name: "Writing", icon: FileText, color: "#ef4444" },
  { id: 6, name: "Listening", icon: Headphones, color: "#3b82f6" },
  { id: 7, name: "Vocabulary", icon: Lightbulb, color: "#f59e0b" },
  { id: 8, name: "S.H.A.R.P", icon: MessageSquare, color: "#a855f7" },
];

const generateMockData = (schoolName) => {
  const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const sections = ["A", "B", "C"];
  
  const gradeData = grades.map(grade => {
    const sectionData = sections.map(section => {
      const studentCount = 25 + Math.floor(Math.random() * 15);
      const students = Array.from({ length: studentCount }, (_, i) => ({
        id: `${grade}-${section}-${i + 1}`,
        name: ["Aarav", "Priya", "Arjun", "Sneha", "Rahul", "Kavya", "Rohan", "Isha"][Math.floor(Math.random() * 8)] + ` ${["Kumar", "Sharma", "Patel", "Singh", "Reddy"][Math.floor(Math.random() * 5)]}`,
        rollNumber: i + 1,
        section,
        moduleScores: modules.map(m => ({
          moduleId: m.id,
          moduleName: m.name,
          score: 60 + Math.floor(Math.random() * 40),
          totalQuestions: 30,
        })),
        overallScore: 0,
      }));
      
      // Calculate overall scores
      students.forEach(s => {
        s.overallScore = Math.round(
          s.moduleScores.reduce((sum, m) => sum + m.score, 0) / s.moduleScores.length
        );
      });
      
      const avgScore = Math.round(
        students.reduce((sum, s) => sum + s.overallScore, 0) / students.length
      );
      
      return {
        section,
        studentCount,
        students,
        avgScore,
        moduleAverages: modules.map(m => ({
          moduleId: m.id,
          moduleName: m.name,
          avg: Math.round(
            students.reduce((sum, s) => {
              const moduleScore = s.moduleScores.find(ms => ms.moduleId === m.id);
              return sum + (moduleScore ? moduleScore.score : 0);
            }, 0) / students.length
          ),
        })),
      };
    });
    
    const allStudents = sectionData.flatMap(s => s.students);
    const gradeAvg = Math.round(
      allStudents.reduce((sum, s) => sum + s.overallScore, 0) / allStudents.length
    );
    
    return {
      grade,
      sections: sectionData,
      totalStudents: allStudents.length,
      avgScore: gradeAvg,
      topPerformers: allStudents.sort((a, b) => b.overallScore - a.overallScore).slice(0, 3),
    };
  });
  
  return {
    schoolName,
    totalStudents: gradeData.reduce((sum, g) => sum + g.totalStudents, 0),
    grades: gradeData,
    overallAverage: Math.round(
      gradeData.reduce((sum, g) => sum + g.avgScore, 0) / gradeData.length
    ),
  };
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function SchoolResultsAnalyticsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const schoolName = location.state?.schoolName || "Demo Public School";
  const schoolData = useMemo(() => generateMockData(schoolName), [schoolName]);
  
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedModule, setSelectedModule] = useState("overall");

  // Filter data based on selections
  const filteredData = useMemo(() => {
    if (selectedGrade === "all") return schoolData.grades;
    
    const gradeData = schoolData.grades.find(g => g.grade === parseInt(selectedGrade));
    if (!gradeData) return [];
    
    if (selectedSection === "all") return [gradeData];
    
    const sectionData = gradeData.sections.find(s => s.section === selectedSection);
    return sectionData ? [{ ...gradeData, sections: [sectionData] }] : [];
  }, [schoolData, selectedGrade, selectedSection]);

  // Performance distribution
  const getPerformanceDistribution = () => {
    const allStudents = filteredData.flatMap(g => 
      g.sections.flatMap(s => s.students)
    );
    
    return {
      excellent: allStudents.filter(s => s.overallScore >= 90).length,
      good: allStudents.filter(s => s.overallScore >= 75 && s.overallScore < 90).length,
      average: allStudents.filter(s => s.overallScore >= 60 && s.overallScore < 75).length,
      needsAttention: allStudents.filter(s => s.overallScore < 60).length,
    };
  };

  const distribution = getPerformanceDistribution();

  // Module-wise averages
  const getModuleAverages = () => {
    const allStudents = filteredData.flatMap(g => 
      g.sections.flatMap(s => s.students)
    );
    
    return modules.map(m => {
      const scores = allStudents.flatMap(s => 
        s.moduleScores.filter(ms => ms.moduleId === m.id).map(ms => ms.score)
      );
      return {
        ...m,
        avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      };
    }).sort((a, b) => b.avg - a.avg);
  };

  const moduleAverages = getModuleAverages();

  // Top performers overall
  const getTopPerformers = () => {
    const allStudents = filteredData.flatMap(g => 
      g.sections.flatMap(s => s.students)
    );
    return allStudents.sort((a, b) => b.overallScore - a.overallScore).slice(0, 10);
  };

  const topPerformers = getTopPerformers();

  // Export to CSV
  const handleExportCSV = () => {
    const allStudents = schoolData.grades.flatMap(g => 
      g.sections.flatMap(s => 
        s.students.map(student => ({
          grade: g.grade,
          section: student.section,
          rollNumber: student.rollNumber,
          name: student.name,
          overallScore: student.overallScore,
          ...Object.fromEntries(
            student.moduleScores.map(m => [m.moduleName, m.score])
          ),
        }))
      )
    );
    
    const headers = ["Grade", "Section", "Roll", "Name", "Overall", ...modules.map(m => m.name)];
    const rows = allStudents.map(s => [
      s.grade,
      s.section,
      s.rollNumber,
      s.name,
      s.overallScore,
      ...modules.map(m => s[m.name] || 0),
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${schoolName.replace(/\s+/g, "_")}_Analytics.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-6 sm:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 shadow-lg">
                <Building2 size={32} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
                  {schoolName}
                </h1>
                <p className="text-gray-600 font-semibold">
                  School-Wide Analytics Dashboard
                </p>
              </div>
            </div>
            
            <button
              onClick={handleExportCSV}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-purple-600" />
              <span className="font-bold text-gray-700">Filters:</span>
            </div>
            
            <select
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value);
                setSelectedSection("all");
              }}
              className="px-4 py-2 border-2 border-purple-200 rounded-xl font-semibold focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">All Grades</option>
              {schoolData.grades.map(g => (
                <option key={g.grade} value={g.grade}>Grade {g.grade}</option>
              ))}
            </select>

            {selectedGrade !== "all" && (
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-4 py-2 border-2 border-purple-200 rounded-xl font-semibold focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="all">All Sections</option>
                {schoolData.grades
                  .find(g => g.grade === parseInt(selectedGrade))
                  ?.sections.map(s => (
                    <option key={s.section} value={s.section}>Section {s.section}</option>
                  ))}
              </select>
            )}

            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-4 py-2 border-2 border-purple-200 rounded-xl font-semibold focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="overall">Overall Performance</option>
              {modules.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <Users size={24} className="text-purple-600" />
              <span className="text-xs font-bold text-gray-500 uppercase">Total Students</span>
            </div>
            <div className="text-4xl font-black text-gray-900">
              {schoolData.totalStudents}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 size={24} className="text-blue-600" />
              <span className="text-xs font-bold text-gray-500 uppercase">Avg Score</span>
            </div>
            <div className="text-4xl font-black text-blue-600">
              {schoolData.overallAverage}%
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={24} className="text-green-600" />
              <span className="text-xs font-bold text-gray-500 uppercase">Top 10%</span>
            </div>
            <div className="text-4xl font-black text-green-600">
              {distribution.excellent}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-100">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle size={24} className="text-red-600" />
              <span className="text-xs font-bold text-gray-500 uppercase">Need Attention</span>
            </div>
            <div className="text-4xl font-black text-red-600">
              {distribution.needsAttention}
            </div>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-6 sm:p-8 mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Target size={28} className="text-purple-600" />
            Performance Distribution
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Excellent (90-100%)", count: distribution.excellent, color: "#10b981", icon: Trophy },
              { label: "Good (75-89%)", count: distribution.good, color: "#3b82f6", icon: Star },
              { label: "Average (60-74%)", count: distribution.average, color: "#f59e0b", icon: CheckCircle },
              { label: "Needs Attention (<60%)", count: distribution.needsAttention, color: "#ef4444", icon: AlertCircle },
            ].map((band, i) => {
              const Icon = band.icon;
              const percentage = Math.round((band.count / schoolData.totalStudents) * 100);
              return (
                <div key={i} className="border-2 rounded-2xl p-4" style={{ borderColor: `${band.color}40` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-lg p-2" style={{ backgroundColor: `${band.color}20` }}>
                      <Icon size={24} style={{ color: band.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-black" style={{ color: band.color }}>
                        {band.count}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">
                        {percentage}% of students
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-700">{band.label}</div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: band.color,
                        width: `${percentage}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module-wise Performance */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-6 sm:p-8 mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen size={28} className="text-purple-600" />
            Module-wise Averages
          </h2>
          
          <div className="space-y-4">
            {moduleAverages.map((module, i) => {
              const Icon = module.icon;
              return (
                <div key={module.id} className="flex items-center gap-4">
                  <div className="flex items-center gap-3 w-48">
                    <div className="rounded-lg p-2" style={{ backgroundColor: `${module.color}20` }}>
                      <Icon size={20} style={{ color: module.color }} />
                    </div>
                    <span className="font-bold text-gray-900">{module.name}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-8 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full flex items-center justify-end pr-3 text-white text-sm font-bold transition-all duration-500 rounded-full"
                          style={{ 
                            backgroundColor: module.color,
                            width: `${module.avg}%`
                          }}
                        >
                          {module.avg >= 20 && `${module.avg}%`}
                        </div>
                      </div>
                      <div className="w-16 text-right">
                        <span className="text-2xl font-black" style={{ color: module.color }}>
                          {module.avg}%
                        </span>
                      </div>
                      {i === 0 && (
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp size={20} />
                          <span className="text-xs font-bold">Highest</span>
                        </div>
                      )}
                      {i === moduleAverages.length - 1 && (
                        <div className="flex items-center gap-1 text-red-600">
                          <TrendingDown size={20} />
                          <span className="text-xs font-bold">Lowest</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
            <p className="text-sm text-gray-700 flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Recommendation:</strong> Focus intervention programs on <strong>{moduleAverages[moduleAverages.length - 1].name}</strong> (lowest average: {moduleAverages[moduleAverages.length - 1].avg}%)
              </span>
            </p>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-6 sm:p-8 mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Award size={28} className="text-yellow-500" />
            Top 10 Performers
          </h2>
          
          <div className="space-y-3">
            {topPerformers.map((student, i) => (
              <div key={student.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${i < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-black text-xl ${
                  i === 0 ? 'bg-yellow-400 text-yellow-900' :
                  i === 1 ? 'bg-gray-300 text-gray-700' :
                  i === 2 ? 'bg-orange-300 text-orange-900' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  #{i + 1}
                </div>
                
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{student.name}</div>
                  <div className="text-sm text-gray-600">
                    Grade {filteredData[0]?.grade || "N/A"} - Section {student.section} • Roll #{student.rollNumber}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {student.overallScore}%
                  </div>
                </div>
                
                {i < 3 && (
                  <Trophy 
                    size={32} 
                    className={
                      i === 0 ? 'text-yellow-500' :
                      i === 1 ? 'text-gray-400' :
                      'text-orange-400'
                    }
                    fill="currentColor"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Grade-wise Breakdown */}
        {selectedGrade === "all" && (
          <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-6 sm:p-8 mb-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              Grade-wise Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {schoolData.grades.map(grade => (
                <div 
                  key={grade.grade}
                  onClick={() => setSelectedGrade(grade.grade.toString())}
                  className="border-2 border-purple-100 rounded-2xl p-4 hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="text-center mb-3">
                    <div className="text-sm font-bold text-gray-600 mb-1">Grade {grade.grade}</div>
                    <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {grade.avgScore}%
                    </div>
                  </div>
                  
                  <div className="text-xs text-center text-gray-600 mb-2">
                    {grade.totalStudents} students
                  </div>
                  
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                      style={{ width: `${grade.avgScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-100 text-gray-900 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-gray-200 hover:scale-105 transition-all border-2 border-gray-200"
          >
            Back to Home
          </button>
          
          <button
            onClick={() => navigate("/schools/register")}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl"
          >
            Add More Students
          </button>
        </div>
      </div>
    </div>
  );
}
