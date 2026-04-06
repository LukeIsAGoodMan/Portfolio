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
};

export function getScenario(id: string): ScenarioConfig | undefined {
  return scenarios[id];
}
