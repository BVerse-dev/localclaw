# LocalClaw — OpenClaw Multi-Tenant Agent Deployment System

**Version:** 1.0 | **Platform:** Hostinger VPS + OpenClaw | **Automation:** n8n
**Support:** localclawagents@gmail.com | **Website:** https://localclawagents.com | **Book a call:** https://cal.com/bverse/15min

---

## System Overview

This repository contains the complete template system for deploying AI business agents for LocalClaw clients. Each client gets a fully configured OpenClaw agent that handles customer communication across one or more channels, qualifies leads, books appointments, and proactively follows up — all tailored to their specific business type and plan tier.

The system has four layers:

1. **Template Layer** — This directory. Business-type and plan-specific templates that get merged into a client-specific agent configuration.
2. **Agent Layer** — Per-client files in `~/.openclaw/agents/<client-slug>/`. Seven files define the agent's soul, identity, behavior, owner context, tools, memory, and heartbeat schedule.
3. **Automation Layer** — n8n workflows that handle lead CRM logging, owner notifications, follow-up sequences, and booking creation.
4. **Infrastructure Layer** — OpenClaw running on Hostinger VPS, connected to WhatsApp Business API, Telegram, and other channels.

---

## Architecture Diagram

```
Customer Message (WhatsApp / Telegram / Instagram / Gmail)
          |
          v
    OpenClaw Agent
    (reads 7 config files)
          |
    +-----+------+
    |             |
Respond to    Trigger n8n
 customer     webhook
                  |
         +--------+--------+
         |        |        |
    Supabase   Telegram   Cal.com
    (CRM log)  (owner     (booking
               alert)      link)
```

---

## Directory Structure

```
openclaw-templates/
├── README.md                        ← This file
├── onboard.sh                       ← Client onboarding script
├── openclaw-client.json             ← OpenClaw config template
├── ONBOARDING-CHECKLIST.md          ← Step-by-step client setup checklist
│
├── base/                            ← Universal agent file templates
│   ├── SOUL.md                      ← Core personality and communication rules
│   ├── IDENTITY.md                  ← Agent name, role, business identity
│   ├── AGENTS.md                    ← Behavioral rulebook and routing logic
│   ├── USER.md                      ← Business owner profile
│   ├── TOOLS.md                     ← API endpoints and environment config
│   ├── MEMORY.md                    ← Pre-seeded knowledge base
│   └── HEARTBEAT.md                 ← Proactive task checklist
│
├── businesses/                      ← Industry-specific context overrides
│   ├── restaurant.md
│   ├── real-estate.md
│   ├── law-firm.md
│   ├── home-services.md
│   ├── medical.md
│   ├── retail.md
│   └── general.md
│
├── plans/                           ← Plan-tier capability definitions
│   ├── starter.md                   ← $149/mo
│   ├── business.md                  ← $349/mo
│   └── fullstack.md                 ← $699/mo
│
└── n8n/                             ← Ready-to-import n8n workflow JSONs
    ├── lead-capture-workflow.json
    └── follow-up-sequence.json
```

Each deployed client lives at:
```
~/.openclaw/agents/<client-slug>/
├── SOUL.md
├── IDENTITY.md
├── AGENTS.md
├── USER.md
├── TOOLS.md
├── MEMORY.md
├── HEARTBEAT.md
└── openclaw.json
```

---

## How to Deploy a New Client

### Step 1 — Collect Information

Before running the script, have the following ready from the client's intake form:

- Business name
- Business type (restaurant, real-estate, law-firm, home-services, medical, retail, general)
- Plan (starter, business, fullstack)
- Owner's name
- Owner's mobile number (will be primary channel number)
- City and state
- Timezone

### Step 2 — Run onboard.sh

