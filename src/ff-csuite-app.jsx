import { useState, useEffect, useRef } from "react";
import agentRoomImg from "./assets/Agent_App_Render.png";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg: "#2C1F0E",
  surface: "#1E1409",
  surfaceRaised: "#2A1C0E",
  surfaceHigh: "#3A2510",
  border: "#2A2018",
  borderMid: "#3A2E20",
  gold: "#C4922A",
  goldBright: "#E8B84B",
  goldDim: "#6B4E18",
  goldFaint: "#1A1208",
  red: "#C43A2A",
  redDim: "#3A1210",
  green: "#4A9A6A",
  greenDim: "#1A3224",
  amber: "#C47A2A",
  amberDim: "#3A2410",
  blue: "#3A6A9A",
  blueDim: "#121E2A",
  purple: "#7A4A9A",
  purpleDim: "#1E1228",
  smoke: "rgba(10,7,5,0.85)",
  text: "#E8DDD0",
  textMid: "#9A8A78",
  textDim: "#5A4A3A",
};

// ── AGENT DATA ─────────────────────────────────────────────────────────────────
const AGENTS = [
  {
    id: "gambino", name: "Gambino", role: "CFO", title: "Chief Financial Officer",
    color: C.gold, colorDim: C.goldDim, colorFaint: C.goldFaint,
    status: "active", lastActive: "Today 8:30 AM",
    tagline: "He runs the financial streets so Eric doesn't have to.",
    expertise: ["PO Reconciliation", "Cash Flow", "Tax Advisory", "Vendor Payments", "Debt & Capital"],
    seat: { x: 468, y: 252 },
    latestReport: {
      title: "PO Reconciliation Report",
      date: "April 26, 2026",
      summary: "187 open POs · $1.5M exposure · 3 critical flags",
      flags: [
        { label: "CRITICAL", text: "PO #5780 Advance Group — invoice 5,293% over PO value", color: C.red },
        { label: "CRITICAL", text: "PO #5905 MGA Interior — invoice 2,517% over PO value", color: C.red },
        { label: "REVIEW", text: "6 Tier 2 likely matches need confirmation", color: C.amber },
        { label: "INFO", text: "$1.18M across 154 POs awaiting invoice", color: C.blue },
      ],
    },
    reports: [
      { title: "PO Reconciliation Report", date: "Apr 26", summary: "187 POs · 3 critical flags" },
      { title: "PO Reconciliation Report", date: "Apr 19", summary: "181 POs · 1 critical flag" },
      { title: "Cash Flow Snapshot", date: "Apr 15", summary: "30/60/90 day forecast updated" },
    ],
  },
  {
    id: "bonnano", name: "Bonnano", role: "BDR", title: "Business Development",
    color: "#4A8A5A", colorDim: "#1A2E1E", colorFaint: "#0A120A",
    status: "building", lastActive: "Not yet deployed",
    tagline: "Bailey's right hand in the field. Finds, researches, briefs.",
    expertise: ["Lead Research", "Outreach Briefs", "Pipeline Management", "Referral Network", "Proposal Tracking"],
    seat: { x: 342, y: 270 },
    latestReport: null,
    reports: [],
  },
  {
    id: "madrina", name: "Madrina", role: "CVO", title: "Chief Vision Officer",
    color: C.purple, colorDim: C.purpleDim, colorFaint: "#0E0A14",
    status: "active", lastActive: "Monday 8:00 AM",
    tagline: "The godmother. She holds the vision. Guards the mission.",
    expertise: ["Vision Accountability", "Goal Setting", "Faith & Culture", "RE Acquisition Path", "Eric Alignment"],
    seat: { x: 603, y: 270 },
    latestReport: {
      title: "Monday Morning Message",
      date: "April 21, 2026",
      summary: "Weekly vision check-in + scripture",
      flags: [
        { label: "WORD", text: "Habakkuk 2:2-3 — Write the vision, make it plain", color: C.purple },
        { label: "FOCUS", text: "Q2 pipeline momentum — Bonnano build is the priority", color: C.amber },
        { label: "QUESTION", text: "Where is the boutique hotel thesis vs 90 days ago?", color: C.blue },
      ],
    },
    reports: [
      { title: "Monday Morning Message", date: "Apr 21", summary: "Habakkuk 2:2-3 · Q2 focus" },
      { title: "Monday Morning Message", date: "Apr 14", summary: "Proverbs 16:3 · Vision check" },
      { title: "Quarterly Prep — Q2", date: "Apr 1", summary: "Q2 planning brief sent" },
    ],
  },
  {
    id: "lucchese", name: "Lucchese", role: "COO", title: "Chief Operations Officer",
    color: C.amber, colorDim: C.amberDim, colorFaint: "#120E06",
    status: "building", lastActive: "Not yet deployed",
    tagline: "Runs the ops engine. Spec → Quote → Status Sheet.",
    expertise: ["Spec → Quote Pipeline", "Monday L10 Prep", "Install Reports", "File Management", "SOP Capture"],
    seat: { x: 320, y: 460 },
    latestReport: null,
    reports: [],
  },
  {
    id: "consigliere", name: "Consigliere", role: "Intel", title: "Project Intelligence",
    color: C.blue, colorDim: C.blueDim, colorFaint: "#080C12",
    status: "building", lastActive: "Not yet deployed",
    tagline: "Situational awareness across all active projects.",
    expertise: ["Cross-Project Scan", "Vendor Risk Flags", "Client Responsiveness", "State of the House", "Monday Brief"],
    seat: { x: 680, y: 460 },
    latestReport: null,
    reports: [],
  },
  {
    id: "colombo", name: "Colombo", role: "CMO", title: "Content & SEO",
    color: C.red, colorDim: C.redDim, colorFaint: "#100808",
    status: "building", lastActive: "Not yet deployed",
    tagline: "Keeps FF visible. Blog pipeline + SEO + AI visibility.",
    expertise: ["Blog Pipeline", "SEO Monitoring", "AI Visibility Audit", "LinkedIn Content", "On-Demand SEO"],
    seat: { x: 500, y: 460 },
    latestReport: null,
    reports: [],
  },
];

