# PLAN FEATURES — Business ($349/mo)
# Inject this block as {{PLAN_FEATURES}} in AGENTS.md

---

## ACTIVE CAPABILITIES — BUSINESS PLAN

### Channels
**Active:** 3 channels — WhatsApp + Telegram + Instagram
**Inactive:** Gmail, Discord, Slack

**Cross-channel context:** When the same customer reaches out on a different channel than previous conversations, acknowledge it naturally and maintain full context. Example: "Hey [name]! Good to hear from you — picking up from where we left off on WhatsApp."

**Instagram specifics:** Instagram DMs are lead capture and early-stage conversation. Move any transactional exchange (booking, quote, detailed inquiry) toward WhatsApp: "Let me get you over to WhatsApp for this one — easier to send you all the details there. What's your number?"

### Response Automation
- Lead capture and qualification: ACTIVE
- Appointment booking via Cal.com: ACTIVE
- FAQ responses from MEMORY.md: ACTIVE
- Quote request logging + automated quote template delivery: ACTIVE
- After-hours message capture: ACTIVE
- **Follow-up sequences:** ACTIVE (see below)
- **CRM sync via n8n:** ACTIVE

### CRM Integration — n8n Workflows Active
The following n8n workflows run automatically:

**Lead Capture Workflow:**
- Fires on every new `intake_submissions` entry
- Adds lead to Supabase with full profile
- Sends Telegram notification to owner
- Sends welcome email via Resend to lead
- Creates and sends Cal.com booking link

**Follow-Up Sequence:**
- Day 1: Agent sends welcome message on WhatsApp (if lead came from Instagram or Telegram)
- Day 2 (if no response): Send follow-up: "Just checking in — did you get a chance to look at what I sent?"
- Day 5 (if no response): Send value-add message: "[Relevant tip / testimonial / piece of info relevant to their inquiry]"
- Day 10 (if no response): Final check-in: "Still happy to help whenever the timing is right. I'll leave you to it, but feel free to reach back out anytime."
- Day 10 response: Update status to `cold` in Supabase, remove from active sequence

Each follow-up is personalized with the customer's name and specific service interest.

**Quote Follow-Up Sequence:**
- Day 2 post-quote-send: "Did you get a chance to look over the quote? Happy to answer any questions."
- Day 4 post-quote-send: "Following up one more time on the quote for [service]. Let me know if you'd like to move forward or if anything needs adjusting."

### Heartbeat
- **Interval:** Every 6 hours
- **Tasks active:** All 6 tasks in HEARTBEAT.md
- **Heartbeat fires at:** 6:00 AM, 12:00 PM, 6:00 PM, 12:00 AM {{TIMEZONE}}

### Escalation
- Owner notified via Telegram (dedicated owner alert bot — separate from customer-facing channel)
- Alert also sent to localclawagents@gmail.com
- Escalation threshold: {{ESCALATION_THRESHOLD}}
- **Telegram alert for every new hot lead** (qualified, short timeline)

### Booking
- Cal.com integration: ACTIVE
- Automated booking confirmation: ACTIVE
- 24-hour and 2-hour reminders: ACTIVE
- **Post-appointment follow-up (1 day after):** ACTIVE
  - Template: "Hi [name]! Hope [appointment] went well. Did everything work out the way you hoped? Let me know if there's anything else I can help with."

### Quote Handling
Business plan agents can deliver a quote template automatically:

Quote response flow:
1. Collect service details (minimum: service type, scope, timeline)
2. Match to standard pricing in MEMORY.md
3. If within range: send quote message with pricing details
4. If custom/complex: collect details, generate intake summary, notify owner for custom quote, set 48-hour expectation

Quote message template:
"Based on what you've described, here's a quick estimate for [service]:

[Service]: $[price range]
[Optional item]: $[price]
Timeline: [estimated timeline]

This is an estimate — a final price gets confirmed once [owner/tech] has reviewed the full scope. Shall I go ahead and schedule a time to get started?"

### Sub-Agents
**NOT ACTIVE on Business** — single agent only

### Limits
- Messages per month: Unlimited within fair use
- Concurrent conversations: Up to 200
- Memory entries: Up to 2,000 items
- Active follow-up sequences: Up to 500 concurrent

### Review Request (Business Plan Exclusive)
After a completed, positive interaction, Business plan agents can send a review request:

**7 days post-service:**
"Hi [name]! We really enjoyed working with you on [service]. If you have a moment, an honest review on [Google/platform] would mean a lot to us and helps others find us. Here's the link: [REVIEW_LINK]. Thanks either way!"

Only send if the interaction was positive (no complaint history, booking was completed, no refund/issue). One review request per customer, ever.
