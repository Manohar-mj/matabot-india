/**
 * MataBot — India Election Intelligence Assistant
 * app.js
 *
 * Stack: Vanilla JS · Groq API · LLaMA 3.3 70B · SSE Streaming
 * Specialized: Indian Electoral System (ECI, Lok Sabha, Rajya Sabha, EVM, NOTA...)
 */

/* ============================
   Configuration
   ============================ */
const CONFIG = {
  apiKey:      'gsk______________________________________________m0ITl',
  apiUrl:      'https://api.groq.com/openai/v1/chat/completions',
  model:       'llama-3.3-70b-versatile',
  maxTokens:   1300,
  temperature: 0.70,
};

/* ============================
   India-Specific System Prompt
   ============================ */
const SYSTEM_PROMPT = `You are MataBot (मातबोट), India's most knowledgeable and friendly election education assistant. You are an expert on every aspect of the Indian democratic and electoral system.

## YOUR DEEP EXPERTISE COVERS:

### Constitutional & Legal Framework
- Articles 324–329 of the Constitution of India (Elections)
- Representation of the People Act, 1950 and 1951
- Delimitation Acts and Delimitation Commission
- Election Commission of India (ECI) — powers, composition, independence
- Chief Election Commissioner and Election Commissioners

### Types of Elections in India
- Lok Sabha (House of the People) — 543 constituencies, 5-year term
- Rajya Sabha (Council of States) — 245 members, indirect election by MLAs
- Vidhan Sabha (State Legislative Assembly) — each state
- Vidhan Parishad (State Legislative Council) — 6 states only
- Presidential Election — Electoral College of MPs and MLAs
- Vice Presidential Election — joint sitting of Parliament
- By-elections (उपचुनाव) — when seat becomes vacant
- Gram Panchayat, Zila Parishad, Municipal Corporation elections

### Voter Registration & EPIC
- Electoral Photo Identity Card (EPIC / Voter ID)
- Electoral Roll / Voter List (मतदाता सूची)
- Form 6 (new registration), Form 7 (deletion), Form 8 (correction)
- National Voter Service Portal (NVSP) — nvsp.in
- Voter Helpline: 1950
- Minimum voting age: 18 years
- NRI voting rights

### Election Process & Timeline
- Election Schedule announced by ECI
- Model Code of Conduct (MCC / आदर्श आचार संहिता) — when it kicks in, what it prohibits
- Nomination filing (नामांकन) — Form 2A, scrutiny, withdrawal
- Candidate eligibility: age requirements (25 for LS, 30 for RS), citizenship, disqualifications
- Election campaigning rules — spending limits, silent period (48 hrs before polling)
- Polling Day (मतदान दिवस) — process at booth, booth agents, presiding officer
- Phase-wise polling (भारत में चरणबद्ध मतदान) — why India votes in phases

### Voting Technology
- EVM (Electronic Voting Machine) — how it works, M2, M3 models, BEL & ECIL manufacture
- VVPAT (Voter Verifiable Paper Audit Trail) — slip verification, 5-second display
- Mock polling, first-vote to dummy candidate
- EVM security features — tamper-proof, no internet connectivity
- Controversies and ECI responses about EVM reliability

### Counting & Results
- Counting Day (मतगणना दिवस) — Returning Officer, counting agents
- First Past the Post (FPTP) system for Lok Sabha and Vidhan Sabha
- Proportional Representation with Single Transferable Vote (PR-STV) for Rajya Sabha & President
- Result declaration, Form 20, winning margin
- Election Petition — High Court and Supreme Court jurisdiction

### Special Features of Indian Elections
- NOTA (None of the Above) — introduced 2013, symbol, effect
- Model Code of Conduct (MCC) in detail
- EVMs vs paper ballots history
- Booth capturing history and prevention
- Election expenditure limits (₹95 lakhs for LS, varies by state for Vidhan Sabha)
- Political party registration with ECI
- Election symbols — reserved (national parties) vs free symbols
- Exit polls and opinion polls rules
- Counting of postal ballots — armed forces, senior citizens, COVID provisions

### Key Institutions & Officials
- Chief Election Commissioner (CEC)
- State Chief Electoral Officers
- Returning Officer (RO), Assistant Returning Officer (ARO)
- Presiding Officer, Polling Officer at booth
- District Election Officer (DEO)
- Micro-observers and election observers

### Recent Reforms & Digital Initiatives
- cVIGIL app — reporting MCC violations
- Suvidha portal — candidate permissions
- KYC app — Know Your Candidate
- Voter Turnout app
- 85+ and PwD home voting facility
- Aadhaar-voter ID linking (Form 6B)

### Historical Facts
- First General Election: 1951-52 (489 seats)
- Largest democracy: ~969 million registered voters (2024)
- 2024 General Election — 7 phases, April-June 2024

---

## COMMUNICATION STYLE:
- Warm, clear, nonpartisan — never favor any party
- Use **bold** for key terms (EVM, NOTA, MCC, EPIC, etc.)
- Use numbered steps for processes
- Use bullet lists for features/options
- Explain both English AND Hindi terms where relevant (e.g., **NOTA** / "उपरोक्त में से कोई नहीं")
- Cite relevant constitutional articles or acts when useful
- Aim for 180–380 words per response
- Always celebrate civic participation and democratic values
- End complex answers with one useful follow-up suggestion

## IMPORTANT:
- Stay strictly nonpartisan — no party/politician endorsements
- If asked about specific parties or politicians, explain the system, not opinions
- Encourage voter participation and civic awareness`;

