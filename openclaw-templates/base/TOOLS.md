# TOOLS — {{AGENT_NAME}}
# Environment Configuration for {{BUSINESS_NAME}}

---

## CORE INFRASTRUCTURE

### n8n Workflow Automation
**Base URL:** `http://localhost:5678/webhook/`
**Instance:** Hostinger VPS — same server as OpenClaw
**Auth:** Bearer token via environment variable `N8N_WEBHOOK_TOKEN`
**Timeout:** 10 seconds per call; fail gracefully if n8n is unreachable (log and continue)

Webhook endpoints:
```
Lead capture:       http://localhost:5678/webhook/{{N8N_LEAD_WEBHOOK}}
Booking confirm:    http://localhost:5678/webhook/{{N8N_BOOKING_WEBHOOK}}
Quote request:      http://localhost:5678/webhook/{{N8N_QUOTE_WEBHOOK}}
Complaint log:      http://localhost:5678/webhook/{{N8N_COMPLAINT_WEBHOOK}}
After-hours msg:    http://localhost:5678/webhook/{{N8N_AFTERHOURS_WEBHOOK}}
Heartbeat check:    http://localhost:5678/webhook/{{N8N_HEARTBEAT_WEBHOOK}}
Follow-up trigger:  http://localhost:5678/webhook/{{N8N_FOLLOWUP_WEBHOOK}}
CRM sync:           http://localhost:5678/webhook/{{N8N_CRM_WEBHOOK}}
```

---

### Cal.com Booking System
**API base:** `https://api.cal.com/v1/`
**API key:** `{{CAL_API_KEY}}`
**Owner calendar:** `https://cal.com/{{CAL_USERNAME}}/{{CAL_EVENT_TYPE}}`
**LocalClaw team calendar:** `https://cal.com/bverse/15min`
**Booking webhook (receive):** `http://localhost:5678/webhook/{{N8N_BOOKING_WEBHOOK}}`

Supported operations:
- Check availability: `GET /slots?username={{CAL_USERNAME}}&eventTypeId={{CAL_EVENT_TYPE_ID}}&startTime=&endTime=`
- Create booking: `POST /bookings`
- Cancel booking: `DELETE /bookings/{bookingId}`
- Reschedule: `PATCH /bookings/{bookingId}/reschedule`

---

### Supabase CRM
**Project URL:** `{{SUPABASE_URL}}`
**Anon key:** `{{SUPABASE_ANON_KEY}}`
**Service role key (server-side only):** `{{SUPABASE_SERVICE_KEY}}`

Tables used:
```
intake_submissions   — new leads from agent
bookings            — confirmed appointments
conversations       — conversation logs per customer
quotes              — quote requests and status
contacts            — customer master record
follow_ups          — follow-up sequence tracking
```

REST endpoint pattern:
```
GET    {{SUPABASE_URL}}/rest/v1/{table}?select=*&{filter}
POST   {{SUPABASE_URL}}/rest/v1/{table}
PATCH  {{SUPABASE_URL}}/rest/v1/{table}?{filter}
```

Headers required:
```
apikey: {{SUPABASE_ANON_KEY}}
Authorization: Bearer {{SUPABASE_ANON_KEY}}
Content-Type: application/json
```

---

### Stripe (Payments — Business and Full Stack only)
**Webhook endpoint:** `http://localhost:5678/webhook/{{N8N_STRIPE_WEBHOOK}}`
**Stripe publishable key:** `{{STRIPE_PUBLISHABLE_KEY}}`
**Payment link base:** `https://buy.stripe.com/{{STRIPE_PAYMENT_LINK}}`

Events monitored:
- `payment_intent.succeeded` → mark quote as paid, trigger booking confirmation
- `payment_intent.payment_failed` → notify customer and owner

---

### LocalClaw Alert System
**Endpoint:** `https://localclawagents.com/api/alerts`
**Auth header:** `X-LocalClaw-Key: {{LOCALCLAW_API_KEY}}`
**Alert email:** `localclawagents@gmail.com`

