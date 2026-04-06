/* ═══════════════════════════════════════════════
   AI Lab Scenario Configuration
   Extensible structure for multi-industry simulations
   ═══════════════════════════════════════════════ */

export interface ScenarioConfig {
  id: string;
  industry: "tech" | "finance" | "retail";
  title: string;
  context: string;
  winningCondition: string;
  complianceRules: string[];
  systemPrompt: string;
  /** Commands handled locally in React (no API call) */
  localCommands: Record<string, string>;
}

/** Response shape enforced by the JSON fence in the system prompt */
export interface SandboxResponse {
  terminalOutput: string;
  mentorHint: string;
  complianceScore: number;
}

/* ── Local command outputs (zero tokens) ── */
const TECH_LOCAL_COMMANDS: Record<string, string> = {
  help: [
    "Available commands:",
    "  help              — Show this message",
    "  ls                — List resources in current scope",
    "  clear             — Clear terminal",
    "  status            — Show cluster health",
    "  inspect <target>  — Inspect a resource (uses AI)",
    "  apply <action>    — Apply a change (uses AI)",
    "  logs <service>    — View service logs (uses AI)",
    "  rollback          — Revert last change (uses AI)",
  ].join("\n"),
  ls: [
    "cluster-a/",
    "  ├── service: api-gateway       [HEALTHY]",
    "  ├── service: user-service      [HEALTHY]",
    "  ├── service: payment-service   [DEGRADED]",
    "  ├── db: postgres-primary       [TIMEOUT]",
    "  ├── sg: sg-01 (api-ingress)    [OK]",
    "  ├── sg: sg-02 (internal)       [OK]",
    "  ├── sg: sg-03 (monitoring)     [OK]",
    "  └── sg: sg-04 (db-access)      [REVIEW]",
  ].join("\n"),
  status: [
    "╔══════════════════════════════════════════╗",
    "║  CLUSTER-A HEALTH DASHBOARD             ║",
    "╠══════════════════════════════════════════╣",
    "║  API Gateway      ● HEALTHY             ║",
    "║  User Service      ● HEALTHY             ║",
    "║  Payment Service   ◐ DEGRADED            ║",
    "║  Postgres Primary  ✕ CONNECTION TIMEOUT   ║",
    "║  Port 5432         ✕ UNREACHABLE          ║",
    "╠══════════════════════════════════════════╣",
    "║  Alert: DB timeout detected 4m ago       ║",
    "║  Affected: payment-service → postgres    ║",
    "╚══════════════════════════════════════════╝",
  ].join("\n"),
  clear: "__CLEAR__",
};

/* ── Scenario definitions ── */

