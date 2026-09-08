import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const fn = mode === "signin" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "4rem auto", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>ClinicNotes</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "0.75rem", marginBottom: "0.75rem" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "0.75rem", marginBottom: "0.75rem" }}
      />
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: "0.75rem", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", marginBottom: "0.75rem" }}
      >
        {loading ? "..." : mode === "signin" ? "Sign In" : "Sign Up"}
      </button>
      <p style={{ textAlign: "center", cursor: "pointer", color: "#2563eb" }} onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
        {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
      </p>
    </div>
  );
        }
