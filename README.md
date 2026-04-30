# 🗳️ MataBot — India Election Intelligence Assistant
# मातबोट — भारत निर्वाचन सहायक

A blazing-fast, beautifully designed election education chatbot specialized for **India's electoral system**, powered by **Groq API** and **LLaMA 3.3 70B**.

---

## ⚡ Tech Stack

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| Frontend    | Vanilla HTML + CSS + JS (zero dependencies)    |
| AI Model    | LLaMA 3.3 70B via Groq API                     |
| Streaming   | Server-Sent Events (SSE) — real-time tokens    |
| Fonts       | Yatra One + Plus Jakarta Sans (Google Fonts)   |
| Theme       | Indian Tricolor — Saffron · White · Green      |
| Deploy      | Any static host — open index.html directly     |

---

## 🚀 Getting Started

### Option 1 — Open Locally (instant, no server needed)
```
1. Unzip matabot-india.zip
2. Open index.html in Chrome, Firefox, Safari, or Edge
3. Works immediately ✅
```

### Option 2 — Deploy to Vercel (30 seconds)
```bash
npm i -g vercel
cd matabot-india
vercel --prod
```

### Option 3 — Deploy to Netlify
```
1. Go to netlify.com → Add new site → Deploy manually
2. Drag the matabot-india folder into the upload zone
3. Live instantly with HTTPS ✅
```

---

## 📁 File Structure

```
matabot-india/
├── index.html    ← App shell, header, welcome cards (12 topic cards)
├── style.css     ← Tricolor design system, animations, responsive
├── app.js        ← Groq streaming engine, India-specific AI prompt
└── README.md     ← This file
```

---

## 🔑 API Key

Pre-configured in `app.js` line 13:
```js
const CONFIG = {
  apiKey: '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',
  model:  'llama-3.3-70b-versatile',
  ...
};
```

> ⚠️ For production apps, proxy the API through your own backend to protect the key.

---

## 🇮🇳 India-Specific Knowledge Base

MataBot's AI prompt covers:

| Topic                        | Details                                              |
|------------------------------|------------------------------------------------------|
| Constitutional framework     | Articles 324–329, RP Acts 1950 & 1951               |
| Election types               | Lok Sabha, Rajya Sabha, Vidhan Sabha, Panchayat      |
| Voter registration           | EPIC/Voter ID, Form 6/7/8, NVSP portal              |
| EVM & VVPAT                  | How they work, security features, history           |
| Model Code of Conduct        | When it applies, what it prohibits                  |
| NOTA                         | History (2013), symbol, legal effect                |
| Election timeline            | Phase-wise polling, MCC, nomination to results      |
| Campaign finance             | Expenditure limits, Form 26, Election Bond history  |
| Counting & results           | FPTP, PR-STV for Rajya Sabha, election petitions    |
| Key institutions             | ECI, CEC, Returning Officers, BEL/ECIL              |
| Digital tools                | cVIGIL, Suvidha, KYC app, Voter Turnout app         |
| Historical facts             | 1951-52 first election, 2024 scale (969M voters)    |

---

## ✨ Features

- 🚀 **Sub-100ms TTFT** — Groq LPU delivers ~750 tokens/sec
- 🔄 **Real-time streaming** — words appear as they're generated
- 🧠 **Multi-turn memory** — full conversation context retained
- ⚡ **8 quick chips** — popular India election topics
- 🏛️ **12 welcome cards** — visual topic launcher
- 📝 **Markdown formatting** — bold, headers, numbered steps
- ☸️ **Spinning Ashok Chakra** logo animation
- 🇮🇳 **Tricolor design** — saffron/white/green throughout
- 🌀 **Mandala background** — rotating concentric rings
- 📱 **Fully responsive** — mobile & tablet friendly
- ↺ **Clear chat** — reset with one click
- 🛡️ **Strictly nonpartisan** — no party endorsements

---

## 🎨 Design System

- **Colors:** Saffron `#FF9933` · Deep navy `#0d0d14` · India Green `#138808`
- **Fonts:** Yatra One (headings, Indian feel) + Plus Jakarta Sans (body)
- **Theme:** Civic patriotism — dark background with tricolor accents
- **Effects:** Rotating Ashok Chakra, mandala rings, tricolor stripe borders

---

## 🗣️ Bilingual Support

MataBot understands and responds to questions in both **English** and **Hindi**.
The AI explains Hindi election terms (मतदाता सूची, नामांकन, आदर्श आचार संहिता) alongside their English equivalents.

---

> "लोकतंत्र की जय! Long live democracy!" — MataBot 🇮🇳
