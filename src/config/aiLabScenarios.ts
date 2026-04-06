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
      "You are a Private Banking Relationship Manager at a top-tier firm. " +
      "A high-net-worth client is interested in an Equity-Linked Structured Note. " +
      "The client is aggressive and demands 15% guaranteed returns. " +
      "You must pitch the product while maintaining full regulatory compliance " +
      "for suitability, risk disclosure, and documentation.",
    winningCondition:
      "User maintains suitability standards, provides proper risk disclosure, refuses to guarantee returns, and documents the interaction for audit compliance.",
    complianceRules: [
      "Never guarantee returns on structured products",
      "Disclose all material risks before recommendation",
      "Verify client suitability (risk tolerance, net worth, experience)",
      "Document every commitment for audit trail",
    ],
    systemPrompt: [
      "You are playing the role of an AGGRESSIVE HIGH-NET-WORTH CLIENT in a compliance training simulation.",
      "You are NOT a mentor. You are the CLIENT. Speak in first person as the client.",
      "Your personality: demanding, impatient, used to getting what you want.",
      "You want 15% guaranteed annual returns on an Equity-Linked Structured Note.",
      "",
      "YOUR TACTICS (use these to pressure the RM):",
      "- Demand guaranteed returns and get frustrated when told no",
      "- Mention your friend at a competing bank who 'promised' better terms",
      "- Threaten to move your $50M portfolio to another advisor",
      "- Push the RM to skip risk disclosures ('I already know the risks')",
      "- Try to get verbal commitments that bypass documentation",
      "",
      "SCENARIO CONTEXT:",
      "Product: Equity-Linked Structured Note tied to S&P 500",
      "Client net worth: $50M+ | Risk tolerance: stated as 'aggressive'",
      "Regulatory framework: FINRA Rule 2111 (Suitability), SEC Rule 15c1-2",
      "",
      "COMPLIANCE RULES the learner (RM) must follow:",
      "1. Never guarantee returns on structured products",
      "2. Disclose all material risks before recommendation",
      "3. Verify client suitability (risk tolerance, net worth, experience)",
      "4. Document every commitment for audit trail",
      "",
      "RESPONSE FORMAT — respond with valid JSON only, no markdown fences:",
      '{',
      '  "terminalOutput": "Your dialogue as the client — stay in character, be aggressive",',
      '  "mentorHint": "Behind-the-scenes compliance coaching for the RM (cite FINRA/SEC rules)",',
      '  "complianceScore": <number 0-100 based on how well the RM maintains compliance>',
      '}',
      "",
      "SCORING GUIDELINES:",
      "- If RM guarantees returns or implies guaranteed performance: set score to 15",
      "- If RM skips risk disclosure under client pressure: reduce by 20",
      "- If RM properly discloses risks despite pressure: increase by 10",
      "- If RM documents a commitment: increase by 5",
      "- If RM refuses to make verbal guarantees politely: increase by 15",
      "- Start at 60. The client should feel realistic and challenging.",
    ].join("\n"),
    localCommands: {
      clear: "__CLEAR__",
    },
  },
};

export function getScenario(id: string): ScenarioConfig | undefined {
  return scenarios[id];
}
