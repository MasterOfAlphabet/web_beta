import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Trophy,
  Download,
  CheckCircle,
  Building2,
  Map,
  MapPin,
  Globe2,
  Star,
  ArrowRight,
  Image as ImageIcon,
  Lock,
  Check,
  BookOpen,
  Mic,
  Headphones,
  PenTool,
  Eye,
  Lightbulb,
  MessageSquare,
  FileText,
  Target,
  Zap,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ResultShareCard from './ResultShareCard';
import ResultShareCardDetailed from './ResultShareCardDetailed';
import {
  CLUSTERS,
  SKILL_LEVELS,
  getWeakestCluster,
  getCategoriesForPractice,
  getPracticeRecommendations
} from './spellingData';

// All 8 modules
const ALL_MODULES = [
  { id: 1, name: "Spelling", icon: PenTool },
  { id: 2, name: "Reading", icon: Eye },
  { id: 3, name: "Pronunciation", icon: Mic },
  { id: 4, name: "Grammar", icon: BookOpen },
  { id: 5, name: "Writing", icon: FileText },
  { id: 6, name: "Listening", icon: Headphones },
  { id: 7, name: "Vocabulary", icon: Lightbulb },
  { id: 8, name: "S.H.A.R.P", icon: MessageSquare },
];

export default function ShareResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const assessmentResults = location.state?.assessmentResults || {};
  const studentData = location.state?.studentData || {};
  const rankingData = location.state?.rankingData || null;

  const [downloading, setDownloading] = useState(false);
  
  // Refs
  const shareCardRef = useRef(null);
  const shareCardDetailedRef = useRef(null);
  const pdfContentRef = useRef(null);

  // Data extraction
  const studentName = studentData.fullName || "---";
  const studentGrade = studentData.grade || "---";
  const schoolName = rankingData?.schoolName || studentData.schoolName || "---";
  const city = rankingData?.city || "---";
  const currentModule = assessmentResults.module || "Spelling";
  
  // Cluster data
  const clusterScores = assessmentResults.clusterScores || {};
  const spellingIndex = assessmentResults.spellingIndex || 0;
  const skillLevel = assessmentResults.skillLevel || SKILL_LEVELS[0];
  const allQuestions = assessmentResults.allQuestions || [];
  const answers = assessmentResults.answers || {};
  const rawScore = assessmentResults.score || 0;
  const totalQuestions = assessmentResults.totalQuestions || 30;
  
  const currentLevelIndex = SKILL_LEVELS.findIndex(level => level.name === skillLevel.name);

  // Get recommendations
  const weakestCluster = Object.keys(clusterScores).length > 0 ? getWeakestCluster(clusterScores) : null;
  const categoriesToPractice = weakestCluster && allQuestions.length > 0 
    ? getCategoriesForPractice(allQuestions, answers, clusterScores) 
    : [];
  const practiceRecommendations = weakestCluster ? getPracticeRecommendations(weakestCluster) : [];

  // Rankings
  const rankings = rankingData ? {
    school: { rank: 12, total: 145, percentile: 92 },
    district: { rank: 87, total: 1250, percentile: 93 },
    city: { rank: 342, total: 5600, percentile: 94 },
    state: { rank: 1205, total: 24800, percentile: 95 }
  } : null;

  // ═══════════════════════════════════════════════════════════════════════════
  // FIXED: Category scores calculation - properly handles All-in-One questions
  // ═══════════════════════════════════════════════════════════════════════════
  const getCategoryScoresByCluster = () => {
    const grouped = {
      recognition: [],
      phoneme: [],
      structuring: []
    };

    // Count questions by their actual cluster, not by category name
    const categoryMap = {};

    allQuestions.forEach(q => {
      const cluster = q.cluster;
      if (!cluster || !grouped[cluster]) return;

      // Use categoryName UNLESS it's "All-in-One", then use question type
      let displayName = q.categoryName;
      
      // Skip All-in-One label - we want actual question types
      if (displayName === "All-in-One") {
        // Determine actual type from question properties
        if (q.question && q.options) displayName = "MCQ (All-in-One)";
        else if (q.scrambled) displayName = "Unscramble (All-in-One)";
        else if (q.image) displayName = "Picture (All-in-One)";
        else if (q.word && q.hint) displayName = "Missing Letter (All-in-One)";
        else if (q.word) displayName = "Dictation (All-in-One)";
      }

      const key = `${cluster}-${displayName}`;
      
      if (!categoryMap[key]) {
        categoryMap[key] = {
          name: displayName,
          cluster,
          correct: 0,
          total: 0
        };
      }
      
      categoryMap[key].total++;
      if (answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase()) {
        categoryMap[key].correct++;
      }
    });

    // Group by cluster and calculate percentages
    Object.values(categoryMap).forEach(cat => {
      const percentage = cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
      grouped[cat.cluster].push({
        name: cat.name,
        correct: cat.correct,
        total: cat.total,
        percentage: percentage
      });
    });

    return grouped;
  };

  const categoryScoresByCluster = allQuestions.length > 0 ? getCategoryScoresByCluster() : {};

  // ═══════════════════════════════════════════════════════════════════════════
  // Download handlers
  // ═══════════════════════════════════════════════════════════════════════════
  const handleDownloadSimpleImage = async () => {
    setDownloading(true);
    try {
      if (!shareCardRef.current) {
        alert("Card not ready");
        setDownloading(false);
        return;
      }
      await new Promise(r => setTimeout(r, 100));
      const dataUrl = await toPng(shareCardRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement("a");
      link.download = `MoA-Result-${studentName.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
    setDownloading(false);
  };

  const handleDownloadDetailedImage = async () => {
    setDownloading(true);
    try {
      if (!shareCardDetailedRef.current) {
        alert("Card not ready");
        setDownloading(false);
        return;
      }
      await new Promise(r => setTimeout(r, 200));
      const dataUrl = await toPng(shareCardDetailedRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement("a");
      link.download = `MoA-Detailed-Report-${studentName.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
    setDownloading(false);
  };

  

  const getRankBadge = (percentile) => {
    if (percentile >= 95) return { emoji: "🥇", label: "Top 5%", color: "#FFD700" };
    if (percentile >= 90) return { emoji: "🥈", label: "Top 10%", color: "#C0C0C0" };
    if (percentile >= 75) return { emoji: "🥉", label: "Top 25%", color: "#CD7F32" };
    if (percentile >= 50) return { emoji: "⭐", label: "Above Average", color: "#8b5cf6" };
    return { emoji: "💪", label: "Keep Going!", color: "#10b981" };
  };

  const getClusterColor = (percentage) => {
    if (percentage >= 90) return '#10b981';
    if (percentage >= 75) return '#3b82f6';
    if (percentage >= 60) return '#eab308';
    return '#ef4444';
  };

// ─────────────────────────────────────────────────────────────────────────────
// DROP-IN REPLACEMENT — two bugs fixed:
//
// FIX 1 — WORD SPACING (words running together like "independenEnglish")
//   Root cause: html2canvas inherits letterSpacing and collapses word gaps.
//   Fix: wordSpacing:'normal' + letterSpacing:'normal' on every style object.
//
// FIX 2 — PAGE BREAK DOUBLING (line repeated with dark bar)
//   Root cause: old handler screenshotted the whole component as one tall image,
//   then sliced it at A4 height — any line sitting on a cut boundary got split
//   across two pages and appeared twice.
//   Fix: replace handleDownloadPDF with section-by-section rendering so each
//   <div> (page) becomes its own clean canvas. Paste the new handler too.
//
// HOW TO USE:
//   Step 1 — In ShareResultsPage.jsx, find and DELETE the old block:
//              const PDFContent = () => (   ← start here
//              ...
//              );                           ← delete up to and including this
//
//   Step 2 — PASTE this entire file in that spot (keep it inside the component)
//
//   Step 3 — Also REPLACE your handleDownloadPDF function with the one at the
//             BOTTOM of this file (search for "PASTE THIS HANDLER TOO")
// ─────────────────────────────────────────────────────────────────────────────


  // ── Style objects — wordSpacing + letterSpacing reset on everything ──────────
  const pdfStyles = {
    page: {
      width: '1200px',
      backgroundColor: '#ffffff',
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      margin: 0,
      padding: 0,
      color: '#1f2937',
      wordSpacing: 'normal',     // ← FIX: prevents word-collapse in html2canvas
      letterSpacing: 'normal',   // ← FIX: reset so tag's 0.05em doesn't bleed
    },
    section: (bg = '#ffffff') => ({
      padding: '80px 100px',
      backgroundColor: bg,
      position: 'relative',
      // NOTE: pageBreakAfter removed — page breaks now handled by the
      // section-by-section rendering in handleDownloadPDF
      wordSpacing: 'normal',
      letterSpacing: 'normal',
    }),
    divider: {
      height: '1px',
      backgroundColor: '#f3f4f6',
      margin: '48px 0',
    },
    tag: {
      display: 'inline-block',
      background: '#f3f0ff',
      color: '#7c3aed',
      borderRadius: '999px',
      padding: '4px 16px',
      fontSize: '13px',
      fontWeight: 700,
      letterSpacing: '0.05em',   // scoped to this element only
      wordSpacing: 'normal',     // prevent bleed outward
      textTransform: 'uppercase',
      marginBottom: '20px',
    },
    body: {
      fontSize: '20px',
      lineHeight: 1.8,
      color: '#4b5563',
      margin: '0 0 28px',
      wordSpacing: 'normal',
      letterSpacing: 'normal',
    },
    small: {
      fontSize: '15px',
      color: '#9ca3af',
      lineHeight: 1.6,
      wordSpacing: 'normal',
      letterSpacing: 'normal',
    },
  };

  // ── Module list ──────────────────────────────────────────────────────────────
  const moduleList = [
    { label: 'Spelling',      icon: '✏️' },
    { label: 'Reading',       icon: '👁️' },
    { label: 'Pronunciation', icon: '🎤' },
    { label: 'Grammar',       icon: '📝' },
    { label: 'Writing',       icon: '📄' },
    { label: 'Listening',     icon: '👂' },
    { label: 'Vocabulary',    icon: '📚' },
    { label: 'S.H.A.R.P',    icon: '🧩' },
  ];

  // ── Next level ───────────────────────────────────────────────────────────────
  const nextLevelData = currentLevelIndex < SKILL_LEVELS.length - 1
    ? SKILL_LEVELS[currentLevelIndex + 1] : null;
  const pointsNeeded = nextLevelData ? nextLevelData.min - spellingIndex : 0;

  // ── PDFContent component ─────────────────────────────────────────────────────
  const PDFContent = () => (
    <div ref={pdfContentRef} style={pdfStyles.page}>

      {/* ══════════════════════════════════════════════════════════
          PAGE 1 — The Letter
          Each top-level <div> here = one PDF page in the handler
      ══════════════════════════════════════════════════════════ */}
      <div style={pdfStyles.section('#faf5ff')}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '80px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            borderRadius: '16px', padding: '12px 20px',
            color: '#fff', fontWeight: 900, fontSize: '20px',
            letterSpacing: 'normal', wordSpacing: 'normal',
          }}>MoA</div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 800, color: '#1f2937', margin: 0, wordSpacing: 'normal', letterSpacing: 'normal' }}>
              Master of Alphabet
            </p>
            <p style={{ ...pdfStyles.small, margin: 0 }}>
              Independent English Skill Assessment
            </p>
          </div>
        </div>

        {/* Opening */}
        <p style={{ fontSize: '42px', fontWeight: 900, color: '#8b5cf6', marginBottom: '32px', wordSpacing: 'normal', letterSpacing: 'normal' }}>
          Dear Parent,
        </p>
        <p style={pdfStyles.body}>
          <strong>{studentName}</strong> just completed their{' '}
          <strong>{currentModule}</strong> skill health check, and we want to share
          something important with you — not just a score, but a real picture of
          where your child stands today.
        </p>
        <p style={pdfStyles.body}>
          School marks show performance. What you're about to read shows{' '}
          <em>development.</em>
        </p>

        <div style={pdfStyles.divider} />

        {/* Result card */}
        <div style={{
          background: '#ffffff', borderRadius: '32px', padding: '48px',
          border: '2px solid #ede9fe', display: 'flex',
          alignItems: 'center', gap: '48px', marginBottom: '60px',
          wordSpacing: 'normal', letterSpacing: 'normal',
        }}>
          <div style={{
            background: skillLevel.color, borderRadius: '24px',
            padding: '28px 36px', textAlign: 'center',
            minWidth: '160px', flexShrink: 0,
          }}>
            <div style={{ fontSize: '64px', marginBottom: '8px' }}>{skillLevel.icon}</div>
            <p style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: 0, wordSpacing: 'normal' }}>
              {skillLevel.name}
            </p>
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '52px', fontWeight: 900, color: '#1f2937', margin: '0 0 8px', wordSpacing: 'normal' }}>
              {studentName}
            </p>
            <p style={{ fontSize: '22px', color: '#6b7280', margin: '0 0 4px', wordSpacing: 'normal' }}>
              Grade {studentGrade} · {schoolName}
            </p>
            <p style={{ fontSize: '18px', color: '#9ca3af', margin: 0, wordSpacing: 'normal' }}>{city}</p>
            {nextLevelData && (
              <p style={{ fontSize: '17px', color: '#8b5cf6', marginTop: '20px', fontWeight: 600, wordSpacing: 'normal' }}>
                {pointsNeeded} more points to reach {nextLevelData.name} level
              </p>
            )}
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ ...pdfStyles.small, margin: '0 0 6px' }}>Spelling Index</p>
            <p style={{ fontSize: '80px', fontWeight: 900, color: '#8b5cf6', margin: 0, lineHeight: 1, wordSpacing: 'normal' }}>
              {spellingIndex}
            </p>
            <p style={{ ...pdfStyles.small, margin: '4px 0 0' }}>out of 100</p>
          </div>
        </div>

        {/* Framework line */}
        <p style={{ fontSize: '22px', color: '#9ca3af', fontStyle: 'italic', marginBottom: '12px', wordSpacing: 'normal', letterSpacing: 'normal' }}>
          Most assessments measure{' '}
          <span style={{ textDecoration: 'line-through' }}>syllabus coverage</span>.
        </p>
        <p style={{ fontSize: '30px', fontWeight: 800, color: '#7c3aed', marginBottom: '60px', wordSpacing: 'normal', letterSpacing: 'normal' }}>
          We measure Skill Level Progression.
        </p>

        {/* Modules — one line, no boxes, NO letterSpacing on wrapper */}
        <p style={{ fontSize: '15px', color: '#9ca3af', lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '0.06em', wordSpacing: 'normal', marginBottom: '20px' }}>
          Our 8-module framework covers
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 28px', wordSpacing: 'normal', letterSpacing: 'normal' }}>
          {moduleList.map((m) => (
            <span key={m.label} style={{
              fontSize: '17px',
              color: m.label === currentModule ? '#7c3aed' : '#6b7280',
              fontWeight: m.label === currentModule ? 700 : 400,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              wordSpacing: 'normal', letterSpacing: 'normal',
            }}>
              {m.icon} {m.label}
              {m.label === currentModule && (
                <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: 700 }}>✓</span>
              )}
            </span>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════
          PAGE 2 — Skill Breakdown
      ══════════════════════════════════════════════════════════ */}
      <div style={pdfStyles.section('#ffffff')}>
        <div style={pdfStyles.tag}>Skill Analysis</div>
        <p style={{ fontSize: '38px', fontWeight: 800, margin: '0 0 16px', wordSpacing: 'normal', letterSpacing: 'normal' }}>
          How {studentName} is developing
        </p>
        <p style={{ ...pdfStyles.body, maxWidth: '760px' }}>
          We evaluate {currentModule.toLowerCase()} through three underlying skill clusters.
          Each tells us something different about how {studentName} processes and encodes language.
        </p>

        <div style={pdfStyles.divider} />

        {Object.entries(clusterScores).map(([key, data]) => {
          const clusterInfo = CLUSTERS[key];
          const minPct = Math.min(...Object.values(clusterScores).map(c => c.percentage));
          const isWeakest = data.percentage === minPct;
          return (
            <div key={key} style={{ marginBottom: '52px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', wordSpacing: 'normal', letterSpacing: 'normal' }}>
                <div>
                  <p style={{ fontSize: '22px', fontWeight: 700, color: '#1f2937', margin: '0 0 4px', wordSpacing: 'normal' }}>
                    {clusterInfo.name}
                    {isWeakest && (
                      <span style={{
                        marginLeft: '12px', fontSize: '12px',
                        background: '#fef3c7', color: '#d97706',
                        borderRadius: '999px', padding: '2px 10px', fontWeight: 700,
                        wordSpacing: 'normal', letterSpacing: 'normal',
                      }}>Needs focus</span>
                    )}
                  </p>
                  <p style={{ fontSize: '15px', color: '#9ca3af', margin: 0, wordSpacing: 'normal' }}>
                    {data.correct} of {data.total} correct
                  </p>
                </div>
                <p style={{ fontSize: '28px', fontWeight: 900, color: isWeakest ? '#f59e0b' : '#22c55e', margin: 0 }}>
                  {data.percentage}%
                </p>
              </div>
              <div style={{ height: '14px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  width: `${data.percentage}%`, height: '100%', borderRadius: '999px',
                  background: isWeakest
                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                    : 'linear-gradient(90deg, #22c55e, #4ade80)',
                }} />
              </div>
            </div>
          );
        })}

        <div style={pdfStyles.divider} />

        {weakestCluster && (
          <div style={{ background: '#faf5ff', borderRadius: '24px', padding: '40px', borderLeft: '6px solid #8b5cf6', wordSpacing: 'normal', letterSpacing: 'normal' }}>
            <p style={{ fontSize: '26px', fontWeight: 700, color: '#7c3aed', margin: '0 0 12px', wordSpacing: 'normal' }}>
              What this means
            </p>
            <p style={{ ...pdfStyles.body, margin: 0 }}>
              The area that would unlock the biggest jump in {studentName}'s skill index
              is <strong>{CLUSTERS[weakestCluster.key]?.name}</strong>. This responds
              well to just 10 minutes of daily focused practice.
            </p>
          </div>
        )}
      </div>


      {/* ══════════════════════════════════════════════════════════
          PAGE 3 — Recommendations
      ══════════════════════════════════════════════════════════ */}
      {weakestCluster && practiceRecommendations.length > 0 && (
        <div style={pdfStyles.section('#fffbf5')}>
          <div style={pdfStyles.tag}>Your Action Plan</div>
          <p style={{ fontSize: '38px', fontWeight: 800, margin: '0 0 16px', wordSpacing: 'normal', letterSpacing: 'normal' }}>
            What to focus on next
          </p>
          <p style={{ ...pdfStyles.body, maxWidth: '720px' }}>
            Based on {studentName}'s results, here are three simple activities with
            the highest impact. None of these need expensive resources — just consistency.
          </p>

          <div style={pdfStyles.divider} />

          {practiceRecommendations.map((rec, i) => (
            <div key={i} style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '52px', wordSpacing: 'normal', letterSpacing: 'normal' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: '#fff', fontWeight: 900, fontSize: '22px',
                wordSpacing: 'normal',
              }}>{i + 1}</div>
              <div>
                <p style={{ fontSize: '22px', fontWeight: 700, color: '#1f2937', margin: '0 0 8px', wordSpacing: 'normal' }}>
                  {rec.title}
                </p>
                <p style={{ ...pdfStyles.body, margin: '0 0 8px' }}>{rec.description}</p>
                <p style={{ fontSize: '16px', color: '#7c3aed', fontStyle: 'italic', margin: 0, wordSpacing: 'normal' }}>
                  {rec.why}
                </p>
              </div>
            </div>
          ))}

          <div style={pdfStyles.divider} />

          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '40px', border: '1px solid #f3f4f6', wordSpacing: 'normal', letterSpacing: 'normal' }}>
            <p style={{ fontSize: '26px', fontWeight: 700, color: '#1f2937', margin: '0 0 12px', wordSpacing: 'normal' }}>
              What to expect
            </p>
            <p style={{ ...pdfStyles.body, margin: '0 0 16px' }}>
              With consistent practice, most children at this stage see a noticeable
              improvement within 3–6 weeks. The goal isn't to jump levels overnight —
              it's to build foundations that make the next level feel natural.
            </p>
            {nextLevelData && (
              <p style={{ ...pdfStyles.body, margin: 0 }}>
                {studentName} is currently at <strong>{spellingIndex} / 100</strong>.
                A focused effort could realistically reach{' '}
                <strong>{nextLevelData.min}+</strong> — the{' '}
                <strong>{nextLevelData.name}</strong> level.
              </p>
            )}
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════════════
          PAGE 4 — About / Closing
          No subscription boxes. Warm plain text only.
      ══════════════════════════════════════════════════════════ */}
      <div style={{ ...pdfStyles.section('#1f2937'), color: '#ffffff' }}>
        <div style={pdfStyles.tag}>About Us</div>
        <p style={{ fontSize: '38px', fontWeight: 800, color: '#ffffff', margin: '0 0 24px', wordSpacing: 'normal', letterSpacing: 'normal' }}>
          About Master of Alphabet
        </p>
        <p style={{ fontSize: '22px', color: '#d1d5db', lineHeight: 1.8, maxWidth: '760px', margin: '0 0 60px', wordSpacing: 'normal', letterSpacing: 'normal' }}>
          We are an independent English skill assessment framework — not a coaching
          centre, not a competition platform. Our only purpose is to help parents
          understand their child's true developmental stage, beyond school marks.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '80px', marginBottom: '80px', wordSpacing: 'normal', letterSpacing: 'normal' }}>
          {[['15,000+', 'Families trust us'], ['500+', 'School partners'], ['8', 'Skill modules']].map(([v, l]) => (
            <div key={l}>
              <p style={{ fontSize: '52px', fontWeight: 900, color: '#fbbf24', margin: '0 0 6px', wordSpacing: 'normal' }}>{v}</p>
              <p style={{ fontSize: '18px', color: '#9ca3af', margin: 0, wordSpacing: 'normal' }}>{l}</p>
            </div>
          ))}
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0 60px' }} />

        {/* Module list */}
        <p style={{ fontSize: '19px', color: '#9ca3af', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.06em', wordSpacing: 'normal' }}>
          Continue {studentName}'s journey across all 8 modules
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 32px', marginBottom: '72px', wordSpacing: 'normal', letterSpacing: 'normal' }}>
          {moduleList.map((m) => (
            <span key={m.label} style={{
              fontSize: '18px',
              color: m.label === currentModule ? '#a78bfa' : '#6b7280',
              fontWeight: m.label === currentModule ? 700 : 400,
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              wordSpacing: 'normal', letterSpacing: 'normal',
            }}>
              {m.icon} {m.label}
            </span>
          ))}
        </div>

        {/* Subscription — warm paragraph, no boxes, no prices */}
        <div style={{
          background: 'rgba(255,255,255,0.07)', borderRadius: '28px',
          padding: '48px', borderLeft: '6px solid #a78bfa', marginBottom: '60px',
          wordSpacing: 'normal', letterSpacing: 'normal',
        }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#e9d5ff', marginBottom: '20px', wordSpacing: 'normal' }}>
            What comes next — if you'd like to go further
          </p>
          <p style={{ fontSize: '20px', color: '#d1d5db', lineHeight: 1.9, margin: '0 0 20px', wordSpacing: 'normal' }}>
            The free health check gives you a clear starting point. For most families,
            a focused 3-month journey is enough to see a real shift — you'll notice
            the gaps closing and {studentName}'s confidence growing.
          </p>
          <p style={{ fontSize: '20px', color: '#d1d5db', lineHeight: 1.9, margin: '0 0 20px', wordSpacing: 'normal' }}>
            For children who want to explore all 8 modules and work through each
            level properly, a 12-month plan gives them the full growth cycle — with
            the time and space for skills to mature naturally.
          </p>
          <p style={{ fontSize: '20px', color: '#d1d5db', lineHeight: 1.9, margin: 0, wordSpacing: 'normal' }}>
            There's no pressure and no rush. The right time to go further is simply
            when {studentName} is ready — and this report is your starting point.
          </p>
        </div>

        {/* Contact + QR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', wordSpacing: 'normal', letterSpacing: 'normal' }}>
          <div>
            <p style={{ fontSize: '17px', color: '#9ca3af', margin: '0 0 8px', wordSpacing: 'normal' }}>📞 +91 88001 23456</p>
            <p style={{ fontSize: '17px', color: '#9ca3af', margin: '0 0 8px', wordSpacing: 'normal' }}>📧 support@masterofalphabet.com</p>
            <p style={{ fontSize: '17px', color: '#a78bfa', margin: '0 0 24px', wordSpacing: 'normal' }}>🌐 www.masterofalphabet.com</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, wordSpacing: 'normal' }}>
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '12px' }}>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://masterofalphabet.com/register"
              alt="Scan to register"
              style={{ width: '100px', height: '100px', display: 'block' }}
            />
            <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', margin: '8px 0 0', wordSpacing: 'normal' }}>
              Scan to explore
            </p>
          </div>
        </div>
      </div>

    </div>
  );


// ─────────────────────────────────────────────────────────────────────────────
// PASTE THIS HANDLER TOO — replaces your old handleDownloadPDF
//
// KEY CHANGE: renders each top-level <div> (page section) as its own canvas
// instead of one giant screenshot — eliminates the line-doubling on cuts.
// ─────────────────────────────────────────────────────────────────────────────

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      if (!pdfContentRef.current) {
        alert("Content not ready");
        setDownloading(false);
        return;
      }

      // Give fonts and images time to fully render
      await new Promise(r => setTimeout(r, 400));

      const pdf          = new jsPDF('p', 'mm', 'a4');
      const A4_W         = 210;   // mm
      const A4_H         = 297;   // mm
      const SCALE        = 2;     // retina sharpness

      // Each direct child = one "page" section
      const sections = Array.from(pdfContentRef.current.children);

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];

        // Capture this section alone — no cross-boundary slicing possible
        const canvas = await html2canvas(section, {
          scale:       SCALE,
          useCORS:     true,
          logging:     false,
          backgroundColor: null,
          width:       1200,
          height:      section.scrollHeight,
          windowWidth: 1200,
          onclone: (clonedDoc) => {
            const s = clonedDoc.createElement('style');
            s.innerHTML = `* {
              font-family: Arial, Helvetica, sans-serif !important;
              word-spacing: 0.1em !important;
              letter-spacing: 0px !important;
            }`;
            clonedDoc.head.appendChild(s);
          },
        });

        const imgData  = canvas.toDataURL('image/png');
        const imgW     = A4_W;
        const imgH     = (canvas.height * A4_W) / canvas.width;

        if (i > 0) pdf.addPage();

        if (imgH <= A4_H) {
          // Section fits on one A4 page
          pdf.addImage(imgData, 'PNG', 0, 0, imgW, imgH);
        } else {
          // Very tall section — tile it across multiple pages
          let yOffset    = 0;
          let remaining  = imgH;
          let firstSlice = true;
          while (remaining > 0) {
            if (!firstSlice) pdf.addPage();
            firstSlice = false;
            pdf.addImage(imgData, 'PNG', 0, -yOffset, imgW, imgH);
            yOffset   += A4_H;
            remaining -= A4_H;
          }
        }
      }

      pdf.save(`MoA-Report-${studentName.replace(/\s+/g, '-')}.pdf`);

    } catch (err) {
      console.error('PDF error:', err);
      alert("PDF generation failed. Please try again.");
    }
    setDownloading(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{skillLevel.icon}</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-2">
            {currentModule} Skills Health Check Completed!
          </h1>
          <p className="text-xl text-gray-600">
            Here's how <strong>{studentName}</strong> performed
          </p>
        </div>

        {/* Student Summary */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-8 mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Student Summary</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                <p className="text-sm text-purple-600 font-semibold mb-1">Student Name</p>
                <p className="text-xl font-black text-gray-900">{studentName}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <p className="text-sm text-blue-600 font-semibold mb-1">Grade</p>
                <p className="text-xl font-black text-gray-900">Grade {studentGrade}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-pink-50 rounded-xl p-4 border-2 border-pink-200">
                <p className="text-sm text-pink-600 font-semibold mb-1">School</p>
                <p className="text-lg font-bold text-gray-900">{schoolName}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <p className="text-sm text-green-600 font-semibold mb-1">City</p>
                <p className="text-lg font-bold text-gray-900">{city}</p>
              </div>
            </div>
          </div>

          {rankings && (
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2 justify-center">
                <Trophy size={24} className="text-yellow-500" />
                Your Rankings
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'school', icon: Building2, label: `School`, color: "#8b5cf6" },
                  { key: 'district', icon: Map, label: `District`, color: "#ec4899" },
                  { key: 'city', icon: MapPin, label: `City`, color: "#f97316" },
                  { key: 'state', icon: Globe2, label: `State`, color: "#10b981" }
                ].map(({ key, icon: Icon, label, color }) => {
                  const data = rankings[key];
                  const badge = getRankBadge(data.percentile);
                  return (
                    <div key={key} className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={20} style={{ color }} strokeWidth={2.5} />
                        <p className="font-bold text-gray-900 text-sm">{label}</p>
                      </div>
                      <p className="text-2xl font-black text-gray-900">#{data.rank}</p>
                      <p className="text-xs text-gray-600">of {data.total.toLocaleString()}</p>
                      <div className="mt-2">
                        <span className="text-lg">{badge.emoji}</span>
                        <span className="text-xs font-bold ml-1" style={{ color: badge.color }}>{badge.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Skill Level Progression */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-8 mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <Trophy size={28} className="text-yellow-500" />
            Skill Level Achievement
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            {SKILL_LEVELS.map((level, idx) => {
              const isCurrentLevel = idx === currentLevelIndex;
              const isPastLevel = idx < currentLevelIndex;
              
              return (
                <div key={level.name} className="flex items-center">
                  <div className={`relative transition-all duration-300 ${
                    isCurrentLevel ? 'scale-110' : isPastLevel ? 'scale-100' : 'scale-90 opacity-40'
                  }`}>
                    <div 
                      className={`rounded-2xl p-5 border-4 transition-all shadow-lg ${
                        isCurrentLevel 
                          ? `bg-gradient-to-br ${level.bgGradient} border-yellow-300 shadow-2xl animate-pulse` 
                          : isPastLevel
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300 shadow-lg'
                          : 'bg-gray-200 border-gray-300'
                      }`}
                      style={{ minWidth: isCurrentLevel ? '140px' : '100px', minHeight: isCurrentLevel ? '140px' : '100px' }}
                    >
                      <div className="text-center flex flex-col items-center justify-center h-full">
                        <div className={`${isCurrentLevel ? 'text-5xl' : 'text-3xl'} mb-2`}>
                          {isPastLevel ? (
                            <Check size={isCurrentLevel ? 44 : 28} className="text-white mx-auto" strokeWidth={4} />
                          ) : (idx > currentLevelIndex) ? (
                            <Lock size={isCurrentLevel ? 44 : 28} className="text-gray-400 mx-auto" />
                          ) : (
                            level.icon
                          )}
                        </div>
                        <p className={`font-black leading-tight ${
                          isCurrentLevel 
                            ? 'text-white text-lg' 
                            : isPastLevel 
                            ? 'text-white text-base' 
                            : 'text-gray-500 text-sm'
                        }`}>
                          {level.name}
                        </p>
                        {isCurrentLevel && (
                          <div className="mt-2 bg-white bg-opacity-30 rounded-full px-3 py-1">
                            <p className="text-white text-xs font-black">CURRENT</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {idx < SKILL_LEVELS.length - 1 && (
                    <div className={`hidden sm:block w-6 h-1 mx-1 ${isPastLevel ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
            <p className="text-gray-700 mb-2">
              <strong>{studentName}</strong> achieved <strong style={{ color: skillLevel.color }}>{skillLevel.name}</strong> level with
            </p>
            <div className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {spellingIndex}%
            </div>
            <p className="text-sm text-gray-600 mt-2 italic">Spelling Index (Weighted Score)</p>
            <p className="text-gray-600 font-semibold mt-3">{skillLevel.interpretation}</p>
          </div>
        </div>

        {/* CLUSTER ANALYSIS */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-8 mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <Target size={28} className="text-purple-600" />
            Skill Cluster Analysis
          </h2>

          {Object.keys(clusterScores).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(clusterScores).map(([key, data]) => {
                const clusterInfo = CLUSTERS[key];
                const color = getClusterColor(data.percentage);
                const isWeakest = weakestCluster && weakestCluster.key === key;
                
                return (
                  <div key={key} className={`rounded-2xl p-6 border-2 ${isWeakest ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{clusterInfo.icon}</div>
                        <div>
                          <h3 className="text-xl font-black text-gray-900">
                            {clusterInfo.name}
                            <span className="ml-2 text-sm font-bold text-purple-600">
                              (Weight: {Math.round(data.weight * 100)}%)
                            </span>
                          </h3>
                          <p className="text-sm text-gray-600">{clusterInfo.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black" style={{ color }}>
                          {data.percentage}%
                        </div>
                        <p className="text-xs text-gray-600">{data.correct}/{data.total}</p>
                      </div>
                    </div>

                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-3">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ backgroundColor: color, width: `${data.percentage}%` }}
                      />
                    </div>

                    {categoryScoresByCluster[key] && categoryScoresByCluster[key].length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <p className="text-sm font-bold text-gray-700 mb-2">Categories in this cluster:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {categoryScoresByCluster[key].map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200">
                              <span className="text-sm text-gray-700 break-words pr-2">{cat.name}</span>
                              <span className="font-bold whitespace-nowrap" style={{ color: getClusterColor(cat.percentage) }}>
                                {cat.correct}/{cat.total} ({cat.percentage}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isWeakest && (
                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <AlertCircle size={16} className="text-yellow-600" />
                        <span className="font-bold text-yellow-700">Focus area for improvement</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500">Cluster data not available</p>
          )}
        </div>

        {/* RECOMMENDATIONS */}
        {weakestCluster && practiceRecommendations.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-8 mb-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
              <Zap size={28} className="text-yellow-500" />
              Personalized Learning Path
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-black text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle size={20} />
                Your Strengths
              </h3>
              <div className="space-y-2">
                {Object.entries(clusterScores)
                  .filter(([key, data]) => data.percentage >= 75 && key !== weakestCluster.key)
                  .map(([key, data]) => (
                    <div key={key} className="flex items-center gap-2 text-gray-700">
                      <span className="text-xl">{CLUSTERS[key].icon}</span>
                      <span>Excellent <strong>{CLUSTERS[key].name}</strong> ({data.percentage}%)</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-black text-yellow-700 mb-3 flex items-center gap-2">
                <Target size={20} />
                Focus Area: {CLUSTERS[weakestCluster.key].name} ({weakestCluster.percentage}%)
              </h3>
              
              {categoriesToPractice.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-bold text-gray-700 mb-2">📚 Practice These Categories:</p>
                  <div className="space-y-2">
                    {categoriesToPractice.map((cat, idx) => (
                      <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{cat.name}</span>
                          <span className="text-sm text-yellow-700">{cat.percentage}% - needs work</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-black text-blue-700 mb-3 flex items-center gap-2">
                <TrendingUp size={20} />
                Recommended Activities
              </h3>
              <div className="space-y-4">
                {practiceRecommendations.map((rec, idx) => (
                  <div key={idx} className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                    <h4 className="font-black text-gray-900 mb-1">{idx + 1}. {rec.title}</h4>
                    <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                    <p className="text-xs text-blue-700 italic">
                      <strong>Why:</strong> {rec.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
              <h4 className="font-black text-purple-900 mb-2">📈 Next Steps:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>→ Take the assessment again in 2 weeks</li>
                <li>→ Focus on {CLUSTERS[weakestCluster.key].name} activities daily (10-15 minutes)</li>
                <li>→ Target: Bring {CLUSTERS[weakestCluster.key].name} to 85%+</li>
              </ul>
            </div>
          </div>
        )}

        {/* Modules Overview */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-8 mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-4 text-center">
            Complete Your English Skills Journey
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {studentName} has completed <strong>{currentModule}</strong>. Take assessments in other modules too!
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ALL_MODULES.map((module) => {
              const Icon = module.icon;
              const isCompleted = module.name === currentModule;
              
              return (
                <div 
                  key={module.id}
                  className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg scale-105' 
                      : 'bg-gray-50 border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                      <Check size={20} className="text-white" strokeWidth={4} />
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div 
                      className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    >
                      <Icon size={28} className={isCompleted ? 'text-white' : 'text-gray-400'} strokeWidth={2.5} />
                    </div>
                    <p className={`font-bold text-sm ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                      {module.name}
                    </p>
                    {isCompleted && (
                      <p className="text-xs text-green-600 font-bold mt-1">✓ COMPLETED</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/parents")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-lg inline-flex items-center gap-2"
            >
              <ArrowRight size={20} />
              Take More Assessments
            </button>
          </div>
        </div>

        {/* Hidden: Simple share card for social media */}
        <div className="fixed" style={{ left: '-9999px', top: 0 }}>
          <ResultShareCard
            ref={shareCardRef}
            name={studentName}
            level={skillLevel.name}
            module={currentModule}
            classLevel={`Grade ${studentGrade}`}
            date={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          />
        </div>

        {/* Hidden: Detailed card */}
        <div className="fixed" style={{ left: '-9999px', top: 0 }}>
          <ResultShareCardDetailed
            ref={shareCardDetailedRef}
            name={studentName}
            level={skillLevel.name}
            module={currentModule}
            classLevel={`Grade ${studentGrade}`}
            date={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            spellingIndex={spellingIndex}
            rawScore={rawScore}
            totalQuestions={totalQuestions}
            clusterScores={clusterScores}
            categoryScoresByCluster={categoryScoresByCluster}
            schoolName={schoolName}
            city={city}
          />
        </div>

        {/* Hidden: Full content for PDF */}
        <div className="fixed" style={{ left: '-9999px', top: 0 }}>
          <PDFContent />
        </div>

        {/* Download Options */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-8 mb-6">
          <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Download size={28} className="text-purple-600" />
            Download & Share
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={handleDownloadSimpleImage}
              disabled={downloading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base px-6 py-4 rounded-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50 flex flex-col items-center gap-2"
            >
              <ImageIcon size={24} />
              <span>Social Card (PNG)</span>
              <span className="text-xs text-purple-100">For WhatsApp/Instagram</span>
            </button>

            <button
              onClick={handleDownloadDetailedImage}
              disabled={downloading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base px-6 py-4 rounded-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50 flex flex-col items-center gap-2"
            >
              <FileText size={24} />
              <span>Full Report (PNG)</span>
              <span className="text-xs text-blue-100">Complete Results</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-base px-6 py-4 rounded-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50 flex flex-col items-center gap-2"
            >
              <FileText size={24} />
              <span>Full Report (PDF)</span>
              <span className="text-xs text-red-100">Print-Ready</span>
            </button>
          </div>

          {downloading && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
                <div className="text-center">
                  {/* Animated Icon */}
                  <div className="relative mb-6">
                    <div className="text-7xl animate-bounce">📊</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    Creating Your Report...
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4">
                    Building a beautiful, comprehensive analysis of {studentData.fullName}'s performance
                  </p>
                  
                  {/* Progress Steps */}
                  <div className="space-y-2 text-sm text-left bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-purple-700">
                      <div className="w-4 h-4 rounded-full bg-purple-600 animate-pulse"></div>
                      <span>Analyzing cluster scores...</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-700">
                      <div className="w-4 h-4 rounded-full bg-purple-600 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <span>Generating visualizations...</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-700">
                      <div className="w-4 h-4 rounded-full bg-purple-600 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <span>Formatting your report...</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    This may take up to 15 seconds...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-100 text-gray-900 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-gray-200 hover:scale-105 transition-all border-2 border-gray-200"
          >
            Back to Home
          </button>

          {!rankingData ? (
            <button
              onClick={() => navigate("/results/ranking-fields", {
                state: { assessmentResults, studentData }
              })}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Trophy size={24} />
              Add Rankings Now
              <ArrowRight size={24} />
            </button>
          ) : (
            <button
              onClick={() => navigate("/results/leaderboards", {
                state: { assessmentResults, studentData, rankingData }
              })}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Trophy size={24} />
              View Rankings
              <ArrowRight size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
