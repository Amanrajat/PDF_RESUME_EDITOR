export default function PdfOverlayEditor({
  blocks,
  activeIndex,
  setActiveIndex,
}) {
  return (
    <>
      {blocks.map((block, i) => {
        const [x0, y0, x1, y1] = block.bbox;

        return (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
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
              background: "transparent",
              zIndex: 2,          
              cursor: "pointer",
            }}
          />
        );
      })}
    </>
  );
}
