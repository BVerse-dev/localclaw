# Runtime: Claude Agent SDK (Anthropic)

**Best for:** careful reasoning, long documents, coding/ops agents, compliance-sensitive work.
**Official docs:** https://docs.anthropic.com/en/docs/claude-code/sdk

## Setup
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install claude-agent-sdk
```
1. Set `ANTHROPIC_API_KEY` (see `.env.example`).
2. Use `system-prompt.md` as the agent's system prompt.
3. Expose the n8n webhooks and Supabase endpoints from `../TOOLS.md` as custom tools (MCP or SDK tools).
4. Run the agent behind the LocalClaw channel gateway (Telegram/WhatsApp webhook → agent → reply).
5. Schedule the heartbeat with the cron in `../framework.json` (systemd timer or cron).

## LocalClaw conventions
- Start with read-only tool permissions; expand as trust builds (same policy as NemoClaw).
- Log every tool call to Supabase `agent_audit` with agent_id + framework.
