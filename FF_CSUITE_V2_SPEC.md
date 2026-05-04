# FARRELL FLYNNE — C-SUITE APP V2 SPEC
## Running spec document — update as V1 is tested

Last updated: May 2026
Status: V1 deployed and live. Shared with Eric via Vercel URL. V2 items below ordered by priority.

---

## ARCHITECTURE DECISIONS (LOCKED)

These are decided. Do not revisit without a strong reason.

### Supabase as the shared brain
Every agent writes their reports and outputs to Supabase on schedule. Every agent reads from Supabase when answering chat questions. No agent-to-agent communication. No chained API calls. No cross-agent dependencies at runtime.

The mental model: a shared war room whiteboard. Agents post to it. Agents read from it. Nothing else.

**Why this matters:** Madrina answering a vision question that touches financials does not call Gambino. She reads Gambino's last report from Supabase. If Gambino's run failed last week, Madrina degrades gracefully — she references the last successful report and notes the date.

### No live QBO calls from chat
Gambino's scheduled runs (every 4 hours) post reconciliation results, cash flow snapshots, and P&L summaries to Supabase. Chat pulls those reports as context. Eric asks "who do we owe the most money to?" on a Tuesday — Gambino answers from Monday's report. Accurate enough. Zero QBO risk.

Live QBO calls from chat are explicitly out of scope until further notice.

### Report freshness labeling (required in V2)
When any agent loads context from Supabase, the report date must be included in the injected context so the agent can say "based on Gambino's report from Monday the 28th..." rather than presenting stale data as current. Simple metadata addition, significant trust impact.

### No agent-to-agent calls
Madrina does not call Gambino. Consigliere does not call Lucchese. Every agent reads from the shared Supabase brain. This eliminates cascading failures — if one agent's scheduled run fails, no other agent breaks.

---

## V2 FEATURE LIST — ORDERED BY PRIORITY

---

### 1. Supabase Context Injection (Chat Layer)
**Priority: Critical — build first**

**What:** On agent room open, pull the most recent reports for that agent from Supabase and inject them into the system prompt as context before any conversation begins. This is what makes agents useful beyond general Q&A. Without this, Gambino can't answer "who do we owe the most money to" with real data even if his Monday report is sitting in Supabase.

**Scope per agent:**
- Gambino: last PO reconciliation report, last cash flow snapshot, last P&L summary (3 reports)
- Bonnano: last pipeline summary, last lead gen plan (2 reports)
- Madrina: last Monday message, last quarterly brief, Gambino's last report, Bonnano's last pipeline summary (4 reports — she gets the full picture)
- Lucchese: last L10 prep brief, last platform audit (2 reports)
- Consigliere: last state-of-the-house briefing, all agents' most recent reports (full picture)
- Colombo: last SEO visibility check, last AI visibility audit (2 reports)

**Implementation:** Add a `loadAgentContext(agentId)` function that queries Supabase `reports` table filtered by agent, ordered by created_at desc, limit N. Inject as a `CONTEXT` block appended to the agent's system prompt string before the API call. Every injected block must include `Report date: [date]` as the first line.

---

### 2. Migrate Chat to Managed Agents API
**Priority: High — do once all 6 agents are built**

**What:** Currently the chat calls `v1/messages` directly with system prompts baked into the JSX. The agent IDs created at platform.claude.com are not being used by the app. Once all six agents are built and their prompts are stable, migrate the chat layer to invoke agents by ID instead of raw API calls. System prompts then live on Anthropic's platform, not in the codebase.

**Why wait:** Migrating now means migrating six times as each agent is built. Do it once at the end when all prompts are locked.

**Implementation:** Replace `callAgentAPI()` direct message call with Managed Agents API invocation using each agent's `AGENT_ID` from `.env`.

---

### 3. Supabase Auth Gate
**Priority: High — do before sharing with broader team**

**What:** App currently runs on a private Vercel URL with no login. Fine for Bailey and Eric. Not acceptable once the URL is shared more widely. Supabase Auth gates the app — unauthenticated users see a login screen, not the conference room.

**Implementation:** Supabase Auth (magic link preferred — no password to manage). Wrap the main app in an auth check. Each user (Bailey, Eric) gets their own account. User ID becomes the key for chat history and any future per-user data.

**Note:** Do this before adding any team members beyond Bailey and Eric.

---

### 4. API Key Security — Proxy Layer
**Priority: High — do alongside or just after Auth**

**What:** Move Anthropic API calls from the browser to a Vercel serverless function. Currently `VITE_ANTHROPIC_API_KEY` is bundled into client-side JavaScript and visible in browser source. Acceptable for a private internal tool between two people. Not acceptable once the URL is more broadly shared.

**Implementation:** Create `/api/chat.js` Vercel serverless function. Frontend sends `{ agentId, messages, context }` to `/api/chat`. Function adds the API key server-side and proxies to Anthropic. Streaming still works via Vercel streaming response support. API key moves from `VITE_ANTHROPIC_API_KEY` to `ANTHROPIC_API_KEY` (server-side only, never exposed to browser).