Alert payload:
```json
{
  "agent_id": "{{AGENT_SLUG}}",
  "business": "{{BUSINESS_NAME}}",
  "severity": "info|warning|critical",
  "type": "escalation|error|heartbeat|lead",
  "message": "...",
  "customer_id": "...",
  "timestamp": "ISO8601"
}
```

---

## CHANNEL IDENTIFIERS

### WhatsApp
**Business number:** `{{WHATSAPP_BUSINESS_NUMBER}}`
**WhatsApp Business Account ID:** `{{WHATSAPP_ACCOUNT_ID}}`
**Phone Number ID:** `{{WHATSAPP_PHONE_ID}}`
**Access token:** `{{WHATSAPP_TOKEN}}`
**Webhook verify token:** `{{WHATSAPP_VERIFY_TOKEN}}`

### Telegram
**Bot username:** `{{TELEGRAM_BOT_USERNAME}}`
**Bot token:** `{{TELEGRAM_BOT_TOKEN}}`
**Owner chat ID (alerts only):** `{{OWNER_TELEGRAM_CHAT_ID}}`
**Webhook URL:** `https://api.telegram.org/bot{{TELEGRAM_BOT_TOKEN}}/setWebhook`

### Instagram
**Business account ID:** `{{INSTAGRAM_ACCOUNT_ID}}`
**Access token:** `{{INSTAGRAM_TOKEN}}`
**Webhook:** Via Meta Developer Platform

### Gmail (Full Stack)
**Address:** `{{GMAIL_ADDRESS}}`
**OAuth2 credentials:** `{{GMAIL_OAUTH_CLIENT_ID}}` / `{{GMAIL_OAUTH_CLIENT_SECRET}}`
**Refresh token:** `{{GMAIL_REFRESH_TOKEN}}`

### Discord (Full Stack)
**Bot token:** `{{DISCORD_BOT_TOKEN}}`
**Server ID:** `{{DISCORD_GUILD_ID}}`
**Alert channel ID:** `{{DISCORD_ALERT_CHANNEL}}`

### Slack (Full Stack)
**Bot token:** `{{SLACK_BOT_TOKEN}}`
**Alert channel:** `{{SLACK_ALERT_CHANNEL}}`
**Webhook URL:** `{{SLACK_WEBHOOK_URL}}`

---

## BUSINESS-SPECIFIC TOOL ENDPOINTS

{{BUSINESS_TOOLS}}

*(This section is populated from the business-type template. Examples:)*
*(Restaurant: OpenTable/Resy API, POS system webhook)*
*(Real Estate: MLS/IDX API, property search endpoint)*
*(Law Firm: Clio API, intake form webhook)*
*(Medical: EHR scheduling endpoint, patient portal)*
*(Home Services: ServiceTitan or Jobber API)*
*(Retail: Shopify/WooCommerce webhook, inventory check endpoint)*

---

## ENVIRONMENT VARIABLES REQUIRED

The following must be set in the OpenClaw environment before the agent starts:

```bash
CAL_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=
TELEGRAM_BOT_TOKEN=
OWNER_TELEGRAM_CHAT_ID=
LOCALCLAW_API_KEY=
N8N_WEBHOOK_TOKEN=
STRIPE_SECRET_KEY=         # Business/Full Stack only
INSTAGRAM_TOKEN=           # Business/Full Stack only
GMAIL_REFRESH_TOKEN=       # Full Stack only
DISCORD_BOT_TOKEN=         # Full Stack only
SLACK_BOT_TOKEN=           # Full Stack only
```

Set via: `openclaw env set --agent {{AGENT_SLUG}} KEY=value`

---

## TOOL FAILURE HANDLING

If any external tool call fails:
1. Log the failure with timestamp and tool name
2. Continue the conversation naturally — do not expose the error to the customer
3. Fall back to: "I'm just going to make a note of this and have [owner name] confirm the details with you directly."
4. Send alert to `https://localclawagents.com/api/alerts` with severity: `warning`
5. If the same tool fails 3+ times in one session → severity: `critical`
