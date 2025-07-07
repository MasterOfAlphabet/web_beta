import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import { AssignmentPDFDocument } from '../components/DictationAssignmentApp//AssignmentPDFDocument';

// Generate a timestamp for filenames
const getTimestamp = () => {
  const now = new Date();
  return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
};

// Download single audio file
export const downloadAudioFile = (audioBlob, questionNumber) => {
  if (!audioBlob) return;
  const filename = `Question_${questionNumber}_${getTimestamp()}.wav`;
  saveAs(audioBlob, filename);
};

// Download all audio files as a zip
export const downloadAllAudioFiles = async (recordedAnswers) => {
  if (!recordedAnswers || recordedAnswers.length === 0) return;

  const zip = new JSZip();
  const audioFolder = zip.folder('audio_responses');

  // Add each audio file to the zip
  let hasFiles = false;
  for (let i = 0; i < recordedAnswers.length; i++) {
    if (recordedAnswers[i]?.audioBlob) {
      hasFiles = true;
      const filename = `Question_${i + 1}.wav`;
      audioFolder.file(filename, recordedAnswers[i].audioBlob);
    }
  }

  if (!hasFiles) {
    console.warn('No audio files to download');
    return;
  }

  try {
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `audio_responses_${getTimestamp()}.zip`);
  } catch (error) {
    console.error('Error generating zip file:', error);
  }
};

// Generate and download PDF report
export const generatePDFReport = async (questions, recordedAnswers, sessionStats) => {
  if (!questions || !recordedAnswers) return;

  // Filter to only questions with answers
  const answeredQuestions = questions.map((q, i) => ({
    ...q,
    answer: recordedAnswers[i],
    number: i + 1
  })).filter(q => q.answer?.audioUrl);

  if (answeredQuestions.length === 0) {
    console.warn('No answered questions to generate PDF');
    return;
  }

  try {
    // Create PDF document
    const blob = await pdf(
      <AssignmentPDFDocument 
        questions={answeredQuestions} 
        stats={sessionStats}
      />
    ).toBlob();
    
    saveAs(blob, `dictation_assignment_${getTimestamp()}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

// Helper function to format time for PDF
export const formatTimeForPDF = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};