**Note:** Spend cap already set on Anthropic API key as interim safeguard.

---

### 5. File Upload in Chat
**Priority: Medium-high**

**What:** Each agent chat gets a file upload button. Bailey drops a spec sheet into Lucchese. Eric shares a vendor invoice with Gambino. Bailey uploads a lead tracker update for Bonnano. The agent reads the file and responds in context.

**Supported formats:**
- PDF — native Anthropic API support, send as base64
- Images (PNG, JPG) — native Anthropic API support, send as base64
- Excel / CSV — extract to text client-side (SheetJS for xlsx) before sending

**Implementation:** File input button in chat input area. On file select: read as base64, detect MIME type, include as a document or image block in the messages array alongside the text prompt. File size limit: 5MB recommended.

**Use cases by agent:**
- Gambino: vendor invoices, QBO exports, bank statements
- Bonnano: lead tracker updates, outreach lists, prospect research
- Lucchese: spec sheets, quote documents, install reports
- Consigliere: project status exports from platform
- Colombo: draft blog posts, SEO reports
- Madrina: anything — she reads the full picture

---

### 6. New Conversation Button
**Priority: Medium-high**

**What:** A reset icon in each agent room header that clears the conversation without closing the modal. Important for token cost management — long sessions get expensive as history accumulates.

**Implementation:** Trash/reset icon next to the close button in agent room header. On click: clear `messages` state, clear `conversationHistory` state, reset to initial agent greeting. Once persistent history is live, also clear that agent's Supabase history for the current user.

---

### 7. Persistent Chat History (Per Agent, Per User)
**Priority: Medium**

**What:** Conversation history survives page refresh and browser close. Each agent maintains separate history per user — Bailey's Gambino history is not Eric's Gambino history. No cross-visibility between users.

**Implementation:**
- Supabase table: `chat_history` with columns `user_id`, `agent_id`, `role`, `content`, `created_at`
- On agent room open: load last 20 messages from Supabase for that agent + user
- On each message: write to Supabase in real time
- Cap at 20 loaded messages — recency beats completeness

**Dependency:** Requires Supabase Auth (item #3) to have a user ID to key off.

---

### 8. Group Chat — Real API Routing
**Priority: Medium**

**What:** Group chat @mentions actually route to that agent's API. Currently group chat is cosmetic — messages don't go anywhere. `@Gambino what's our cash position?` should route to Gambino's API with his system prompt and return a real response in the thread.

**Implementation:**
- Parse message for `@AgentName` mentions
- If mention found: route to that agent's `callAgentAPI()` with system prompt + FF context
- If no mention: route to a lightweight orchestrator that picks the right agent or responds generally
- Agent responses labeled with agent name and color in the thread

**Note:** Tell Eric group chat is cosmetic in V1 so he doesn't try to use it.

---

### 9. Report Freshness Indicator
**Priority: Low — polish**

**What:** Updates tab shows a visual freshness indicator on the most recent report — green if within expected schedule window, amber approaching stale, red if overdue.

**Thresholds:**
- Gambino: green < 4 hours, amber 4–8 hours, red > 8 hours
- Madrina: green < 7 days, amber 7–10 days, red > 10 days
- Consigliere: green < 1 day, amber 1–2 days, red > 2 days
- Bonnano / Lucchese / Colombo: green < 7 days, amber 7–14 days, red > 14 days

---

### 10. Mobile — Swipe to Close
**Priority: Low — nice to have**

**What:** Agent room sheet dismisses on downward swipe on mobile.

**Implementation:** Touch event listeners on modal header. Track `touchstart` / `touchmove` / `touchend`. Net downward movement > 80px triggers `onClose()`.

---

## V1 BUGS / NOTES (log as found during testing)

- [ ] Test iOS Safari — confirm `92dvh` handles URL bar correctly
- [ ] Test Android Chrome
- [ ] Confirm streaming cursor renders on mobile
- [ ] Date in header — confirm timezone renders correctly for Bailey (San Diego) and Eric (NJ)
- [ ] Group chat is cosmetic in V1 — tell Eric before he tries to use it

---

## DECISIONS LOG

| Date | Decision | Reason |
|------|----------|--------|
| May 2026 | No live QBO calls from chat | Adds complexity and risk; scheduled reports are accurate enough |
| May 2026 | Supabase as shared brain (no agent-to-agent calls) | Eliminates cascading failures, simplifies architecture |
| May 2026 | V1 chat history resets on modal close | Acceptable short-term; persistent history is V2 item #7 |
| May 2026 | API key in browser for V1 | Private internal tool between Bailey and Eric only; move to proxy in V2 item #4 |
| May 2026 | Chat calls v1/messages directly, not Managed Agents API | System prompts still in flux as agents are built; migrate once all 6 are stable |
| May 2026 | No file upload in V1 | Not scoped initially; added as V2 item #5 after identifying real use cases per agent |
