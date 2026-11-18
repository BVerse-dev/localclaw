# Runtime: n8n AI Agent workflows

**Best for:** predictable, step-based processes with a few AI decisions — visible and editable by the client's team.
**Official docs:** https://docs.n8n.io

## Setup
```bash
docker volume create n8n_data
docker run -d --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
```
1. Import the LocalClaw workflows from `../../n8n/` (templates folder) and set the webhook IDs listed in `../ONBOARDING-SUMMARY.txt`.
2. Add an **AI Agent** node; paste `system-prompt.md` into its system message.
3. Add credentials for the model provider, Supabase, Cal.com and the client's channels.
4. Use a Schedule Trigger with the heartbeat cron from `../framework.json`.

## LocalClaw conventions
- Put n8n behind HTTPS + basic auth; never expose the editor publicly.
