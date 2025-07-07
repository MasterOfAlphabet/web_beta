import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import { AssignmentPDFDocument } from './AssignmentPDFDocument';



// Helper to create a beep sound buffer
function createBeepBuffer(audioCtx, durationMs = 350, freq = 750) {
  const duration = durationMs / 1000;
  const sampleRate = audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.sin(2 * Math.PI * freq * (i / sampleRate)) * 0.15;
  }
  return buffer;
}

// Helper to convert an AudioBuffer to a WAV Blob
function audioBufferToWavBlob(audioBuffer) {
  const numOfChan = audioBuffer.numberOfChannels,
    length = audioBuffer.length * numOfChan * 2 + 44,
    buffer = new ArrayBuffer(length),
    view = new DataView(buffer),
    channels = [],
    sampleRate = audioBuffer.sampleRate,
    bitDepth = 16;

  let offset = 0;

  function setUint16(data) {
    view.setUint16(offset, data, true);
    offset += 2;
  }
  function setUint32(data) {
    view.setUint32(offset, data, true);
    offset += 4;
  }

  // RIFF identifier
  setUint32(0x46464952);
  // file length minus RIFF and size
  setUint32(length - 8);
  // RIFF type
  setUint32(0x45564157);

  // format chunk identifier
  setUint32(0x20746d66);
  // format chunk length
  setUint32(16);
  // sample format (raw)
  setUint16(1);
  // channel count
  setUint16(numOfChan);
  // sample rate
  setUint32(sampleRate);
  // byte rate (sample rate * block align)
  setUint32(sampleRate * numOfChan * bitDepth / 8);
  // block align (channel count * bytes per sample)
  setUint16(numOfChan * bitDepth / 8);
  // bits per sample
  setUint16(bitDepth);

  // data chunk identifier
  setUint32(0x61746164);
  // data chunk length
  setUint32(length - offset - 4);

  // Write interleaved data
  for (let i = 0; i < audioBuffer.numberOfChannels; i++)
    channels.push(audioBuffer.getChannelData(i));

  let sample = 0;
  while (sample < audioBuffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      // Clamp
      let s = Math.max(-1, Math.min(1, channels[i][sample]));
      // Scale to 16-bit signed int
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }
    sample++;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

// Helper to decode a Blob to AudioBuffer
function blobToAudioBuffer(blob, audioCtx) {
  return blob.arrayBuffer().then((arrayBuffer) =>
    audioCtx.decodeAudioData(arrayBuffer)
  );
}

// Main function
export async function generateCombinedAudioFile(
  questions,
  recordedAnswers,
  setProgress // function({current, total})
) {
  if (!window.AudioContext) {
    alert('Web Audio API is not supported on this browser.');
    return;
  }
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const total = questions.length;
  const buffers = [];

  let included = 0;
  for (let i = 0; i < questions.length; i++) {
    setProgress && setProgress({ current: i + 1, total });

    const answer = recordedAnswers[i];
    let blob = null;
    if (answer && answer.audioBlob) {
      blob = answer.audioBlob;
    } else if (answer && answer.audioUrl) {
      try {
        blob = await fetch(answer.audioUrl).then(res => res.blob());
      } catch (err) {
        console.warn(`Failed to fetch audioUrl for answer ${i + 1}`, err);
      }
    }
    if (blob) {
      try {
        let aBuffer = await blobToAudioBuffer(blob, audioCtx);
        buffers.push(aBuffer);
        included++;
        // Add beep separator except after the last included answer
        if (i < questions.length - 1) {
          buffers.push(createBeepBuffer(audioCtx, 350, 700));
        }
      } catch (err) {
        console.warn(`Failed to decode audio for answer ${i + 1}`, err);
      }
    }
  }

  if (included === 0) {
    alert('No recorded answers found to combine.');
    setProgress && setProgress({ current: total, total });
    return;
  }

  setProgress && setProgress({ current: total, total });

  // Concatenate all audio buffers
  let totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
  let outputBuffer = audioCtx.createBuffer(
    1,
    totalLength,
    audioCtx.sampleRate
  );

  let offset = 0;
  for (let buf of buffers) {
    // Mixdown multi-channel buffers to mono
    let src = buf.numberOfChannels > 1 ? buf.getChannelData(0) : buf.getChannelData(0);
    outputBuffer.getChannelData(0).set(src, offset);
    offset += buf.length;
  }

  // Export as WAV
  const wavBlob = audioBufferToWavBlob(outputBuffer);
  saveAs(wavBlob, `dictation_combined_${Date.now()}.wav`);
}

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
})).filter(q => q.answer?.textAnswer && q.answer.textAnswer.trim());

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