const GROUP_MESSAGES = [
  { from: "Gambino", time: "8:31 AM", text: "PO Reconciliation complete. 3 critical flags — Advance Group and MGA Interior need Eric's eyes today. Full report in my room.", color: C.gold },
  { from: "Madrina", time: "8:00 AM Mon", text: "Good morning Bailey and Eric. Habakkuk 2:2-3. Write the vision, make it plain. This week — Bonnano build is the priority. The pipeline doesn't grow itself.", color: C.purple },
  { from: "System", time: "Apr 19", text: "Gambino's weekly reconciliation posted. Madrina's Monday message delivered.", color: C.textDim },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

// ── FF BUSINESS CONTEXT (shared across all agents) ───────────────────────────
const FF_CONTEXT = `
FARRELL FLYNNE — BUSINESS CONTEXT

Farrell Flynne is a luxury FF&E and OS&E procurement firm based in New Jersey, operating nationally.
Current revenue: $7–8M top line at 7% margins. Target: $12M at 10%+ margins.

PRINCIPALS:
- Bailey Fait — Co-owner. Leads vision, business development, client relationships, technology. Construction background (GC on professional sports stadiums and high-rise resorts). Based in San Diego. On paternity leave ~April 2026.
- Eric Clewis — Co-owner. Leads operations, day-to-day project management, financials.

TEAM:
- Stephanie — Project Director, NY office (currently on maternity leave)
- John — Project Director, NJ office. Owner mindset, being groomed for ownership track.
- Marina — Project Manager, Brazil. Architect by trade.
- Thainá — Project Manager, Brazil. Designer by trade.

THE PLATFORM:
Proprietary FF&E procurement platform built in-house (Lovable + Supabase). Handles multi-project dashboards, full FF&E schedules, financials with markup/freight/tax logic, change log, lead time forecasting, PDF/Excel export, AI-powered spec sheet parsing. This is a genuine competitive differentiator — competitors like Carroll Adams use white-labeled software from Sigma Sourcing (Lenexa, KS), licensed to 23+ firms. Farrell Flynne's platform is proprietary and unlicensable.

CLIENT MIX:
Hospitality (hotels, boutique brands), multifamily, luxury residential. Embedded partner model — not a vendor but part of the project team. Both FF&E and OS&E scope. Developer and architect background is rare and differentiating.

KEY RELATIONSHIPS:
- Design partners: INC Architecture & Design, Morris Adjmi
- Active BD targets: EDG Design (Jane, Brooke), Origin Hotels/Thrash Group (Ellen, Karen)
- Appointment setter being onboarded for outreach to property management firms, luxury RE agents, active developers

VISION:
Own a small boutique hotel or mixed-use building — brand showcase, credibility with developer ICPs, equity building. Long-term target: $12M FF revenue + real estate ownership.

FAITH:
Both principals have a deep-rooted Christian faith. Biblical stewardship and identity are core decision-making lenses. Influenced by Dr. Ben Hardy's future-self framework.

TONE FOR ALL COMMUNICATIONS:
Embedded. Premium. No fluff. Relationship-driven. Confident, direct, occasionally contrarian. No corporate speak.
`;

const AGENT_SYSTEM_PROMPTS = {
  gambino: `You are Gambino — CFO and Financial Intelligence agent for Farrell Flynne. You serve Eric Clewis primarily, and both principals.

${FF_CONTEXT}

YOUR ROLE:
You run financial intelligence so Eric doesn't have to live in QuickBooks Online. You surface what matters, flag what's at risk, and keep the books clean.

YOUR EXPERTISE:
- PO reconciliation (3-tier matching: Exact / Likely / Unresolved)
- Cash flow analysis and forecasting (30/60/90 day)
- Overdue invoice tracking (inbound and outbound)
- Markup tracking across platform items
- State sales tax tracking (NY, NJ, MD, AZ and expanding)
- Quarterly tax payment planning
- Vendor payment terms, deposit schedules, net terms, retainage
- SBA loan monitoring and refinancing opportunities
- Subscription tracking across FF and Done PS
- QBO report reading (P&L, A/R, A/P summaries)

CRITICAL RULES:
- You are READ ONLY on QuickBooks. You NEVER suggest or initiate payments. Eric executes all financial actions in QBO.
- Every PO match shows evidence — vendor, project keyword, amount delta, PO # status. Never silent matching.
- Every tax advisory response opens with: "I am not a licensed tax advisor. The following is informational only — consult your CPA before taking action." Then proceed.
- Confidence levels on all reconciliation: Exact / Likely / Unresolved. Likely and Unresolved require human confirmation.

PERSONALITY:
Direct, precise, numbers-first. No filler. If Eric or Bailey asks a financial question, lead with the answer then support it with data. Flag problems before they become crises.`,

  bonnano: `You are Bonnano — BDR and Business Development agent for Farrell Flynne. You serve Bailey Fait primarily, and both principals.

${FF_CONTEXT}

YOUR ROLE:
You are Bailey's right hand in the field. You generate, qualify, and track leads so Bailey can focus on relationships and closing. You are the highest revenue-impact agent in the system — more qualified pipeline is the direct path from $8M to $12M.

YOUR EXPERTISE:
- Lead research and intelligence (BLDUP monitoring for luxury hospitality and multifamily projects)
- Interior designer outreach briefs (5 briefs per session, open web research)
- Luxury residential property management firm targeting
- Pipeline management and CRM updates
- Referral network mapping (warm contacts, last touch, re-engagement timing)
- Proposal follow-up tracking (flag cold proposals past 7 days no response)
- Monthly trend analysis (where deals come from, where they die, pivot recommendations)
- Pre-call briefs for Bailey before outreach calls

KEY TARGETS:
- Interior design firms and architects (Bailey and Eric's direct channel)
- Property management firms (luxury residential)
- Active developers (via BLDUP list)
- Luxury real estate agents
- Leasing and sales offices

CURRENT ACTIVE LEADS:
- EDG Design (contacts: Jane and Brooke) — warm from HD Summit
- Origin Hotels / Thrash Group (contacts: Ellen and Karen)

RULES:
- V1: research and brief generation only — no outbound email sending
- Always have outreach drafts ready for Bailey to review and send himself
- Qualify against: project size, market, decision-maker access, timeline

PERSONALITY:
Strategic, proactive, brief-oriented. You don't wait for Bailey to ask — you surface opportunities. Lead with the most actionable intel, not background noise.`,

  madrina: `You are Madrina — CVO (Chief Vision Officer) for Farrell Flynne. You serve both Bailey Fait and Eric Clewis.

${FF_CONTEXT}

YOUR ROLE:
You are the godmother. You hold the vision, guard the mission, and make sure the day-to-day never swallows the long-term. You can't run a business successfully without having the mind right and the vision right. That's your entire job.

YOUR EXPERTISE:
- Vision accountability — keeping the boutique hotel / RE acquisition thesis alive and progressing
- Quarterly and annual goal-setting coordination
- Eric alignment monitoring (flag when vision-level items go untouched)
- Faith and culture — daily scripture, biblical stewardship framing, Ben Hardy future-self touchpoints
- Cross-agent summary reading — ingesting Gambino and Bonnano outputs to confirm the business is on course
- Loan structure collaboration with Gambino for RE vision alignment

DAILY PRACTICE:
Every Monday morning you deliver a scripture and brief encouragement. You inject faith-based stewardship framing into all goal-setting sessions. You operate from a biblical worldview.

KEY VISION ITEMS TO TRACK:
- Path to $12M top line at 10%+ margins
- Boutique hotel or mixed-use building acquisition (brand showcase + equity)
- Bailey's income gap ($50k/yr salary, no distributions yet — needs to improve)
- Both principals' alignment on long-term vision

PERSONALITY:
Wise, grounding, occasionally challenging. You ask the questions no one wants to ask. You hold the long game when everyone else is in the weeds. You speak with warmth and conviction.`,

  lucchese: `You are Lucchese — COO (Chief Operations Officer) for Farrell Flynne. You serve both principals.

${FF_CONTEXT}

YOUR ROLE:
You run the ops engine. With Stephanie on maternity leave, your most important job right now is making the spec sheet → quote → status sheet pipeline fast enough that Bailey and Eric can step in without losing a step.

YOUR EXPERTISE:
- Spec sheet → bid request → quote tracking → comparison sheet pipeline
- Vendor outreach formatting and tracking
- Monday L10 prep (Sunday night platform data pull, open items, project status brief)
- Install report monitoring (flag issues, log to L10 brief)
- Weekly platform audit (stale projects, missing data, incomplete records)
- File management and SOP capture
- New client package generation (COI, Installer SOP, Success Factors, Terms & Conditions)
- Change order logging from platform into client folders

CURRENT PRIORITY:
Stephanie is on maternity leave. John (NJ Project Director) is holding down ops. You support the team in keeping the spec-to-quote pipeline moving without dropping anything.

PERSONALITY:
Operational, precise, systems-minded. You think in checklists and pipelines. When something is broken in the process, you name it and propose a fix. No drama, just execution.`,

  consigliere: `You are Consigliere — Project Intelligence agent for Farrell Flynne. You serve both principals.

${FF_CONTEXT}

YOUR ROLE:
Situational awareness across all active projects. Not financials (that's Gambino) and not ops tasks (that's Lucchese) — you read across all active projects and tell Bailey and Eric what needs their attention before it becomes a problem.

YOUR EXPERTISE:
- Cross-project status scanning (flag anything stuck, overdue, or without update in 5+ days)
- Vendor cross-project risk (same vendor flagged late or problematic on 2+ projects simultaneously)
- Client responsiveness tracking (submittals or approvals sitting unanswered)
- Weekly "state of the house" briefing — project health by status (on track / at risk / critical)
- Top 3 items requiring principal attention each week
- Vendor and client pattern recognition across the full portfolio

THRESHOLDS:
- No status update in 5 days → flag
- Proposal unanswered past 7 days → flag
- Same vendor problematic on 2+ projects → immediate flag

PERSONALITY:
Calm, observant, proactive. You're the one who sees things before they become fires. You don't panic, but you don't let things slide either. Brief and direct — Bailey and Eric don't need essays, they need signal.`,

  colombo: `You are Colombo — CMO (Content & SEO) for Farrell Flynne. You serve both principals.

${FF_CONTEXT}

YOUR ROLE:
Keep Farrell Flynne visible online and maintain the content pipeline. Scope is intentionally focused: blog writing from the existing content queue, SEO support on demand, and AI visibility monitoring.

YOUR EXPERTISE:
- Blog content pipeline (25+ posts queued, SEO-optimized structure)
- SEO rank tracking (monthly visibility check on target keywords)
- AI visibility audit (monthly — how FF appears in Claude, Perplexity, ChatGPT searches)
- LinkedIn content strategy (Bailey's contrarian/direct voice)
- On-demand SEO support for specific pages or posts
- Schema markup and technical SEO
- Google Business Profile optimization
- Hospitality-specific directory listings (Clutch, etc.)

CURRENT SEO STATUS:
- Ranking #1 organically for FF&E firms in New Jersey
- Ranking #1 on ChatGPT for relevant queries
- Not yet appearing in Google AI Overviews (AIO)
- Next steps: Clutch profile with reviews, LocalBusiness/FAQPage schema, hospitality directories

RULES:
- No autonomous publishing. All content staged for Bailey's review before it goes live.
- Blog posts follow SEO-optimized structure: title, meta, headers, internal links, Rank Math targets.
- Flag when the blog pipeline is running low.

PERSONALITY:
Strategic about visibility. You understand that being found is the first sale. You write in Farrell Flynne's voice — confident, direct, no filler — not generic marketing speak.`,
};

// ── API CALL ──────────────────────────────────────────────────────────────────
async function callAgentAPI(agentId, conversationHistory, onChunk, onDone, onError) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    onError("VITE_ANTHROPIC_API_KEY not set. Add it to your .env file.");
    return;
  }

  const systemPrompt = AGENT_SYSTEM_PROMPTS[agentId] || `You are a Farrell Flynne AI agent. ${FF_CONTEXT}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        stream: true,
        system: systemPrompt,
        messages: conversationHistory,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      onError(err?.error?.message || "API error");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
            onChunk(parsed.delta.text);
          }
        } catch {}
      }
    }
    onDone();
  } catch (err) {
    onError(err.message || "Network error");
  }
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function StatusDot({ status, size = 8 }) {
  const colors = { active: C.green, building: C.amber, idle: C.textDim };
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[status] || C.textDim,
      boxShadow: status === "active" ? `0 0 ${size}px ${colors[status]}` : "none",
      flexShrink: 0,
    }} />
  );
}

function ReportCard({ report, agent, expanded, onToggle }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 6, overflow: "hidden", marginBottom: 8,
      transition: "border-color 0.2s",
    }}>
      <div
        onClick={onToggle}
        style={{
          padding: "12px 16px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: expanded ? C.surfaceRaised : "transparent",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusDot status="active" size={6} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>{report.title}</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{report.date} · {report.summary}</div>
          </div>
        </div>
        <div style={{ color: C.textDim, fontSize: 14, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</div>
      </div>
      {expanded && agent.latestReport && (
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}` }}>
          {agent.latestReport.flags.map((flag, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{
                background: flag.color + "22", color: flag.color,
                border: `1px solid ${flag.color}44`,
                borderRadius: 3, padding: "2px 7px", fontSize: 9,
                fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace",
                flexShrink: 0, marginTop: 1,
              }}>{flag.label}</span>
              <span style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5, fontFamily: "'Outfit', sans-serif" }}>{flag.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AgentRoom({ agent, onClose }) {
  const [tab, setTab] = useState("updates");
  const [expandedReport, setExpandedReport] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: agent.name, text: `${agent.name} online. ${agent.tagline}`, time: nowLabel() }
  ]);
  const isMobile = useIsMobile();
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg = { from: "You", text, time: nowLabel() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setIsStreaming(true);

    const newHistory = [...conversationHistory, { role: "user", content: text }];
    setConversationHistory(newHistory);

    const streamingId = Date.now();
    setMessages(m => [...m, { from: agent.name, text: "", time: nowLabel(), id: streamingId, streaming: true }]);

    let fullText = "";

    await callAgentAPI(
      agent.id,
      newHistory,
      (chunk) => {
        fullText += chunk;
        setMessages(m => m.map(msg =>
          msg.id === streamingId ? { ...msg, text: fullText } : msg
        ));
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      },
      () => {
        setMessages(m => m.map(msg =>
          msg.id === streamingId ? { ...msg, streaming: false } : msg
        ));
        setConversationHistory(h => [...h, { role: "assistant", content: fullText }]);
        setIsStreaming(false);
        inputRef.current?.focus();
      },
      (errMsg) => {
        setMessages(m => m.map(msg =>
          msg.id === streamingId ? { ...msg, text: `Error: ${errMsg}`, streaming: false, error: true } : msg
        ));
        setIsStreaming(false);
      }
    );
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: C.smoke,
      display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center",
      zIndex: 100, padding: isMobile ? 0 : 24,
    }}>
      <div style={{
        width: "100%", maxWidth: isMobile ? "100%" : 720,
        height: isMobile ? "92dvh" : "85vh",
        background: C.surface, border: `1px solid ${agent.color}44`,
        borderRadius: isMobile ? "16px 16px 0 0" : 10,
        display: "flex", flexDirection: "column",
        overflow: "hidden", boxShadow: `0 0 60px ${agent.color}18`,
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
          background: C.surfaceRaised,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: agent.colorFaint, border: `2px solid ${agent.color}66`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: agent.color,
            }}>{agent.name[0]}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: C.text }}>{agent.name}</span>
                <span style={{ fontSize: 11, color: agent.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>{agent.role}</span>
                <StatusDot status={agent.status} />
              </div>
              <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Outfit', sans-serif" }}>{agent.title}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: C.textDim,
            fontSize: 20, cursor: "pointer", padding: "8px 12px",
            minWidth: 44, minHeight: 44,
          }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
          {["updates", "chat"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, background: "none", border: "none",
              borderBottom: tab === t ? `2px solid ${agent.color}` : "2px solid transparent",
              color: tab === t ? agent.color : C.textDim,
              padding: "14px 10px", cursor: "pointer", fontSize: 12,
              fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace", marginBottom: -1,
            }}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          {tab === "updates" && (
            <div>
              {agent.status === "building" ? (
                <div style={{ textAlign: "center", padding: 60, color: C.textDim }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🔧</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.textMid, marginBottom: 8 }}>{agent.name} is being built</div>
                  <div style={{ fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>Reports will appear here once deployed</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>Reports — newest first</div>
                  {agent.reports.map((report, i) => (
                    <ReportCard
                      key={i} report={report} agent={agent}
                      expanded={expandedReport === i}
                      onToggle={() => setExpandedReport(expandedReport === i ? null : i)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "chat" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {messages.map((msg, i) => (
                  <div key={msg.id || i} style={{
                    marginBottom: 12,
                    display: "flex", flexDirection: "column",
                    alignItems: msg.from === "You" ? "flex-end" : "flex-start",
                  }}>
                    <div style={{
                      maxWidth: "80%", padding: "10px 14px",
                      background: msg.from === "You" ? agent.color + "22" : msg.error ? C.red + "22" : C.surfaceRaised,
                      border: `1px solid ${msg.from === "You" ? agent.color + "44" : msg.error ? C.red + "44" : C.border}`,
                      borderRadius: 8, fontSize: 13, color: msg.error ? C.red : C.text,
                      fontFamily: "'Outfit', sans-serif", lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}>
                      {msg.text || (msg.streaming ? "" : "")}
                      {msg.streaming && (
                        <span style={{
                          display: "inline-block", width: 8, height: 14,
                          background: agent.color, marginLeft: 2, verticalAlign: "middle",
                          animation: "blink 1s step-end infinite",
                        }} />
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: C.textDim, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                      {msg.from} · {msg.time}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </div>
          )}
        </div>

        {/* Chat input */}
        {tab === "chat" && (
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={isStreaming ? `${agent.name} is responding…` : `Ask ${agent.name} anything…`}
              disabled={isStreaming}
              style={{
                flex: 1, background: C.surfaceRaised, border: `1px solid ${C.border}`,
                borderRadius: 6, padding: "10px 14px", color: isStreaming ? C.textDim : C.text,
                fontSize: isMobile ? 16 : 13, fontFamily: "'Outfit', sans-serif", outline: "none",
                opacity: isStreaming ? 0.6 : 1,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
              style={{
                background: isStreaming || !input.trim() ? C.goldDim : agent.color,
                border: "none", borderRadius: 6,
                padding: "10px 16px", cursor: isStreaming || !input.trim() ? "default" : "pointer",
                color: "#000", fontSize: 13, fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                transition: "background 0.2s",
              }}
            >{isStreaming ? "…" : "Send"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function GroupChat({ onClose }) {
  const isMobile = useIsMobile();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(GROUP_MESSAGES);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { from: "Bailey", time: "Now", text: input, color: C.goldBright }]);
    setInput("");
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: C.smoke,
      display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center",
      zIndex: 100, padding: isMobile ? 0 : 24,
    }}>
      <div style={{
        width: "100%", maxWidth: isMobile ? "100%" : 720,
        height: isMobile ? "92dvh" : "85vh",
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: isMobile ? "16px 16px 0 0" : 10,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
          background: C.surfaceRaised, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: C.goldBright }}>The Family</div>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'JetBrains Mono', monospace" }}>Bailey · Eric · All Agents</div>
          </div>
          <div style={{ display: "flex", gap: -4 }}>
            {AGENTS.filter(a => a.status === "active").map(a => (
              <div key={a.id} style={{
                width: 28, height: 28, borderRadius: "50%",
                background: a.colorFaint, border: `2px solid ${a.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: a.color, fontWeight: 700,
                fontFamily: "'Cormorant Garamond', serif", marginLeft: -6,
              }}>{a.name[0]}</div>
            ))}
          </div>
          {onClose && (
            <button onClick={onClose} style={{
              background: "none", border: "none", color: C.textDim,
              fontSize: 20, cursor: "pointer", padding: "8px 12px",
              minWidth: 44, minHeight: 44,
            }}>✕</button>
          )}
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column",
              alignItems: msg.from === "Bailey" ? "flex-end" : msg.from === "System" ? "center" : "flex-start",
            }}>
              {msg.from === "System" ? (
                <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'JetBrains Mono', monospace", padding: "4px 12px", background: C.surfaceRaised, borderRadius: 20 }}>{msg.text}</div>
              ) : (
                <>
                  <div style={{
                    maxWidth: "75%", padding: "10px 14px",
                    background: msg.from === "Bailey" ? C.goldFaint : C.surfaceRaised,
                    border: `1px solid ${msg.from === "Bailey" ? C.goldDim : C.border}`,
                    borderRadius: 8, fontSize: 13, color: C.text,
                    fontFamily: "'Outfit', sans-serif", lineHeight: 1.6,
                  }}>{msg.text}</div>
                  <div style={{ fontSize: 10, color: C.textDim, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                    <span style={{ color: msg.color }}>{msg.from}</span> · {msg.time}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Message the family… @Gambino @Bonnano @Madrina"
            style={{
              flex: 1, background: C.surfaceRaised, border: `1px solid ${C.border}`,
              borderRadius: 6, padding: "10px 14px", color: C.text,
              fontSize: isMobile ? 16 : 13, fontFamily: "'Outfit', sans-serif", outline: "none",
            }}
          />
          <button onClick={sendMessage} style={{
            background: C.gold, border: "none", borderRadius: 6,
            padding: "10px 16px", cursor: "pointer", color: "#000",
            fontSize: 13, fontWeight: 700, fontFamily: "'Outfit', sans-serif",
          }}>Send</button>
        </div>
      </div>
    </div>
  );
}

// ── CONFERENCE TABLE SVG ──────────────────────────────────────────────────────
function ConferenceRoom({ agents, onSelectAgent, onOpenGroup }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 900, margin: "0 auto", aspectRatio: "3/2", overflow: "hidden" }}>
      <img
        src={agentRoomImg}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Agent seats — positioned absolutely over image */}
      {agents.map(agent => {
        const pct = { x: agent.seat.x / 900 * 100, y: agent.seat.y / 600 * 100 };
        const isHovered = hovered === agent.id;
        const isActive = agent.status === "active";

        return (
          <div
            key={agent.id}
            onMouseEnter={() => setHovered(agent.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelectAgent(agent)}
            style={{
              position: "absolute",
              left: `${pct.x}%`, top: `${pct.y}%`,
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              transition: "transform 0.2s",
              zIndex: isHovered ? 10 : 1,
            }}
          >
            {/* Glow behind seat */}
            <div style={{
              position: "absolute", inset: -20,
              background: agent.color,
              borderRadius: "50%", opacity: isHovered ? 0.15 : isActive ? 0.06 : 0.03,
              filter: "blur(12px)",
              transition: "opacity 0.3s",
            }} />

            {/* Seat */}
            <div style={{
              width: isHovered ? 70 : 64,
              height: isHovered ? 70 : 64,
              borderRadius: "50%",
              background: isHovered ? agent.colorDim : C.surfaceRaised,
              border: `2px solid ${isHovered ? agent.color : agent.color + "55"}`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              position: "relative",
              boxShadow: isHovered ? `0 0 20px ${agent.color}44` : "none",
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isHovered ? 11 : 10,
                fontWeight: 700, color: agent.color,
                letterSpacing: "0.05em", lineHeight: 1.2,
                textAlign: "center",
              }}>{agent.name}</div>
              <div style={{
                fontSize: 8, color: agent.color + "99",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.06em",
              }}>{agent.role}</div>

              {/* Status dot */}
              <div style={{
                position: "absolute", bottom: 4, right: 4,
                width: 8, height: 8, borderRadius: "50%",
                background: isActive ? C.green : C.amber,
                boxShadow: isActive ? `0 0 6px ${C.green}` : "none",
              }} />
            </div>

            {/* Tooltip on hover */}
            {isHovered && (
              <div style={{
                position: "absolute",
                top: "110%", left: "50%",
                transform: "translateX(-50%)",
                background: C.surfaceHigh,
                border: `1px solid ${agent.color}44`,
                borderRadius: 6, padding: "8px 12px",
                width: 180, zIndex: 20,
                boxShadow: `0 8px 24px rgba(0,0,0,0.6)`,
                pointerEvents: "none",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: agent.color, fontFamily: "'Cormorant Garamond', serif", marginBottom: 4 }}>{agent.title}</div>
                <div style={{ fontSize: 11, color: C.textMid, fontFamily: "'Outfit', sans-serif", lineHeight: 1.5 }}>{agent.tagline}</div>
                <div style={{ marginTop: 6, fontSize: 10, color: C.textDim, fontFamily: "'JetBrains Mono', monospace" }}>
                  {agent.status === "active" ? `Last active: ${agent.lastActive}` : "⚙ Building..."}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Group chat button */}
      <div
        onClick={onOpenGroup}
        style={{
          position: "absolute",
          bottom: "6%", left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
          background: C.surfaceRaised,
          border: `1px solid ${C.goldDim}`,
          borderRadius: 20, padding: "8px 20px",
          display: "flex", alignItems: "center", gap: 8,
          transition: "all 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
        onMouseLeave={e => e.currentTarget.style.borderColor = C.goldDim}
      >
        <div style={{ fontSize: 14 }}>💬</div>
        <span style={{ fontSize: 12, color: C.goldBright, fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>The Family</span>
        <div style={{ background: C.red, color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>2</div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function FFCSuite() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'Outfit', sans-serif",
      opacity: loaded ? 1 : 0, transition: "opacity 0.6s",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>

      {/* Header */}
      <div style={{
        padding: "20px 32px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${C.border}`,
        background: C.surface,
      }}>
        <div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 24, fontWeight: 700, color: C.goldBright,
            letterSpacing: "0.05em",
          }}>FARRELL FLYNNE</div>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", display: "block" }}>C-Suite Command</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <StatusDot status="active" />
            <span style={{ fontSize: 11, color: C.textMid, fontFamily: "'JetBrains Mono', monospace" }}>{AGENTS.filter(a => a.status === "active").length} agents active</span>
          </div>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'JetBrains Mono', monospace" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
        <div style={{
          fontSize: 11, color: C.textDim,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.15em", textTransform: "uppercase",
        }}>The Family is assembled. Click a seat to enter.</div>
      </div>

      {/* Conference Room */}
      <div style={{ padding: "0 24px 40px" }}>
        <ConferenceRoom
          agents={AGENTS}
          onSelectAgent={setSelectedAgent}
          onOpenGroup={() => setGroupOpen(true)}
        />
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 24,
        padding: "0 0 32px", flexWrap: "wrap",
      }}>
        {[
          { color: C.green, label: "Active" },
          { color: C.amber, label: "Building" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <StatusDot status={item.label.toLowerCase()} size={7} />
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</span>
          </div>
        ))}
        {AGENTS.map(a => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.color, opacity: 0.7 }} />
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{a.name}</span>
          </div>
        ))}
      </div>

      {/* Modals */}
      {selectedAgent && <AgentRoom agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
      {groupOpen && <GroupChat onClose={() => setGroupOpen(false)} />}
    </div>
  );
}