```bash
./onboard.sh \
  --name "Mario's Pizzeria" \
  --type restaurant \
  --plan business \
  --phone "+13055551234" \
  --owner "Mario Rossi" \
  --city "Miami" \
  --state "FL" \
  --timezone "America/New_York" \
  --email "mario@mariospizzeria.com"
```

The script will:
- Create `~/.openclaw/agents/marios-pizzeria/` with all 7 agent files
- Fill in all `{{PLACEHOLDER}}` values it knows at this stage
- Inject the restaurant industry context into SOUL.md
- Inject the Business plan features into AGENTS.md
- Generate unique n8n webhook IDs for this client
- Register the agent with OpenClaw CLI (if installed)
- Configure the heartbeat schedule
- Output a summary with remaining steps

### Step 3 — Complete Manual Placeholders

After the script runs, open these files and fill in the remaining placeholders:

**USER.md** — Add:
- Business address
- Business website
- Business hours (day-by-day)
- Service area
- What the owner cares most about (from intake call)
- Staff contacts
- Onboarding notes

**MEMORY.md** — Add:
- Services list with descriptions and prices
- Pricing range and payment methods
- FAQ answers (5 FAQs specific to this business)
- Differentiators / competitive advantages
- Lead qualifier question #5 (business-specific)
- Social proof examples (3 customer wins/testimonials)

**TOOLS.md** — Add after channel setup:
- WhatsApp Phone Number ID and Access Token
- Telegram Bot Token
- Instagram Account ID and Token (Business plan+)
- Supabase URL and keys
- Cal.com API key and event type ID
- Business-specific tool endpoints (if applicable)

### Step 4 — Set Environment Variables

```bash
openclaw env set --agent marios-pizzeria \
  WHATSAPP_TOKEN="your_token_here" \
  WHATSAPP_PHONE_ID="your_phone_id" \
  TELEGRAM_BOT_TOKEN="your_bot_token" \
  OWNER_TELEGRAM_CHAT_ID="123456789" \
  LOCALCLAW_API_KEY="your_localclaw_key" \
  N8N_WEBHOOK_TOKEN="your_n8n_token" \
  CAL_API_KEY="your_cal_key" \
  SUPABASE_URL="https://your-project.supabase.co" \
  SUPABASE_ANON_KEY="your_anon_key"
```

### Step 5 — Import n8n Workflows

