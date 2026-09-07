export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { rawNotes, language } = req.body;

  if (!rawNotes || rawNotes.trim().length === 0) {
    return res.status(400).json({ error: "rawNotes is required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server misconfigured: missing API key" });
  }

  const systemPrompt = `You are a dental clinical documentation assistant.
Given a dentist's raw shorthand notes from a patient visit, produce a JSON object with exactly two fields:
1. "clinical_record": a structured SOAP-style clinical note in English, using standard dental terminology (tooth numbers, procedures, findings). This is the professional record.
2. "patient_summary": a short, plain-language summary of what was done and any aftercare instructions, written in ${language === "ar" ? "Arabic" : "English"}, suitable for sending directly to the patient.
Return ONLY valid JSON, no markdown fences, no preamble.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: rawNotes }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: "Upstream error", detail: errText });
    }

    const data = await response.json();
    const textBlock = data.content.find((c) => c.type === "text");
    const raw = textBlock ? textBlock.text : "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { clinical_record: cleaned, patient_summary: "" };
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: String(err) });
  }
}
