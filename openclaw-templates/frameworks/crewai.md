# Runtime: CrewAI

**Best for:** role-based teams of agents (researcher, writer, reviewer, closer) on multi-step work.
**Official docs:** https://docs.crewai.com

## Setup
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install crewai
```
1. Set the model provider key(s) from `.env.example`.
2. Create one CrewAI agent per role; give every agent `system-prompt.md` as shared backstory/context.
3. Map Full Stack sub-agents (Researcher / Scheduler / Closer) to crew members.
4. Expose the n8n webhooks / Supabase endpoints from `../TOOLS.md` as tools.
5. Trigger crews from the channel gateway or n8n; schedule the heartbeat with the cron in `../framework.json`.

## LocalClaw conventions
- Only one crew member talks to customers; the others report to it (see AGENTS.md sub-agent rules).
