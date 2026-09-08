import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setNotes(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Past Notes</h1>
      <a href="/" style={{ color: "#2563eb" }}>← New note</a>
      {notes.length === 0 && <p style={{ marginTop: "1rem" }}>No notes yet.</p>}
      {notes.map((n) => (
        <div key={n.id} style={{ marginTop: "1.5rem", padding: "1rem", background: "#f5f5f5", borderRadius: "6px" }}>
          <p style={{ color: "#666", fontSize: "0.85rem" }}>{new Date(n.created_at).toLocaleString()}</p>
          <p style={{ whiteSpace: "pre-wrap" }}><strong>Record:</strong> {n.clinical_record}</p>
          <p dir={n.language === "ar" ? "rtl" : "ltr"} style={{ whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>
            <strong>Summary:</strong> {n.patient_summary}
          </p>
        </div>
      ))}
    </div>
  );
}
