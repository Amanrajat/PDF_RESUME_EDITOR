import { useState, useEffect } from "react";
import PdfViewer from "./components/PdfViewer";
import PdfOverlayEditor from "./components/PdfOverlayEditor";
import Navbar from "./components/Navbar";

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
  const [downloadUrl, setDownloadUrl] = useState(null);

  const [activeIndex, setActiveIndex] = useState(null);

  // Toolbar state
  const [selectedFont, setSelectedFont] = useState("Helvetica");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // 🔄 Apply toolbar styles to active block
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

  // 📄 Upload + extract
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPdfUrl(URL.createObjectURL(file));
    setDownloadUrl(null);

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
        color: "#000000",
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

  // ✍️ Text edit
  const handleEdit = (index, text) => {
    setBlocks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], new_text: text };
      return updated;
    });
  };

  // 🔠 Font size
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

  // 💾 Save PDF
  const handleSave = async () => {
    if (!resumeId) return;

    try {
      const res = await saveEditedBlocks(resumeId, blocks);

      setPdfUrl(res.download_url + "?t=" + Date.now());
      setDownloadUrl(res.download_url);

      setEditMode(false);
      setActiveIndex(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save edited PDF");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 🔝 NAVBAR */}
      <Navbar downloadUrl={downloadUrl} />

      {/* 🧰 TOOLBAR */}
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
          {editMode ? "Exit Edit" : "Edit Text"}
        </button>

        <button onClick={handleSave} disabled={!editMode}>
          Save PDF
        </button>

        <select
          disabled={activeIndex === null}
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
        >
          <option value="Helvetica">Helvetica</option>
          <option value="Times-Roman">Times</option>
          <option value="Courier">Courier</option>
        </select>

        <input
          type="color"
          disabled={activeIndex === null}
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />

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

      {/* 📄 PDF AREA */}
      <div style={{ position: "relative", flex: 1, background: "#ccc" }}>
        <div style={{ pointerEvents: "none" }}>
          <PdfViewer pdfUrl={pdfUrl} />
        </div>

        {editMode && (
          <PdfOverlayEditor
              blocks={blocks.filter(b => b.page === 0 && !b.has_link)}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        )}

        {/* 📝 SIDE EDIT PANEL */}
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
