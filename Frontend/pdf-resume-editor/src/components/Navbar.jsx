export default function Navbar({ downloadUrl }) {
  return (
    <div className="navbar">
      <h2>PDF Resume Editor</h2>

      {downloadUrl && (
        <a className="download-btn" href={downloadUrl} target="_blank">
          Download PDF
        </a>
      )}
    </div>
  );
}

