# ClinicNotes — MENA Pilot Starter

This is the first real piece of code for ClinicNotes. It's small on purpose: one form,
one secure backend route, two outputs (clinical record + patient summary).

## What this does
- Dentist types shorthand notes from a visit
- Server-side route calls Claude to generate:
  1. A structured clinical record (English, professional)
  2. A plain-language patient summary (Arabic or English)
- The Anthropic API key lives ONLY in Vercel's environment variables — never in the
  browser, never in the repo. This was the security issue we fixed before writing
  anything else.

## How to deploy (no coding needed beyond this)

1. **Create a GitHub repo** and upload this folder (or use GitHub Desktop / GitHub web
   upload if you don't want to use git commands).
2. **Go to vercel.com**, sign in, click "Add New Project", and import that GitHub repo.
3. Vercel will detect it's a Next.js app automatically — leave build settings as default.
4. Before deploying, go to **Settings → Environment Variables** in the Vercel project
   and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your actual Anthropic API key
5. Click **Deploy**. Vercel gives you a live URL (something like
   `clinicnotes.vercel.app`) — that's your pilot link to share with the first
   test clinics.

## What's NOT in here yet (next phases)
- WhatsApp delivery of the patient summary
- Cash-pay billing / itemized cost tracking
- Multi-visit patient history (this version is single-note, stateless)
- Any persistence/database — nothing is saved yet, this is just the generation core

## Testing it locally (optional, if you get access to a computer)
```
npm install
# create a .env.local file with ANTHROPIC_API_KEY=your_key
npm run dev
```
Then open http://localhost:3000