/* ============================
   State
   ============================ */
let messages   = [];
let isStreaming = false;

/* ============================
   DOM
   ============================ */
const chatArea  = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn   = document.getElementById('sendBtn');

/* ============================
   Init
   ============================ */
document.addEventListener('DOMContentLoaded', () => {
  buildMandala();
  setupTextarea();
  userInput.focus();
});

/* ============================
   Mandala Background Rings
   ============================ */
function buildMandala() {
  const container = document.getElementById('mandala');
  const sizes = [120, 200, 300, 420, 560, 720, 900];
  sizes.forEach((size, i) => {
    const ring = document.createElement('div');
    ring.className = 'mandala-ring';
    const spd = 40 + i * 15;
    ring.style.cssText = `
      width: ${size}px; height: ${size}px;
      --spd: ${spd}s;
      --rev: ${i % 2 === 0 ? 'normal' : 'reverse'};
      border-color: ${i % 3 === 0 ? '#FF9933' : i % 3 === 1 ? '#138808' : '#000080'};
    `;
    container.appendChild(ring);
  });
}

/* ============================
   Textarea Auto-resize
   ============================ */
function setupTextarea() {
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 130) + 'px';
  });

  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming) sendMessage();
    }
  });
}

/* ============================
   Render Helpers
   ============================ */
function addUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `
    <div class="avatar user-av">आप</div>
    <div class="bubble">${escapeHtml(text)}</div>
  `;
  chatArea.appendChild(div);
  scrollBottom();
}

function addBotBubble() {
  const wrap = document.createElement('div');
  wrap.className = 'msg bot';
  const id = 'bubble-' + Date.now();
  wrap.innerHTML = `
    <div class="avatar bot">☸</div>
    <div class="bubble" id="${id}">
      <div class="typing"><span></span><span></span><span></span></div>
    </div>
  `;
  chatArea.appendChild(wrap);
  scrollBottom();
  return document.getElementById(id);
}

/* ============================
   Markdown Formatter
   ============================ */
let _stepCounter = 0;

function resetSteps() { _stepCounter = 0; }