1. Open n8n at `http://localhost:5678`
2. Go to Workflows → Import
3. Import `n8n/lead-capture-workflow.json`
4. Import `n8n/follow-up-sequence.json`
5. In each workflow, update the webhook IDs to match the IDs generated by onboard.sh (found in the ONBOARDING-SUMMARY.txt inside the agent's directory)
6. Add credentials: Supabase, Telegram bot, Resend SMTP, Cal.com API, WhatsApp API, LocalClaw API
7. Activate both workflows

### Step 6 — Start the Agent

```bash
openclaw agents start marios-pizzeria
```

Verify it's running:
```bash
openclaw agents status marios-pizzeria
```

### Step 7 — Test

Send test messages on each active channel. See ONBOARDING-CHECKLIST.md for the full testing protocol.

---

## Plan Tiers — Capability Mapping

| Feature | Starter ($149) | Business ($349) | Full Stack ($699) |
|---|---|---|---|
| Channels | 1 (WhatsApp OR Telegram) | 3 (WhatsApp + Telegram + Instagram) | All 6 channels |
| Lead capture | Yes | Yes | Yes |
| Appointment booking | Yes | Yes | Yes |
| FAQ responses | Yes | Yes | Yes |
| Heartbeat interval | 24 hours | 6 hours | 30 minutes |
| CRM sync via n8n | Log only | Full sync + pipeline | Full sync + pipeline |
| Follow-up sequences | No (owner manual) | Yes (auto 10-day) | Yes (extended 14-day) |
| Quote handling | Log + notify | Auto quote template | Auto + payment link |
| Sub-agents (Researcher, Scheduler, Closer) | No | No | Yes |
| NemoClaw security layer | No | No | Yes |
| Custom persona | No | No | Yes |
| Post-service NPS | No | No | Yes |
| Review request automation | No | Yes (7-day) | Yes (triggered by NPS) |
| Re-engagement sequence | No | No | Yes (90-day win-back) |
| Monthly performance report | No | No | Yes |
| LocalClaw support SLA | Standard | Standard | Priority + monthly call |

---

## How to Toggle Agents On/Off

### Disable an agent (immediately stops responding)
```bash
./onboard.sh --off --name "Business Name"
```
Or via OpenClaw CLI:
```bash
openclaw agents disable marios-pizzeria
```

### Re-enable a disabled agent
```bash
./onboard.sh --on --name "Business Name"
```
Or via OpenClaw CLI:
```bash
openclaw agents enable marios-pizzeria
```

### Check all agent statuses
```bash
./onboard.sh --list
```

### Check a specific agent's status
```bash
./onboard.sh --status --name "Business Name"
```

### Temporary pause (heartbeat only — agent still responds to messages)
```bash
openclaw heartbeat pause marios-pizzeria
openclaw heartbeat resume marios-pizzeria
```

---

## Troubleshooting Checklist

### Agent not responding to messages

1. `openclaw agents status <slug>` — is it running?
2. `openclaw logs <slug> --tail 50` — any error output?
3. Check channel connection: Is the WhatsApp/Telegram webhook registered?
4. Check `WHATSAPP_TOKEN` / `TELEGRAM_BOT_TOKEN` are set and valid
5. Verify the webhook URL is publicly accessible (n8n receives OpenClaw events)
6. Check that the channel is marked `enabled: true` in `openclaw.json`

### n8n workflows not firing

1. Open n8n UI at `http://localhost:5678` — are the workflows Active?
2. Check webhook IDs in the n8n workflow match the IDs in the agent's `openclaw.json`
3. Check `N8N_WEBHOOK_TOKEN` env var matches what n8n expects
4. Look at n8n execution log for the workflow — any errors?
5. Test the webhook manually: `curl -X POST http://localhost:5678/webhook/<id> -H "Content-Type: application/json" -d '{"test": true}'`

### Heartbeat not firing

1. `openclaw heartbeat status <slug>` — is it scheduled?
2. Check the cron expression in `openclaw.json`: `"cron_expression": "..."` matches expected schedule
3. `openclaw logs <slug> --filter heartbeat` — check for heartbeat execution logs
4. Verify the heartbeat n8n webhook ID is correct

### Supabase not receiving data

1. Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly
2. Verify the tables exist: `intake_submissions`, `bookings`, `conversations`, `quotes`, `contacts`, `follow_ups`
3. Check Supabase RLS (Row Level Security) policies — the anon key must have INSERT permission on `intake_submissions`
4. Test directly: `curl -X POST "$SUPABASE_URL/rest/v1/intake_submissions" -H "apikey: $SUPABASE_ANON_KEY" -H "Content-Type: application/json" -d '{"test": true}'`

### Agent giving wrong pricing or committing to things it shouldn't

1. Check MEMORY.md — is the pricing range defined correctly?
2. Check `price_guard` settings in `openclaw.json` — are `PRICE_MIN` and `PRICE_MAX` set?
3. Check `NEMOCLAW_ENABLED` — if on Full Stack, NemoClaw should be catching this
4. Review the SOUL.md non-negotiable rules — they should prevent unauthorized price commitments
5. If issue persists: add the specific problematic phrase to the MEMORY.md "Internal Notes" section with explicit instruction

### Owner not receiving alert notifications

1. Check `OWNER_TELEGRAM_CHAT_ID` is set correctly (it's a numeric ID, not a username)
2. To find chat ID: send a message to your Telegram bot, then check `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Verify `TELEGRAM_BOT_TOKEN` is valid
4. Check that the bot has permission to message the owner (owner must have started a conversation with the bot)
5. Test manually: `curl https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<CHAT_ID>&text=test`

### Agent speaking in wrong language

1. Check SOUL.md language detection section — it should auto-detect
2. If a specific non-English language is default, update the "Default language" line in SOUL.md
3. Verify the OpenClaw model supports the target language (all Claude models support major world languages)

---

## Variable Reference Table

All `{{PLACEHOLDER}}` values used across templates:

| Placeholder | Description | Set by |
|---|---|---|
| `{{AGENT_NAME}}` | Full display name of the agent | onboard.sh (auto-generated) |
| `{{AGENT_SLUG}}` | URL-safe lowercase identifier (e.g., "marios-pizzeria") | onboard.sh |
| `{{AGENT_EMOJI}}` | Emoji representing the agent | onboard.sh (default: 🦞) |
| `{{CREATURE_CONCEPT}}` | Short brand concept line | onboard.sh |
| `{{BUSINESS_NAME}}` | Full business name | onboard.sh `--name` |
| `{{BUSINESS_TYPE}}` | Business type key | onboard.sh `--type` |
| `{{BUSINESS_ADDRESS}}` | Street address | USER.md (manual) |
| `{{BUSINESS_PHONE}}` | Public-facing phone number | onboard.sh `--phone` |
| `{{BUSINESS_EMAIL}}` | Public-facing email address | onboard.sh `--email` |
| `{{BUSINESS_WEBSITE}}` | Business website URL | USER.md (manual) |
| `{{OWNER_NAME}}` | Business owner's full name | onboard.sh `--owner` |
| `{{OWNER_PERSONAL_PHONE}}` | Owner's personal phone (never shared) | USER.md (manual) |
| `{{OWNER_BUSINESS_PHONE}}` | Owner's business phone | onboard.sh `--phone` |
| `{{OWNER_EMAIL}}` | Owner email for alerts | onboard.sh `--email` |
| `{{OWNER_TELEGRAM}}` | Owner's Telegram username | USER.md (post-setup) |
| `{{OWNER_TELEGRAM_CHAT_ID}}` | Numeric Telegram chat ID for alerts | ENV VAR + USER.md |
| `{{OWNER_PREFERRED_CONTACT}}` | Preferred escalation channel | USER.md (manual) |
| `{{OWNER_LANGUAGE}}` | Owner's preferred language | USER.md (manual) |
| `{{OWNER_PRIORITIES}}` | Owner's stated priorities from intake | USER.md (manual) |
| `{{OWNER_DEALBREAKERS}}` | What owner doesn't want agent doing | USER.md (manual) |
| `{{CITY}}` | City where business operates | onboard.sh `--city` |
| `{{STATE}}` | State abbreviation | onboard.sh `--state` |
| `{{ZIP}}` | ZIP code | USER.md (manual) |
| `{{TIMEZONE}}` | IANA timezone string | onboard.sh `--timezone` |
| `{{BUSINESS_HOURS}}` | Full hours string | USER.md (manual) |
| `{{HOURS_MON}}` through `{{HOURS_SUN}}` | Per-day hours | USER.md (manual) |
| `{{OPEN_TIME}}` | Next-morning open time (for after-hours) | USER.md (manual) |
| `{{HOLIDAY_POLICY}}` | Holiday closure policy | USER.md (manual) |
| `{{SERVICE_RADIUS}}` | Geographic service radius | USER.md (manual) |
| `{{SERVICE_AREA_EXTENDED}}` | Extended service area | USER.md (manual) |
| `{{OUT_OF_AREA_POLICY}}` | What to do for out-of-area requests | USER.md (manual) |
| `{{PLAN_NAME}}` | Plan display name with price | onboard.sh |
| `{{PLAN_FEATURES}}` | Full plan capabilities block | Injected from plans/ |
| `{{PLAN_FEATURES_LIST}}` | Short plan features list | onboard.sh |
| `{{BILLING_EMAIL}}` | Email for billing correspondence | onboard.sh `--email` |
| `{{RENEWAL_DATE}}` | Next billing renewal date | USER.md (manual) |
| `{{HEARTBEAT_INTERVAL}}` | Human-readable interval (24h, 6h, 30m) | onboard.sh (by plan) |
| `{{HEARTBEAT_CRON}}` | Cron expression for heartbeat schedule | onboard.sh (by plan) |
| `{{INDUSTRY_CONTEXT}}` | Business-type-specific context block | Injected from businesses/ |
| `{{SERVICES_LIST}}` | List of services with prices | MEMORY.md (manual) |
| `{{PRICE_RANGE}}` | Business price range string | MEMORY.md (manual) |
| `{{PRICE_MIN}}` | Minimum price for guard | openclaw.json (manual) |
| `{{PRICE_MAX}}` | Maximum authorized price | openclaw.json (manual) |
| `{{PAYMENT_METHODS}}` | Accepted payment types | MEMORY.md (manual) |
| `{{DEPOSIT_POLICY}}` | Deposit requirements | MEMORY.md (manual) |
| `{{CANCELLATION_POLICY}}` | Cancellation terms | MEMORY.md (manual) |
| `{{REFUND_POLICY}}` | Refund policy | MEMORY.md (manual) |
| `{{FAQ_1_QUESTION}}` through `{{FAQ_5_QUESTION}}` | FAQ question text | MEMORY.md (manual) |
| `{{FAQ_1_ANSWER}}` through `{{FAQ_5_ANSWER}}` | FAQ answer text | MEMORY.md (manual) |
| `{{DIFFERENTIATORS}}` | Competitive differentiators | MEMORY.md (manual) |
| `{{LEAD_QUALIFIER_5}}` | 5th business-specific qualifier question | MEMORY.md (manual) |
| `{{QUALIFIED_TIMELINE}}` | What counts as a qualified timeline | MEMORY.md (manual) |
| `{{PEAK_INQUIRY_HOURS}}` | Peak inquiry time windows | MEMORY.md (manual) |
| `{{POPULAR_BOOKING_SLOTS}}` | Most popular booking times | MEMORY.md (manual) |
| `{{PREFERRED_SLOTS}}` | Slots to encourage (off-peak) | MEMORY.md (manual) |
| `{{APPOINTMENT_BUFFER}}` | Buffer time between appointments | MEMORY.md (manual) |
| `{{MAX_DAILY_BOOKINGS}}` | Maximum bookings per day | MEMORY.md (manual) |
| `{{BUSY_SEASON}}` | Peak business season | MEMORY.md (manual) |
| `{{SLOW_SEASON}}` | Slow business season | MEMORY.md (manual) |
| `{{CURRENT_PROMOTION}}` | Active promotion details | MEMORY.md (manual) |
| `{{PROMOTION_EXPIRY}}` | When promotion expires | MEMORY.md (manual) |
| `{{SOCIAL_PROOF_1}}` through `{{SOCIAL_PROOF_3}}` | Customer win testimonials | MEMORY.md (manual) |
| `{{INTERNAL_NOTES}}` | Internal-only context | MEMORY.md (manual) |
| `{{ESCALATION_THRESHOLD}}` | Dollar amount that triggers escalation | onboard.sh (default $1,000) |
| `{{ESCALATION_HOURS}}` | Hours owner is available for escalation | USER.md (manual) |
| `{{ESCALATION_CHANNEL}}` | Channel for owner escalation alerts | onboard.sh |
| `{{RESPONSE_TIME}}` | Expected response time for escalations | onboard.sh (default 2hrs) |
| `{{N8N_LEAD_WEBHOOK}}` | n8n lead capture webhook ID | onboard.sh (auto-generated) |
| `{{N8N_BOOKING_WEBHOOK}}` | n8n booking webhook ID | onboard.sh (auto-generated) |
| `{{N8N_QUOTE_WEBHOOK}}` | n8n quote webhook ID | onboard.sh (auto-generated) |
| `{{N8N_COMPLAINT_WEBHOOK}}` | n8n complaint webhook ID | onboard.sh (auto-generated) |
| `{{N8N_AFTERHOURS_WEBHOOK}}` | n8n after-hours webhook ID | onboard.sh (auto-generated) |
| `{{N8N_HEARTBEAT_WEBHOOK}}` | n8n heartbeat webhook ID | onboard.sh (auto-generated) |
| `{{N8N_FOLLOWUP_WEBHOOK}}` | n8n follow-up webhook ID | onboard.sh (auto-generated) |
| `{{N8N_CRM_WEBHOOK}}` | n8n CRM sync webhook ID | onboard.sh (auto-generated) |
| `{{N8N_WORKFLOW_ID}}` | Primary workflow ID (alias for lead) | onboard.sh |
| `{{N8N_STRIPE_WEBHOOK}}` | n8n Stripe webhook ID | openclaw.json (manual) |
| `{{CAL_API_KEY}}` | Cal.com API key | ENV VAR |
| `{{CAL_USERNAME}}` | Cal.com username | onboard.sh (default: bverse) |
| `{{CAL_EVENT_TYPE}}` | Cal.com event type slug | onboard.sh (default: 15min) |
| `{{CAL_EVENT_TYPE_ID}}` | Cal.com event type numeric ID | ENV VAR (manual) |
| `{{CAL_LINK}}` | Full Cal.com booking URL | onboard.sh |
| `{{SUPABASE_URL}}` | Supabase project URL | ENV VAR |
| `{{SUPABASE_ANON_KEY}}` | Supabase anonymous key | ENV VAR |
| `{{SUPABASE_SERVICE_KEY}}` | Supabase service role key | ENV VAR |
| `{{WHATSAPP_BUSINESS_NUMBER}}` | WhatsApp business phone number | TOOLS.md (post-setup) |
| `{{WHATSAPP_ACCOUNT_ID}}` | WhatsApp Business Account ID | TOOLS.md (post-setup) |
| `{{WHATSAPP_PHONE_ID}}` | WhatsApp Phone Number ID | ENV VAR + TOOLS.md |
| `{{WHATSAPP_TOKEN}}` | WhatsApp access token | ENV VAR |
| `{{WHATSAPP_VERIFY_TOKEN}}` | WhatsApp webhook verify token | ENV VAR |
| `{{WHATSAPP_ENABLED}}` | Channel enabled flag (true/false) | onboard.sh (by plan) |
| `{{TELEGRAM_BOT_USERNAME}}` | Telegram bot @username | TOOLS.md (post-setup) |
| `{{TELEGRAM_BOT_TOKEN}}` | Telegram bot token | ENV VAR |
| `{{TELEGRAM_ENABLED}}` | Channel enabled flag (true/false) | onboard.sh (by plan) |
| `{{INSTAGRAM_ACCOUNT_ID}}` | Instagram business account ID | TOOLS.md (post-setup) |
| `{{INSTAGRAM_TOKEN}}` | Instagram access token | ENV VAR |
| `{{INSTAGRAM_ENABLED}}` | Channel enabled flag (true/false) | onboard.sh (by plan) |
| `{{GMAIL_ADDRESS}}` | Gmail address for the agent | TOOLS.md (manual) |
| `{{GMAIL_ENABLED}}` | Channel enabled flag (true/false) | onboard.sh (by plan) |
| `{{GMAIL_BCC_ADDRESS}}` | BCC address for Gmail archiving | TOOLS.md (manual) |
| `{{DISCORD_GUILD_ID}}` | Discord server ID | TOOLS.md (manual) |
| `{{DISCORD_ALERT_CHANNEL}}` | Discord alert channel ID | TOOLS.md (manual) |
| `{{DISCORD_ENABLED}}` | Channel enabled flag (true/false) | onboard.sh (by plan) |
| `{{SLACK_ALERT_CHANNEL}}` | Slack alert channel name | TOOLS.md (manual) |
| `{{SLACK_WEBHOOK_URL}}` | Slack incoming webhook URL | ENV VAR |
| `{{SLACK_ENABLED}}` | Channel enabled flag (true/false) | onboard.sh (by plan) |
| `{{STRIPE_PUBLISHABLE_KEY}}` | Stripe publishable key | ENV VAR |
| `{{STRIPE_PAYMENT_LINK}}` | Stripe payment link ID | TOOLS.md (manual) |
| `{{LOCALCLAW_API_KEY}}` | LocalClaw alert API key | ENV VAR |
| `{{BUSINESS_TOOLS}}` | Business-specific API endpoints | TOOLS.md (manual) |
| `{{NEMOCLAW_ENABLED}}` | NemoClaw security layer flag | onboard.sh (by plan) |
| `{{NEMOCLAW_MODE}}` | NemoClaw action mode (flag/hold/block) | openclaw.json (default: flag) |
| `{{CUSTOM_PERSONA_BRIEF}}` | Custom persona description (Full Stack) | onboard.sh / manual |
| `{{STARTER_CHANNEL}}` | Active channel for Starter plan | onboard.sh |
| `{{PRIMARY_CHANNEL}}` | Primary channel for agent routing | onboard.sh |
| `{{RESEARCHER_ENABLED}}` | Researcher sub-agent flag | onboard.sh (by plan) |
| `{{SCHEDULER_ENABLED}}` | Scheduler sub-agent flag | onboard.sh (by plan) |
| `{{CLOSER_ENABLED}}` | Closer sub-agent flag | onboard.sh (by plan) |
| `{{TEST_PHONE_NUMBER}}` | Phone number for sandbox testing | openclaw.json (manual) |
| `{{CLIENT_PHONE}}` | Client's primary phone (channel whitelist) | onboard.sh `--phone` |
| `{{STAFF_1_NAME}}` through `{{STAFF_2_NAME}}` | Staff member names | USER.md (manual) |
| `{{STAFF_1_ROLE}}` through `{{STAFF_2_ROLE}}` | Staff member roles | USER.md (manual) |
| `{{STAFF_1_CONTACT}}` through `{{STAFF_2_CONTACT}}` | Staff contact info | USER.md (manual) |
| `{{EMERGENCY_CONTACT}}` | Emergency contact for critical issues | USER.md (manual) |
| `{{ONBOARDING_NOTES}}` | Notes from onboarding call | USER.md (manual) |
| `{{INTAKE_FORM_LINK}}` | Link to patient/client intake form | TOOLS.md (manual) |
| `{{REVIEW_LINK}}` | Google/Yelp review link | MEMORY.md (manual) |
| `{{CREATED_AT}}` | ISO timestamp of agent creation | onboard.sh (auto) |

---

## Adding a New Business Type

1. Create `businesses/<new-type>.md` following the existing template structure
2. Add the new type to the `case` statement in `onboard.sh` (both the validation and the agent name generation)
3. The file should include: INDUSTRY CONTEXT block, TONE ADJUSTMENTS, COMMON SCENARIOS with response templates, INDUSTRY-SPECIFIC FAQ ANSWERS, and BOOKING FLOW SPECIFICS
4. Test with: `./onboard.sh --name "Test Business" --type <new-type> --plan starter --phone +1234567890 --owner "Test Owner"`

## Adding a New Plan Tier

1. Create `plans/<new-plan>.md`
2. Add the tier to the `case` statements in `onboard.sh` for heartbeat interval/cron and channel flags
3. Add the plan to the plan capabilities table in this README
4. Update the plan validation in `onboard.sh`
