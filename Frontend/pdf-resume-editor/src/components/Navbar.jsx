export default function Navbar({ downloadUrl }) {
  return (
    <div style={{
      height: 56,
      background: "#0f172a",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px"
    }}>
      <h3>PDF Editor</h3>

      {downloadUrl && (
        <a
          href={downloadUrl}
          download
          style={{
            background: "#22c55e",
            color: "#000",
            padding: "8px 14px",
            borderRadius: 6,
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          ⬇ Download Edited PDF
        </a>
      )}
    </div>
  );
}
