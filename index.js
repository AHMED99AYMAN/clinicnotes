import { useState } from "react";

export default function Home() {
  const [rawNotes, setRawNotes] = useState("");
  const [language, setLanguage] = useState("ar"); // default to Arabic patient summary for MENA pilot
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/generate-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawNotes, language })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>ClinicNotes</h1>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>Dictate shorthand. Get a clinical record + patient summary.</p>

      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
        Patient summary language
      </label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      >
        <option value="ar">Arabic</option>
        <option value="en">English</option>
      </select>

      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
        Raw visit notes
      </label>
      <textarea
        value={rawNotes}
        onChange={(e) => setRawNotes(e.target.value)}
        rows={6}
        placeholder="e.g. #14 RCT, mod decay, isolated w/ rubber dam, obturated w/ gutta percha, temp crown placed, recall 2wk for perm crown"
        style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", fontSize: "1rem" }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !rawNotes.trim()}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          background: loading ? "#999" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "default" : "pointer"
        }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p style={{ color: "crimson", marginTop: "1rem" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Clinical Record</h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: "1rem", borderRadius: "6px" }}>
            {result.clinical_record}
          </pre>

          <h2 style={{ fontSize: "1.1rem", marginTop: "1.5rem" }}>Patient Summary</h2>
          <div
            dir={language === "ar" ? "rtl" : "ltr"}
            style={{ whiteSpace: "pre-wrap", background: "#f0f9ff", padding: "1rem", borderRadius: "6px" }}
          >
            {result.patient_summary}
          </div>
        </div>
      )}
    </div>
  );
}
