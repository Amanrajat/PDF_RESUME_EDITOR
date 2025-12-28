import { useState, useEffect } from "react";
import PdfViewer from "./components/PdfViewer";
import PdfOverlayEditor from "./components/PdfOverlayEditor";
import {
  uploadResume,
  extractBlocks,
  saveEditedBlocks,
} from "./api/resumeApi";

export default function Editor() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Selected block index
  const [activeIndex, setActiveIndex] = useState(null);

  // Style controls (SAFE set)
  const [selectedFont, setSelectedFont] = useState("Helvetica");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // Apply style to active block
  useEffect(() => {
    if (activeIndex === null) return;

    setBlocks((prev) => {
      const updated = [...prev];
      updated[activeIndex] = {
        ...updated[activeIndex],
        font: selectedFont,
        color: selectedColor,
        bold: isBold,
        italic: isItalic,
      };
      return updated;
    });
  }, [selectedFont, selectedColor, isBold, isItalic, activeIndex]);

  // Upload PDF + extract blocks
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    setPdfUrl(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const uploadRes = await uploadResume(formData);
      setResumeId(uploadRes.resume_id);

      const extractRes = await extractBlocks(uploadRes.resume_id);

      const prepared = (extractRes.blocks || []).map((b) => ({
        ...b,
        new_text: b.text,
        size: b.size || 12,
        font: b.font || "Helvetica",
        color: b.color || "#000000",
        bold: false,
        italic: false,
      }));

      setBlocks(prepared);
      setEditMode(true);
      setActiveIndex(null);
    } catch (err) {
      console.error(err);
      alert("Upload or extract failed");
    }
  };

  // Edit text
  const handleEdit = (index, text) => {
    setBlocks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], new_text: text };
      return updated;
    });
  };

  // Font size A+ / A-
  const handleResize = (index, delta) => {
    setBlocks((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        size: Math.max(6, updated[index].size + delta),
      };
      return updated;
    });
  };

  // SAVE edited PDF  ✅ (CACHE BUSTING HERE)
  const handleSave = async () => {
    if (!resumeId) return;

    try {
      const res = await saveEditedBlocks(resumeId, blocks);

      //  IMPORTANT LINE (CACHE BUST)
      setPdfUrl(res.download_url + "?t=" + Date.now());

      setEditMode(false);
      setActiveIndex(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save edited PDF");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* TOOLBAR */}
      <div
        style={{
          padding: 8,
          background: "#f1f1f1",
          borderBottom: "1px solid #ccc",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <input type="file" accept="application/pdf" onChange={handleUpload} />

        <button onClick={() => setEditMode((e) => !e)}>
          {editMode ? "Exit Edit Mode" : "Edit Text"}
        </button>

        <button onClick={handleSave} disabled={!editMode}>
          Save PDF
        </button>

        {/* FONT */}
        <select
          value={selectedFont}
          disabled={activeIndex === null}
          onChange={(e) => setSelectedFont(e.target.value)}
        >
          <option value="Helvetica">Helvetica</option>
          <option value="Times-Roman">Times</option>
          <option value="Courier">Courier</option>
        </select>

        {/* COLOR */}
        <input
          type="color"
          value={selectedColor}
          disabled={activeIndex === null}
          onChange={(e) => setSelectedColor(e.target.value)}
        />

        {/* BOLD / ITALIC */}
        <button
          disabled={activeIndex === null}
          onClick={() => setIsBold((b) => !b)}
          style={{ fontWeight: isBold ? "bold" : "normal" }}
        >
          B
        </button>

        <button
          disabled={activeIndex === null}
          onClick={() => setIsItalic((i) => !i)}
          style={{ fontStyle: isItalic ? "italic" : "normal" }}
        >
          I
        </button>

        {/* FONT SIZE */}
        <button
          disabled={activeIndex === null}
          onClick={() => handleResize(activeIndex, 1)}
        >
          A+
        </button>

        <button
          disabled={activeIndex === null}
          onClick={() => handleResize(activeIndex, -1)}
        >
          A-
        </button>
      </div>

      {/* PDF + OVERLAY */}
      <div style={{ position: "relative", flex: 1, background: "#ccc" }}>
        {/* PDF background */}
        <div style={{ pointerEvents: "none" }}>
          <PdfViewer pdfUrl={pdfUrl} />
        </div>

        {/* Clickable overlay (boxes only, text visible on PDF) */}
        {editMode && (
          <PdfOverlayEditor
            blocks={blocks.filter((b) => b.page === 0)}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        )}

        {/* RIGHT SIDE EDIT PANEL */}
        {editMode && activeIndex !== null && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "35%",
              height: "100%",
              background: "#fff",
              borderLeft: "1px solid #ccc",
              padding: 12,
              overflow: "auto",
              zIndex: 2000,
            }}
          >
            <h4>Edit Selected Text</h4>

            <textarea
              value={blocks[activeIndex].new_text}
              onChange={(e) => handleEdit(activeIndex, e.target.value)}
              style={{
                width: "100%",
                minHeight: 160,
                fontSize: blocks[activeIndex].size,
                fontFamily: blocks[activeIndex].font,
                color: blocks[activeIndex].color,
                fontWeight: blocks[activeIndex].bold ? "bold" : "normal",
                fontStyle: blocks[activeIndex].italic ? "italic" : "normal",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
