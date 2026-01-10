export default function PdfOverlayEditor({
  blocks,
  activeIndex,
  setActiveIndex,
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none", // 🔥 important
      }}
    >
      {blocks.map((block, i) => {
        if (!block?.bbox) return null;

        const [x0, y0, x1, y1] = block.bbox;

        return (
          <div
            key={i}
            onClick={(e) => {
              e.stopPropagation();      // 🔥 click leak fix
              setActiveIndex(i);        // 🔥 select block
            }}
            style={{
              position: "absolute",
              left: x0,
              top: y0,
              width: x1 - x0,
              height: y1 - y0,
              border:
                activeIndex === i
                  ? "2px solid #007bff"
                  : "1px dashed rgba(0,0,255,0.5)",
              background:
                activeIndex === i
                  ? "rgba(0,123,255,0.08)"
                  : "transparent",
              cursor: "pointer",
              pointerEvents: "auto", // 🔥 ONLY BOX clickable
            }}
          />
        );
      })}
    </div>
  );
}