export const scenarios: Record<string, ScenarioConfig> = {
  "tech-sre-sandbox": {
    id: "tech-sre-sandbox",
    industry: "tech",
    title: "Mission-Critical Sandbox",
    context:
      "Production DB Connection Timeout (Port 5432) detected in Cluster-A. " +
      "The payment-service cannot reach postgres-primary. " +
      "Security Group sg-04 controls database access. " +
      "The root cause is an incorrect CIDR block in sg-04 inbound rules " +
      "that was changed during a recent infrastructure update.",
    winningCondition:
      "User correctly identifies and fixes the CIDR block in Security Group sg-04.",
    complianceRules: [
      "Check logs first before making changes",
      "No 0.0.0.0/0 exposure — never open to all",
      "Use read-only access for initial triage",
    ],
    systemPrompt: [
      "You are a Heuristic SRE Mentor in a training simulation.",
      "NEVER give the direct answer. Guide through Socratic questioning.",
      "",
      "SCENARIO:",
      "Production DB Connection Timeout (Port 5432) in Cluster-A.",
      "payment-service cannot reach postgres-primary.",
      "Root cause: incorrect CIDR block in Security Group sg-04.",
      "",
      "COMPLIANCE RULES the learner must follow:",
      "1. Check logs first before making changes",
      "2. No 0.0.0.0/0 exposure — never open to all",
      "3. Use read-only access for initial triage",
      "",
      "WINNING CONDITION: User correctly identifies and fixes the CIDR in sg-04.",
      "",
      "RESPONSE FORMAT — you MUST respond with valid JSON only, no markdown fences:",
      '{',
      '  "terminalOutput": "Simulated bash/system output responding to the user command",',
      '  "mentorHint": "A Socratic pedagogical nudge — ask questions, never reveal the answer",',
      '  "complianceScore": <number 0-100 reflecting how well the user follows rules>',
      '}',
      "",
      "If the user violates a compliance rule, reduce the score and explain why in mentorHint.",
      "If the user opens 0.0.0.0/0, set complianceScore to 0 and warn strongly.",
      "Start complianceScore at 70 and adjust based on behavior.",
      "Simulate realistic terminal output for inspect/logs/apply commands.",
    ].join("\n"),
    localCommands: TECH_LOCAL_COMMANDS,
  },

  "finance-compliance-sandbox": {
    id: "finance-compliance-sandbox",
    industry: "finance",
    title: "Audit-Safe Compliance Sim",
    context:
      "You are a newly hired compliance analyst at a mid-cap investment firm. " +
      "A high-net-worth client has requested a complex cross-border fund transfer " +
      "involving jurisdictions with elevated AML risk. " +
      "You must evaluate the request using internal policy, flag risks, and " +
      "produce an audit-safe recommendation — all while under time pressure.",
    winningCondition:
      "User correctly identifies the AML red flags, applies the Enhanced Due Diligence (EDD) protocol, and produces a compliant recommendation with full audit trail.",
    complianceRules: [
      "Always cite the specific policy clause",
      "Flag Politically Exposed Persons (PEP) status",
      "Never approve without risk scoring",
      "Document every decision for audit trail",
    ],
    systemPrompt: [
      "You are a RAG-Anchored Compliance Mentor in a financial training simulation.",
      "NEVER give the direct answer. Guide through Socratic questioning.",
      "Every response must reference verifiable compliance frameworks (AML, KYC, EDD).",
      "",
      "SCENARIO:",
      "High-net-worth client requesting cross-border fund transfer.",
      "Jurisdictions: US → Switzerland → Singapore.",
      "Client flagged as potential PEP (Politically Exposed Person).",
      "Transfer amount: $2.4M across 3 tranches.",
      "The learner must apply Enhanced Due Diligence.",
      "",
      "COMPLIANCE RULES the learner must follow:",
      "1. Always cite the specific policy clause when making a decision",
      "2. Flag PEP status and escalate appropriately",
      "3. Never approve without completing risk scoring",
      "4. Document every decision for audit trail",
      "",
      "WINNING CONDITION: Correct AML red-flag identification + EDD protocol + compliant recommendation.",
      "",
      "RESPONSE FORMAT — you MUST respond with valid JSON only, no markdown fences:",
      '{',
      '  "terminalOutput": "System response — case file updates, policy lookups, risk scores",',
      '  "mentorHint": "A Socratic pedagogical nudge referencing compliance frameworks",',
      '  "complianceScore": <number 0-100 reflecting adherence to audit standards>',
      '}',
      "",
      "If the learner skips due diligence steps, reduce complianceScore and explain the audit risk.",
      "If the learner attempts to approve without risk scoring, set complianceScore to 10.",
      "Start complianceScore at 60 and adjust based on behavior.",
      "Simulate realistic compliance system outputs.",
    ].join("\n"),
    localCommands: {
      help: [
        "Available commands:",
        "  help                — Show this message",
        "  ls                  — List open cases",
        "  clear               — Clear terminal",
        "  status              — Current case status",
        "  review <section>    — Review case section (uses AI)",
        "  lookup <policy>     — Search compliance policy (uses AI)",
        "  flag <risk>         — Flag a risk item (uses AI)",
        "  recommend <action>  — Submit recommendation (uses AI)",
        "  score               — Request risk scoring (uses AI)",
      ].join("\n"),
      ls: [
        "OPEN CASES:",
        "  ┌─────────────────────────────────────────────┐",
        "  │  CASE-2024-0847                             │",
        "  │  Client: ████████ (Redacted)                │",
        "  │  Type: Cross-Border Fund Transfer           │",
        "  │  Amount: $2,400,000 (3 tranches)            │",
        "  │  Route: US → Switzerland → Singapore        │",
        "  │  Status: PENDING REVIEW                     │",
        "  │  Priority: HIGH                             │",
        "  │  PEP Flag: UNRESOLVED                       │",
        "  └─────────────────────────────────────────────┘",
      ].join("\n"),
      status: [
        "╔══════════════════════════════════════════════╗",
        "║  CASE-2024-0847  ·  COMPLIANCE DASHBOARD    ║",
        "╠══════════════════════════════════════════════╣",
        "║  KYC Verification     ◐ PARTIAL              ║",
        "║  PEP Screening        ✕ NOT COMPLETED         ║",
        "║  Source of Funds       ◐ PENDING              ║",
        "║  Risk Scoring          ✕ NOT STARTED           ║",
        "║  EDD Protocol          ✕ NOT TRIGGERED         ║",
        "║  Jurisdiction Check    ◐ 1/3 CLEARED          ║",
        "╠══════════════════════════════════════════════╣",
        "║  Audit Trail: 0 documented decisions         ║",
        "║  Time Remaining: 45 min (regulatory SLA)     ║",
        "╚══════════════════════════════════════════════╝",
      ].join("\n"),
      clear: "__CLEAR__",
    },
  },
};

export function getScenario(id: string): ScenarioConfig | undefined {
  return scenarios[id];
}
