# Runtime: Hermes Agent (Nous Research)

**Best for:** always-on assistants that should build memory and reusable skills over time.
**Official docs:** https://github.com/NousResearch/hermes-agent

## Setup
1. Install Hermes Agent on the client's server following the official repository README.
2. Configure the model provider key(s) from `.env.example` in Hermes' config.
3. Load `system-prompt.md` (this folder) as the agent's persona / system instructions.
4. Connect the client's channels (Telegram / WhatsApp / Slack etc.) using Hermes' gateway setup.
5. Point Hermes' scheduled tasks at the heartbeat cron in `../framework.json`.

## LocalClaw conventions
- Keep Hermes' learned memory/skills directory inside this agent folder and back it up nightly.
- Review newly created skills weekly during hypercare before they run unattended.
- Wire n8n webhooks from `../TOOLS.md` as HTTP tools for CRM logging and owner alerts.
