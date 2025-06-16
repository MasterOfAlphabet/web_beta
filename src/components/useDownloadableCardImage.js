import { useRef } from "react";
import { toPng } from "html-to-image";

/**
 * useDownloadableCardImage
 * -------------------------------------------
 * Returns a ref and three download functions for:
 *   - Certificate (wide)
 *   - Social Share (compact, portrait)
 *   - Social Share (square, for Insta post)
 * 
 * Usage:
 *   const { cardRef, downloadCertificate, downloadSocial, downloadInsta } = useDownloadableCardImage();
 *   <UniversalResultShareCard ref={cardRef} ... mode="certificate" />
 *   <button onClick={downloadCertificate}>Download Certificate</button>
 */
export function useDownloadableCardImage() {
  const cardRef = useRef(null);

  // Download as-is (usually "certificate" or "social" mode)
  const downloadCertificate = async (fileName = "certificate") => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { cacheBust: true, backgroundColor: "#fff" });
    triggerDownload(dataUrl, `${fileName}-${new Date().toISOString().slice(0, 10)}.png`);
  };

  // Download as WhatsApp Status (portrait, 9:16)
  const downloadSocial = async (fileName = "social-status") => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      backgroundColor: "#fff",
      width: 380,
      height: 675, // WhatsApp status: 9:16
      style: { width: "380px", height: "675px" }
    });
    triggerDownload(dataUrl, `${fileName}-${new Date().toISOString().slice(0, 10)}.png`);
  };

  // Download as Instagram Post (square)
  const downloadInsta = async (fileName = "insta-post") => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      backgroundColor: "#fff",
      width: 600,
      height: 600,
      style: { width: "600px", height: "600px" }
    });
    triggerDownload(dataUrl, `${fileName}-${new Date().toISOString().slice(0, 10)}.png`);
  };

  function triggerDownload(dataUrl, fileName) {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  }

  return { cardRef, downloadCertificate, downloadSocial, downloadInsta };
}