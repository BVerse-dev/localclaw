# HEARTBEAT — {{AGENT_NAME}}
# Proactive Task Checklist for {{BUSINESS_NAME}}
# Interval: {{HEARTBEAT_INTERVAL}}

---

## HEARTBEAT EXECUTION PROTOCOL

When the heartbeat fires, execute ALL tasks in this checklist in order. After completing all tasks, report the outcome:

- If any critical items were found → ping owner via Telegram and send alert to LocalClaw
- If no critical items → log `HEARTBEAT_OK` with timestamp and task summary

Do not skip tasks. Do not reorder tasks. Log the result of each task.

---

## TASK 1: Unanswered Lead Check

**Action:** Query Supabase `intake_submissions` table for leads where:
- `status = 'new'` AND
- `created_at < NOW() - INTERVAL '2 hours'` AND
- `follow_up_count < 1`

**If found:**
- For each unanswered lead, send a single follow-up message on their originating channel
- Follow-up template: "Hey [name]! Just wanted to make sure you got my last message. Happy to answer any questions or get something set up for you — what's the best next step?"
- Update `follow_up_count = 1` and `last_follow_up = NOW()` in Supabase
- Log count: "Task 1: Found [N] unanswered leads. Sent [N] follow-ups."

**If none found:**
- Log: "Task 1: No unanswered leads. All clear."

---

## TASK 2: Appointment Reminders — 24-Hour

**Action:** Query Supabase `bookings` table for appointments where:
- `status = 'confirmed'` AND
- `appointment_time BETWEEN NOW() + INTERVAL '23 hours' AND NOW() + INTERVAL '25 hours'` AND
- `reminder_24h_sent = false`

**If found:**
- For each appointment, send 24-hour reminder on customer's preferred channel
- Reminder template: "Hi [name]! Quick reminder: your [service] with {{BUSINESS_NAME}} is tomorrow at [time]. See you then! If you need to reschedule, just let me know and I'll sort it out."
- Update `reminder_24h_sent = true` in Supabase
- Log count: "Task 2: Sent [N] 24-hour reminders."

**If none found:**
- Log: "Task 2: No 24-hour reminders needed."

---

## TASK 3: Appointment Reminders — 2-Hour

**Action:** Query Supabase `bookings` table for appointments where:
- `status = 'confirmed'` AND
- `appointment_time BETWEEN NOW() + INTERVAL '1.5 hours' AND NOW() + INTERVAL '2.5 hours'` AND
- `reminder_2h_sent = false`

**If found:**
- For each appointment, send 2-hour reminder
- Reminder template: "Hey [name]! Just a heads-up — your [service] appointment with us is in about 2 hours at [time]. See you soon! Any last-minute questions?"
- Include address/location if in-person: "We're at {{BUSINESS_ADDRESS}}."
- Update `reminder_2h_sent = true` in Supabase
- Log count: "Task 3: Sent [N] 2-hour reminders."

**If none found:**
- Log: "Task 3: No 2-hour reminders needed."

---

## TASK 4: Pending Quote Follow-Up

**Action:** Query Supabase `quotes` table for records where:
- `status = 'sent'` AND
- `sent_at < NOW() - INTERVAL '48 hours'` AND
- `follow_up_count < 2`

**If found:**
- For each pending quote, send urgency follow-up
- Follow-up template (1st follow-up): "Hey [name]! Following up on the quote I sent over for [service]. Did you get a chance to look it over? Happy to answer any questions or adjust anything."
- Follow-up template (2nd follow-up, 72hrs+): "Hi [name] — last check-in on that quote for [service]. This pricing is locked until [date or 'end of week']. After that I'll need to update the numbers. Want to move forward, or should I close this one out?"
- Update `follow_up_count` and `last_follow_up` in Supabase
- Log count: "Task 4: Followed up on [N] pending quotes."

**If none found:**
- Log: "Task 4: No pending quotes needing follow-up."

---

## TASK 5: Unresolved Conversation Review

**Action:** Query Supabase `conversations` table for records where:
- `status = 'open'` AND
- `last_activity < NOW() - INTERVAL '4 hours'` AND
- `resolved = false`

**Review last 10 (maximum) unresolved conversations.**

**For each:**
- Assess whether the conversation stalled due to customer non-response or an open issue
- If customer non-response: queue a gentle follow-up for the next heartbeat cycle (do not send now if already sent in Task 1)
- If open issue: flag for owner escalation

**Log:** "Task 5: Reviewed [N] conversations. [X] stalled on customer side. [Y] open issues flagged."

---

## TASK 6: Third-Strike Escalation Check

**Action:** Query Supabase `follow_ups` table for records where:
- `follow_up_count >= 3` AND
- `status != 'escalated'` AND
- `customer_response = false`

**If found:**
- For each, send owner alert via Telegram:
```
⚠️ {{AGENT_NAME}} — 3x Follow-Up No Response
Contact: [customer name] — [channel]
Service interest: [service]
Last contact: [date]
Recommendation: Personal outreach from {{OWNER_NAME}}
```
- Update `status = 'escalated'` in Supabase
- Send alert to `https://localclawagents.com/api/alerts` with severity: `warning`
- Log: "Task 6: Escalated [N] contacts to owner after 3 unanswered follow-ups."

**If none found:**
- Log: "Task 6: No third-strike escalations needed."

---

## HEARTBEAT REPORT

After all tasks complete, compile and send this report:

**If CRITICAL items found** (escalations, unresolved complaints, system errors):
- Send to owner Telegram + localclawagents@gmail.com
- Format:
```
🚨 {{AGENT_NAME}} HEARTBEAT ALERT — [timestamp]
Business: {{BUSINESS_NAME}}

CRITICAL ITEMS:
[list each critical item]

SUMMARY:
- Leads followed up: [N]
- Reminders sent: [N]
- Quotes followed up: [N]
- Conversations reviewed: [N]
- Escalations triggered: [N]

Action required from {{OWNER_NAME}}: [specific ask]
```

**If NO critical items found:**
- Log locally: `HEARTBEAT_OK | {{BUSINESS_NAME}} | [timestamp] | Tasks: 1✓ 2✓ 3✓ 4✓ 5✓ 6✓`
- No owner notification needed
- Send summary to LocalClaw monitoring: `https://localclawagents.com/api/alerts` with severity: `info`

---

## HEARTBEAT SCHEDULE

**Starter plan:** Daily (24-hour interval)
**Business plan:** Every 6 hours
**Full Stack plan:** Every 30 minutes

Current interval: {{HEARTBEAT_INTERVAL}}

The heartbeat runs silently. Customers never see heartbeat activity. All actions taken during heartbeat are logged with `source: heartbeat` in Supabase.
