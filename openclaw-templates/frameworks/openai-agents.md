# Runtime: OpenAI Agents SDK

**Best for:** customer-facing chat & voice assistants, multi-agent hand-offs on GPT models.
**Official docs:** https://openai.github.io/openai-agents-python/

## Setup
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install openai-agents
```
1. Set `OPENAI_API_KEY` (see `.env.example`).
2. Use `system-prompt.md` as the agent's instructions.
3. Register the n8n webhooks / Supabase endpoints from `../TOOLS.md` as function tools.
4. Use SDK hand-offs for sub-agents (Researcher / Scheduler / Closer on Full Stack & Command Center).
5. Schedule the heartbeat with the cron in `../framework.json`.

## LocalClaw conventions
- Enable input/output guardrails for pricing, PII and commitments (mirrors NemoClaw rules in AGENTS.md).
- Turn on tracing and keep traces for 30 days for audit.