function formatResponse(raw) {
  return raw
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^#{1,3} (.+)$/gm, (_,t) =>
      `<h3 style="font-family:'Yatra One',serif;font-size:15px;color:#FF9933;margin:14px 0 7px;font-weight:400;letter-spacing:0.3px;">${t}</h3>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/^\d+\. (.+)$/gm, (_,c) => {
      _stepCounter++;
      return `<div class="step-item"><div class="step-num">${_stepCounter}</div><div>${c}</div></div>`;
    })
    .replace(/^[-•] (.+)$/gm, (_,c) =>
      `<div class="list-item"><span class="list-bullet">›</span><span>${c}</span></div>`)
    .replace(/\n\n/g, '</p><p style="margin-top:9px;">')
    .replace(/\n/g, '<br>');
}

/* ============================
   Core: Send Message
   ============================ */
async function sendMessage(prefill) {
  const text = (prefill || userInput.value).trim();
  if (!text || isStreaming) return;

  const welcome = document.getElementById('welcomeScreen');
  if (welcome) welcome.remove();

  isStreaming = true;
  sendBtn.disabled = true;
  userInput.value = '';
  userInput.style.height = 'auto';

  addUserMessage(text);
  messages.push({ role: 'user', content: text });

  const bubble = addBotBubble();
  resetSteps();

  try {
    const res = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model:       CONFIG.model,
        messages:    [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens:  CONFIG.maxTokens,
        temperature: CONFIG.temperature,
        stream:      true,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const reader  = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText    = '';
    let initialized = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const lines = decoder.decode(value, { stream: true }).split('\n');

      for (const line of lines) {
        const t = line.trim();
        if (!t || t === 'data: [DONE]' || !t.startsWith('data: ')) continue;

        try {
          const json  = JSON.parse(t.slice(6));
          const delta = json.choices?.[0]?.delta?.content || '';

          if (delta) {
            if (!initialized) { bubble.innerHTML = ''; initialized = true; }
            fullText += delta;
            resetSteps();
            bubble.innerHTML = `<p style="margin:0;">${formatResponse(fullText)}</p><span class="cursor"></span>`;
            scrollBottom();
          }
        } catch (_) { /* skip malformed chunks */ }
      }
    }

    resetSteps();
    bubble.innerHTML = `<p style="margin:0;">${formatResponse(fullText)}</p>`;
    messages.push({ role: 'assistant', content: fullText });

  } catch (err) {
    console.error('MataBot error:', err);
    bubble.style.borderColor = 'rgba(255,80,80,0.3)';
    bubble.innerHTML = `
      <p style="margin:0;">
        <strong style="color:#fca5a5;">⚠️ Connection error</strong><br>
        ${escapeHtml(err.message || 'Something went wrong. Please try again.')}<br>
        <span style="font-size:12px;opacity:0.6;margin-top:6px;display:block;">
          Check your Groq API key in app.js or refresh the page.
        </span>
      </p>`;
  }

  isStreaming = false;
  sendBtn.disabled = false;
  userInput.focus();
}

/* ============================
   Quick Chip
   ============================ */
function askChip(text) {
  if (!isStreaming) {
    userInput.value = text;
    sendMessage();
  }
}

/* ============================
   Clear Chat
   ============================ */
function clearChat() {
  if (isStreaming) return;
  messages = [];
  chatArea.innerHTML = '';

  const w = document.createElement('div');
  w.className = 'welcome';
  w.id = 'welcomeScreen';
  w.innerHTML = `
    <div class="welcome-header">
      <div class="tricolor-bar"><div></div><div></div><div></div></div>
      <span class="welcome-icon">🗳️</span>
      <h2>जय हिन्द! Welcome to MataBot</h2>
      <p>Your complete guide to India's democratic election system — from voter registration to results. Ask in English or Hindi!</p>
      <div class="tricolor-bar"><div></div><div></div><div></div></div>
    </div>
    <div class="welcome-cards">
      ${[
        ['🏛️','Lok Sabha Elections','General election process','Explain how the Lok Sabha general elections work from start to finish'],
        ['📅','Election Timeline','Schedule & key dates','Walk me through the complete Indian election timeline with all milestones'],
        ['🪪','Voter ID Card','EPIC & registration','How does voter registration work in India? How to apply for a Voter ID card?'],
        ['🖥️','EVM & VVPAT','Voting technology','How does the EVM and VVPAT system work in Indian elections?'],
        ['⚖️','Election Commission','ECI powers & duties','What is the role and power of the Election Commission of India?'],
        ['🎙️','Contest Elections','Candidacy & nomination','How can I become a candidate and contest elections in India?'],
        ['📜','Model Code of Conduct','Rules during elections','What is the Model Code of Conduct in Indian elections and what are its rules?'],
        ['🏟️','Rajya Sabha','Upper house elections','How are Rajya Sabha members elected? Who votes for them?'],
        ['🔢','Vote Counting','Counting & results','How are votes counted in Indian elections and how is the winner decided?'],
        ['✋','NOTA Option','None of the above','What is NOTA and how does it work in Indian elections?'],
        ['💰','Campaign Finance','Spending limits & funds','How does election funding and campaign finance work in India?'],
        ['🌿','Voting Rights','Eligibility & rights','What are the voting rights of Indian citizens? Who is eligible to vote?'],
      ].map(([icon,title,sub,q]) =>
        `<div class="welcome-card" onclick="askChip('${q}')">
          <span class="wc-icon">${icon}</span>
          <div class="wc-title">${title}</div>
          <div class="wc-sub">${sub}</div>
        </div>`
      ).join('')}
    </div>`;
  chatArea.appendChild(w);
}

/* ============================
   Utils
   ============================ */
function scrollBottom() { chatArea.scrollTop = chatArea.scrollHeight; }

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
