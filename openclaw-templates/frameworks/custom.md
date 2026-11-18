# Runtime: Custom build

**Best for:** bespoke agents wired directly into a client's internal systems.

## Setup
1. Scope the build on the kickoff call; record the chosen stack in `../framework.json` (`runtime_notes`).
2. Load `system-prompt.md` as the agent's instructions — it contains the full persona and rulebook.
3. Implement the tools listed in `../TOOLS.md` (n8n webhooks, Supabase, Cal.com, alerts).
4. Implement guardrails equivalent to the NemoClaw rules in AGENTS.md before go-live.
5. Schedule the heartbeat with the cron in `../framework.json`.
