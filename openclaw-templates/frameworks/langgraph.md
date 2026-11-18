# Runtime: LangGraph

**Best for:** stateful, branching workflows that need durable checkpoints and human-in-the-loop approvals.
**Official docs:** https://langchain-ai.github.io/langgraph/

## Setup
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install langgraph
```
1. Set the model provider key(s) from `.env.example`.
2. Use `system-prompt.md` as the system message for the primary node.
3. Model escalation rules from AGENTS.md as interrupt / approval nodes.
4. Use a persistent checkpointer (Postgres/Supabase) so conversations survive restarts.
5. Schedule the heartbeat with the cron in `../framework.json`.
