import React from "react";
import { Button, Stack } from "@mui/material";
import { toPng } from "html-to-image";

export function ShareResultActions({ cardRef, fileName }) {
  const handleDownload = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { cacheBust: true });
    const link = document.createElement("a");
    link.download = fileName || "MoA-Result.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <Stack direction="row" spacing={3} justifyContent="center" mt={2}>
      <Button variant="contained" color="primary" onClick={handleDownload}>
        Download as Image
      </Button>
    </Stack>
  );
}