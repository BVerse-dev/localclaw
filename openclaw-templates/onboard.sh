#!/usr/bin/env bash
# =============================================================================
# LocalClaw — OpenClaw Agent Onboarding Script
# Usage:
#   ./onboard.sh --name "Business Name" --type restaurant --plan starter \
#                --phone +1234567890 --owner "John Doe" [--channel whatsapp]
#   ./onboard.sh --off --name "Business Name"
#   ./onboard.sh --list
# =============================================================================

set -euo pipefail

# --- Configuration -----------------------------------------------------------
TEMPLATES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTS_BASE="${HOME}/.openclaw/agents"
LOCALCLAW_ALERT="https://localclawagents.com/api/alerts"
LOCALCLAW_EMAIL="localclawagents@gmail.com"
CAL_LINK="https://cal.com/bverse/15min"
WEBSITE="https://localclawagents.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# --- Helpers -----------------------------------------------------------------
info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }
header()  { echo -e "\n${BOLD}${BLUE}$*${NC}\n"; }
die()     { error "$*"; exit 1; }

# --- Slugify -----------------------------------------------------------------
slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | \
    sed 's/[^a-z0-9 -]//g' | \
    sed 's/ /-/g' | \
    sed 's/--*/-/g' | \
    sed 's/^-//;s/-$//'
}

# --- Usage -------------------------------------------------------------------
usage() {
  cat <<EOF

${BOLD}LocalClaw — OpenClaw Agent Onboarding${NC}

USAGE:
  ${BOLD}Onboard a new agent:${NC}
    ./onboard.sh --name "Business Name" --type TYPE --plan PLAN \\
                 --phone +1234567890 --owner "Owner Name" \\
                 [--channel whatsapp|telegram] [--city "City"] \\
                 [--email owner@email.com] [--timezone "America/New_York"]

  ${BOLD}Disable an agent:${NC}
    ./onboard.sh --off --name "Business Name"

  ${BOLD}Enable a disabled agent:${NC}
    ./onboard.sh --on --name "Business Name"

  ${BOLD}List all agents:${NC}
    ./onboard.sh --list

  ${BOLD}Show agent status:${NC}
    ./onboard.sh --status --name "Business Name"

REQUIRED ARGS:
  --name    "Business Name"         Business name (will be slugified for directory)
  --type    restaurant|real-estate|law-firm|home-services|medical|retail|general
  --plan    starter|business|fullstack
  --phone   +1234567890             Client's primary contact phone (WhatsApp or Telegram)
  --owner   "Owner Name"            Business owner's full name

OPTIONAL ARGS:
  --channel whatsapp|telegram       Primary channel for Starter plan (default: whatsapp)
  --city    "City Name"             City where the business operates (default: "Your City")
  --email   owner@example.com       Owner email for alerts (default: $LOCALCLAW_EMAIL)
  --timezone "America/New_York"     Business timezone (default: America/New_York)
  --state   "FL"                    State abbreviation (default: unknown)

BUSINESS TYPES:
  restaurant      Restaurants, cafes, food & beverage
  real-estate     Real estate agents, brokerages
  law-firm        Law firms, solo attorneys
  home-services   HVAC, plumbing, electrical, general home services
  medical         Medical, dental, chiropractic, mental health
  retail          Retail stores, e-commerce
  general         Any other service business

PLANS:
  starter     \$149/mo — 1 channel, lead capture, booking, FAQ, daily heartbeat
  business    \$349/mo — 3 channels, CRM sync, follow-ups, 6hr heartbeat
  fullstack   \$699/mo — all channels, sub-agents, NemoClaw, 30min heartbeat

EOF
}

# --- List agents -------------------------------------------------------------
list_agents() {
  header "LocalClaw — Active Agents"
  if [[ ! -d "$AGENTS_BASE" ]]; then
    info "No agents directory found at $AGENTS_BASE"
    return 0
  fi

  local count=0
  for dir in "$AGENTS_BASE"/*/; do
    if [[ -d "$dir" ]]; then
      local slug
      slug=$(basename "$dir")
      local status="ACTIVE"
      local disabled_file="${dir}.disabled"
      [[ -f "$disabled_file" ]] && status="${RED}DISABLED${NC}"

      local business_name="(unknown)"
      local plan="(unknown)"
      local phone="(unknown)"

      if [[ -f "${dir}USER.md" ]]; then
        business_name=$(grep -m1 "^\*\*Business Name:\*\*" "${dir}USER.md" 2>/dev/null | sed 's/\*\*Business Name:\*\* //' || echo "(unknown)")
        plan=$(grep -m1 "^\*\*Current plan:\*\*" "${dir}USER.md" 2>/dev/null | sed 's/\*\*Current plan:\*\* //' || echo "(unknown)")
        phone=$(grep -m1 "^\*\*Phone (business" "${dir}USER.md" 2>/dev/null | sed 's/.*: //' || echo "(unknown)")
      fi

      printf "  ${BOLD}%-30s${NC} %-12s %-20s %s\n" "$slug" "$plan" "$phone" "[$status]"
      ((count++)) || true
    fi
  done

  echo ""
  info "Total: $count agent(s) found"
  echo ""
}

# --- Disable an agent --------------------------------------------------------
disable_agent() {
  local name="$1"
  local slug
  slug=$(slugify "$name")
  local agent_dir="${AGENTS_BASE}/${slug}"

  [[ -d "$agent_dir" ]] || die "Agent '$slug' not found at $agent_dir"

  # Disable via openclaw CLI
  if command -v openclaw &>/dev/null; then
    openclaw agents disable "$slug" 2>/dev/null || warn "openclaw CLI disable command failed — marking via file"
  fi

  # Create disabled marker
  touch "${agent_dir}/.disabled"
  success "Agent '$slug' has been DISABLED"
  info "To re-enable: ./onboard.sh --on --name \"$name\""
}

# --- Enable an agent ---------------------------------------------------------
enable_agent() {
  local name="$1"
  local slug
  slug=$(slugify "$name")
  local agent_dir="${AGENTS_BASE}/${slug}"

  [[ -d "$agent_dir" ]] || die "Agent '$slug' not found at $agent_dir"

  rm -f "${agent_dir}/.disabled"

  if command -v openclaw &>/dev/null; then
    openclaw agents enable "$slug" 2>/dev/null || warn "openclaw CLI enable command failed — file marker removed"
  fi

  success "Agent '$slug' has been ENABLED"
}

# --- Show agent status -------------------------------------------------------
show_status() {
  local name="$1"
  local slug
  slug=$(slugify "$name")
  local agent_dir="${AGENTS_BASE}/${slug}"

  [[ -d "$agent_dir" ]] || die "Agent '$slug' not found at $agent_dir"

  header "Agent Status: $slug"
  if [[ -f "${agent_dir}/.disabled" ]]; then
    echo -e "  Status: ${RED}DISABLED${NC}"
  else
    echo -e "  Status: ${GREEN}ACTIVE${NC}"
  fi

  echo "  Directory: $agent_dir"
  echo "  Files:"
  for f in SOUL.md IDENTITY.md AGENTS.md USER.md TOOLS.md MEMORY.md HEARTBEAT.md openclaw.json; do
    if [[ -f "${agent_dir}/${f}" ]]; then
      echo -e "    ${GREEN}✓${NC} $f"
    else
      echo -e "    ${RED}✗${NC} $f (missing)"
    fi
  done

  if command -v openclaw &>/dev/null; then
    echo ""
    echo "  OpenClaw status:"
    openclaw agents status "$slug" 2>/dev/null || info "  (openclaw CLI unavailable)"
  fi
}

# --- Replace placeholders in file --------------------------------------------
fill_template() {
  local file="$1"
  shift
  # Args are pairs: PLACEHOLDER VALUE
  while [[ $# -ge 2 ]]; do
    local placeholder="$1"
    local value="$2"
    # Escape special chars in value for sed
    local escaped_value
    escaped_value=$(printf '%s\n' "$value" | sed 's/[[\.*^$()+?{|]/\\&/g; s/\//\\\//g')
    sed -i.bak "s/{{${placeholder}}}/${escaped_value}/g" "$file"
    shift 2
  done
  rm -f "${file}.bak"
}

# --- Determine heartbeat settings by plan ------------------------------------
get_heartbeat_interval() {
  case "$1" in
    starter)   echo "24h" ;;
    business)  echo "6h" ;;
    fullstack) echo "30m" ;;
    *)         echo "24h" ;;
  esac
}

get_heartbeat_cron() {
  case "$1" in
    starter)   echo "0 8 * * *" ;;
    business)  echo "0 6,12,18,0 * * *" ;;
    fullstack) echo "*/30 * * * *" ;;
    *)         echo "0 8 * * *" ;;
  esac
}

# --- Generate n8n webhook IDs ------------------------------------------------
generate_webhook_id() {
  local slug="$1"
  local event="$2"
  echo "${slug}-${event}-$(date +%s | tail -c 6)"
}

# --- Main onboarding function ------------------------------------------------
onboard() {
  local name=""
  local type=""
  local plan=""
  local phone=""
  local owner=""
  local channel="whatsapp"
  local city="Your City"
  local email="$LOCALCLAW_EMAIL"
  local timezone="America/New_York"
  local state="FL"

  # Parse args
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --name)      name="$2";      shift 2 ;;
      --type)      type="$2";      shift 2 ;;
      --plan)      plan="$2";      shift 2 ;;
      --phone)     phone="$2";     shift 2 ;;
      --owner)     owner="$2";     shift 2 ;;
      --channel)   channel="$2";   shift 2 ;;
      --city)      city="$2";      shift 2 ;;
      --email)     email="$2";     shift 2 ;;
      --timezone)  timezone="$2";  shift 2 ;;
      --state)     state="$2";     shift 2 ;;
      *) die "Unknown argument: $1" ;;
    esac
  done

  # Validate required args
  [[ -z "$name" ]]  && die "--name is required"
  [[ -z "$type" ]]  && die "--type is required"
  [[ -z "$plan" ]]  && die "--plan is required"
  [[ -z "$phone" ]] && die "--phone is required"
  [[ -z "$owner" ]] && die "--owner is required"

  # Validate type
  case "$type" in
    restaurant|real-estate|law-firm|home-services|medical|retail|general) ;;
    *) die "Invalid --type '$type'. Must be one of: restaurant, real-estate, law-firm, home-services, medical, retail, general" ;;
  esac

  # Validate plan
  case "$plan" in
    starter|business|fullstack) ;;
    *) die "Invalid --plan '$plan'. Must be one of: starter, business, fullstack" ;;
  esac

  # Derive values
  local slug
  slug=$(slugify "$name")
  local agent_dir="${AGENTS_BASE}/${slug}"
  local agent_name
  # Generate a friendly agent name based on business type
  case "$type" in
    restaurant)    agent_name="${name} Concierge" ;;
    real-estate)   agent_name="${name} Agent" ;;
    law-firm)      agent_name="${name} Intake" ;;
    home-services) agent_name="${name} Dispatch" ;;
    medical)       agent_name="${name} Care Coordinator" ;;
    retail)        agent_name="${name} Assistant" ;;
    general)       agent_name="${name} Assistant" ;;
  esac

  local heartbeat_interval
  heartbeat_interval=$(get_heartbeat_interval "$plan")
  local heartbeat_cron
  heartbeat_cron=$(get_heartbeat_cron "$plan")
  local created_at
  created_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  # Generate webhook IDs
  local n8n_lead_webhook;    n8n_lead_webhook=$(generate_webhook_id "$slug" "lead")
  local n8n_booking_webhook; n8n_booking_webhook=$(generate_webhook_id "$slug" "booking")
  local n8n_quote_webhook;   n8n_quote_webhook=$(generate_webhook_id "$slug" "quote")
  local n8n_complaint_webhook; n8n_complaint_webhook=$(generate_webhook_id "$slug" "complaint")
  local n8n_afterhours_webhook; n8n_afterhours_webhook=$(generate_webhook_id "$slug" "afterhours")
  local n8n_heartbeat_webhook; n8n_heartbeat_webhook=$(generate_webhook_id "$slug" "heartbeat")
  local n8n_followup_webhook; n8n_followup_webhook=$(generate_webhook_id "$slug" "followup")
  local n8n_crm_webhook;     n8n_crm_webhook=$(generate_webhook_id "$slug" "crm")

  # Set channel flags
  local whatsapp_enabled="false"
  local telegram_enabled="false"
  local instagram_enabled="false"
  local gmail_enabled="false"
  local discord_enabled="false"
  local slack_enabled="false"
  local primary_channel=""

  case "$plan" in
    starter)
      case "$channel" in
        whatsapp) whatsapp_enabled="true"; primary_channel="whatsapp" ;;
        telegram) telegram_enabled="true"; primary_channel="telegram" ;;
        *) die "Starter plan channel must be 'whatsapp' or 'telegram'" ;;
      esac
      ;;
    business)
      whatsapp_enabled="true"
      telegram_enabled="true"
      instagram_enabled="true"
      primary_channel="whatsapp"
      ;;
    fullstack)
      whatsapp_enabled="true"
      telegram_enabled="true"
      instagram_enabled="true"
      gmail_enabled="true"
      discord_enabled="true"
      slack_enabled="true"
      primary_channel="whatsapp"
      ;;
  esac

  # Sub-agent flags
  local researcher_enabled="false"
  local scheduler_enabled="false"
  local closer_enabled="false"
  local nemoclaw_enabled="false"
  [[ "$plan" == "fullstack" ]] && {
    researcher_enabled="true"
    scheduler_enabled="true"
    closer_enabled="true"
    nemoclaw_enabled="true"
  }

  # Open time (default — owner should update)
  local open_time="9:00 AM"
  local business_hours="Mon-Fri 9:00 AM - 6:00 PM"

  # Escalation threshold
  local escalation_threshold="\$1,000"

  # Plan display name
  local plan_display=""
  case "$plan" in
    starter)   plan_display="Starter (\$149/mo)" ;;
    business)  plan_display="Business (\$349/mo)" ;;
    fullstack) plan_display="Full Stack (\$699/mo)" ;;
  esac

  # --- Start output ---
  header "LocalClaw — New Agent Onboarding"
  echo -e "  ${BOLD}Business:${NC}  $name"
  echo -e "  ${BOLD}Slug:${NC}      $slug"
  echo -e "  ${BOLD}Type:${NC}      $type"
  echo -e "  ${BOLD}Plan:${NC}      $plan_display"
  echo -e "  ${BOLD}Owner:${NC}     $owner"
  echo -e "  ${BOLD}Phone:${NC}     $phone"
  echo -e "  ${BOLD}City:${NC}      $city"
  echo -e "  ${BOLD}Channel:${NC}   $primary_channel"
  echo -e "  ${BOLD}Heartbeat:${NC} every $heartbeat_interval"
  echo ""

  # --- Create agent directory ---
  if [[ -d "$agent_dir" ]]; then
    warn "Agent directory already exists at $agent_dir"
    read -rp "  Overwrite existing agent? [y/N] " confirm
    [[ "$confirm" =~ ^[Yy]$ ]] || die "Aborted by user"
    rm -rf "$agent_dir"
  fi

  info "Creating agent directory: $agent_dir"
  mkdir -p "$agent_dir"

  # --- Load industry context ---
  local business_type_file="${TEMPLATES_DIR}/businesses/${type}.md"
  [[ -f "$business_type_file" ]] || die "Business type template not found: $business_type_file"

  # Extract INDUSTRY_CONTEXT section from business type file (everything after the first ---)
  local industry_context
  industry_context=$(awk '/^---$/{found++; next} found>=2{print}' "$business_type_file" | head -80 || true)
  if [[ -z "$industry_context" ]]; then
    # Fallback: use first 60 lines after the header
    industry_context=$(tail -n +5 "$business_type_file" | head -60)
  fi

  # --- Load plan features ---
  local plan_file="${TEMPLATES_DIR}/plans/${plan}.md"
  [[ -f "$plan_file" ]] || die "Plan template not found: $plan_file"
  local plan_features
  plan_features=$(tail -n +5 "$plan_file" | head -100)

  # --- Copy and fill base templates ---
  local base_files=(SOUL.md IDENTITY.md AGENTS.md USER.md TOOLS.md MEMORY.md HEARTBEAT.md)

  info "Copying and filling base templates..."
  for f in "${base_files[@]}"; do
    cp "${TEMPLATES_DIR}/base/${f}" "${agent_dir}/${f}"
  done

  # Copy openclaw-client.json as openclaw.json
  cp "${TEMPLATES_DIR}/openclaw-client.json" "${agent_dir}/openclaw.json"

  # --- Fill placeholders in all files ---
  local all_files=()
  for f in "${base_files[@]}" "openclaw.json"; do
    all_files+=("${agent_dir}/${f}")
  done

  info "Filling placeholder values..."
  for file in "${all_files[@]}"; do
    fill_template "$file" \
      "AGENT_NAME"              "$agent_name" \
      "AGENT_SLUG"              "$slug" \
      "BUSINESS_NAME"           "$name" \
      "BUSINESS_TYPE"           "$type" \
      "OWNER_NAME"              "$owner" \
      "OWNER_PHONE"             "$phone" \
      "OWNER_BUSINESS_PHONE"    "$phone" \
      "OWNER_PERSONAL_PHONE"    "[SET IN USER.md]" \
      "OWNER_EMAIL"             "$email" \
      "OWNER_TELEGRAM"          "[SET AFTER TELEGRAM SETUP]" \
      "OWNER_TELEGRAM_CHAT_ID"  "[SET AFTER TELEGRAM SETUP]" \
      "OWNER_PREFERRED_CONTACT" "Telegram" \
      "OWNER_LANGUAGE"          "English" \
      "OWNER_PRIORITIES"        "[Captured during onboarding call — fill in after intake]" \
      "OWNER_DEALBREAKERS"      "[Fill in during onboarding call]" \
      "CITY"                    "$city" \
      "STATE"                   "$state" \
      "TIMEZONE"                "$timezone" \
      "BUSINESS_HOURS"          "$business_hours" \
      "OPEN_TIME"               "$open_time" \
      "BUSINESS_ADDRESS"        "[SET IN USER.md]" \
      "BUSINESS_PHONE"          "$phone" \
      "BUSINESS_EMAIL"          "$email" \
      "BUSINESS_WEBSITE"        "[SET IN USER.md]" \
      "PLAN_NAME"               "$plan_display" \
      "PLAN_FEATURES_LIST"      "$plan_features" \
      "HEARTBEAT_INTERVAL"      "$heartbeat_interval" \
      "HEARTBEAT_CRON"          "$heartbeat_cron" \
      "CLIENT_PHONE"            "$phone" \
      "N8N_LEAD_WEBHOOK"        "$n8n_lead_webhook" \
      "N8N_BOOKING_WEBHOOK"     "$n8n_booking_webhook" \
      "N8N_QUOTE_WEBHOOK"       "$n8n_quote_webhook" \
      "N8N_COMPLAINT_WEBHOOK"   "$n8n_complaint_webhook" \
      "N8N_AFTERHOURS_WEBHOOK"  "$n8n_afterhours_webhook" \
      "N8N_HEARTBEAT_WEBHOOK"   "$n8n_heartbeat_webhook" \
      "N8N_FOLLOWUP_WEBHOOK"    "$n8n_followup_webhook" \
      "N8N_CRM_WEBHOOK"         "$n8n_crm_webhook" \
      "N8N_WORKFLOW_ID"         "$n8n_lead_webhook" \
      "CAL_USERNAME"            "bverse" \
      "CAL_EVENT_TYPE"          "15min" \
      "CAL_LINK"                "bverse/15min" \
      "WHATSAPP_ENABLED"        "$whatsapp_enabled" \
      "TELEGRAM_ENABLED"        "$telegram_enabled" \
      "INSTAGRAM_ENABLED"       "$instagram_enabled" \
      "GMAIL_ENABLED"           "$gmail_enabled" \
      "DISCORD_ENABLED"         "$discord_enabled" \
      "SLACK_ENABLED"           "$slack_enabled" \
      "PRIMARY_CHANNEL"         "$primary_channel" \
      "STARTER_CHANNEL"         "$primary_channel" \
      "RESEARCHER_ENABLED"      "$researcher_enabled" \
      "SCHEDULER_ENABLED"       "$scheduler_enabled" \
      "CLOSER_ENABLED"          "$closer_enabled" \
      "NEMOCLAW_ENABLED"        "$nemoclaw_enabled" \
      "NEMOCLAW_MODE"           "flag" \
      "ESCALATION_THRESHOLD"    "$escalation_threshold" \
      "ESCALATION_HOURS"        "$business_hours" \
      "ESCALATION_CHANNEL"      "Telegram" \
      "RESPONSE_TIME"           "2 hours" \
      "CREATED_AT"              "$created_at" \
      "BILLING_EMAIL"           "$email" \
      "RENEWAL_DATE"            "[SET AT BILLING]" \
      "AGENT_EMOJI"             "🦞" \
      "CREATURE_CONCEPT"        "A sharp, fast, always-on business claw" \
      "CUSTOM_PERSONA_BRIEF"    "[FILL DURING ONBOARDING]"
  done

  # --- Inject INDUSTRY_CONTEXT into SOUL.md ---
  info "Injecting industry context..."
  # Write industry context to a temp file and use Python for safe injection (handles newlines)
  local tmp_context
  tmp_context=$(mktemp)
  echo "$industry_context" > "$tmp_context"

  if command -v python3 &>/dev/null; then
    python3 - "$tmp_context" "${agent_dir}/SOUL.md" <<'PYEOF'
import sys, re

context_file = sys.argv[1]
soul_file = sys.argv[2]

with open(context_file, 'r') as f:
    context = f.read().strip()

with open(soul_file, 'r') as f:
    content = f.read()

content = content.replace('{{INDUSTRY_CONTEXT}}', context)

with open(soul_file, 'w') as f:
    f.write(content)
PYEOF
  else
    warn "python3 not found — industry context placeholder left in SOUL.md. Fill {{INDUSTRY_CONTEXT}} manually."
  fi
  rm -f "$tmp_context"

  # --- Inject PLAN_FEATURES into AGENTS.md ---
  info "Injecting plan features..."
  local tmp_plan
  tmp_plan=$(mktemp)
  echo "$plan_features" > "$tmp_plan"

  if command -v python3 &>/dev/null; then
    python3 - "$tmp_plan" "${agent_dir}/AGENTS.md" <<'PYEOF'
import sys

plan_file = sys.argv[1]
agents_file = sys.argv[2]

with open(plan_file, 'r') as f:
    plan_content = f.read().strip()

with open(agents_file, 'r') as f:
    content = f.read()

content = content.replace('{{PLAN_FEATURES}}', plan_content)

with open(agents_file, 'w') as f:
    f.write(content)
PYEOF
  fi
  rm -f "$tmp_plan"

  # --- Register agent with OpenClaw CLI ---
  info "Registering agent with OpenClaw..."
  if command -v openclaw &>/dev/null; then
    openclaw agents add \
      --id "$slug" \
      --name "$agent_name" \
      --config "${agent_dir}/openclaw.json" \
      --soul "${agent_dir}/SOUL.md" \
      --identity "${agent_dir}/IDENTITY.md" \
      --agents "${agent_dir}/AGENTS.md" \
      --user "${agent_dir}/USER.md" \
      --tools "${agent_dir}/TOOLS.md" \
      --memory "${agent_dir}/MEMORY.md" \
      --heartbeat "${agent_dir}/HEARTBEAT.md" \
      2>/dev/null && success "Agent registered with OpenClaw CLI" \
      || warn "openclaw CLI registration failed — you'll need to register manually"
  else
    warn "openclaw CLI not found in PATH — skipping registration. Run manually after installation."
  fi

  # --- Configure heartbeat ---
  info "Configuring heartbeat (interval: $heartbeat_interval)..."
  if command -v openclaw &>/dev/null; then
    openclaw heartbeat set \
      --agent "$slug" \
      --cron "$heartbeat_cron" \
      --timezone "$timezone" \
      2>/dev/null && success "Heartbeat configured: $heartbeat_cron ($timezone)" \
      || warn "Heartbeat configuration failed — set manually via: openclaw heartbeat set --agent $slug --cron \"$heartbeat_cron\""
  else
    warn "Set heartbeat manually: openclaw heartbeat set --agent $slug --cron \"$heartbeat_cron\" --timezone \"$timezone\""
  fi

  # --- Set required environment variables ---
  info "Setting environment variable stubs..."
  if command -v openclaw &>/dev/null; then
    openclaw env set --agent "$slug" \
      WHATSAPP_TOKEN="[SET_THIS]" \
      WHATSAPP_PHONE_ID="[SET_THIS]" \
      TELEGRAM_BOT_TOKEN="[SET_THIS]" \
      OWNER_TELEGRAM_CHAT_ID="[SET_THIS]" \
      LOCALCLAW_API_KEY="[SET_THIS]" \
      N8N_WEBHOOK_TOKEN="[SET_THIS]" \
      CAL_API_KEY="[SET_THIS]" \
      SUPABASE_URL="[SET_THIS]" \
      SUPABASE_ANON_KEY="[SET_THIS]" \
      2>/dev/null && success "Environment variable stubs created" \
      || warn "Could not set env vars via CLI — set them manually"
  fi

  # --- Write summary file ---
  local summary_file="${agent_dir}/ONBOARDING-SUMMARY.txt"
  cat > "$summary_file" <<SUMMARY
LocalClaw Agent Onboarding Summary
===================================
Generated: $created_at

Business:  $name
Slug:      $slug
Type:      $type
Plan:      $plan_display
Owner:     $owner
Phone:     $phone
City:      $city, $state
Timezone:  $timezone

Agent directory: $agent_dir

Files created:
  - SOUL.md
  - IDENTITY.md
  - AGENTS.md
  - USER.md
  - TOOLS.md
  - MEMORY.md
  - HEARTBEAT.md
  - openclaw.json

Heartbeat interval: $heartbeat_interval (cron: $heartbeat_cron)

Channels active:
  WhatsApp:  $whatsapp_enabled
  Telegram:  $telegram_enabled
  Instagram: $instagram_enabled
  Gmail:     $gmail_enabled
  Discord:   $discord_enabled
  Slack:     $slack_enabled

n8n Webhook IDs:
  Lead capture:  $n8n_lead_webhook
  Booking:       $n8n_booking_webhook
  Quote:         $n8n_quote_webhook
  Complaint:     $n8n_complaint_webhook
  After-hours:   $n8n_afterhours_webhook
  Heartbeat:     $n8n_heartbeat_webhook
  Follow-up:     $n8n_followup_webhook
  CRM sync:      $n8n_crm_webhook

NEXT STEPS (complete before going live):
  1. Fill in remaining placeholders in USER.md (address, website, staff contacts)
  2. Fill in MEMORY.md (services list, pricing, FAQs)
  3. Set all environment variables (WHATSAPP_TOKEN, TELEGRAM_BOT_TOKEN, etc.)
  4. Connect WhatsApp Business API and complete phone number verification
  5. Set up Telegram bot via @BotFather and get owner's Telegram chat ID
  6. Import n8n workflows from: $TEMPLATES_DIR/n8n/
  7. Configure n8n workflow webhook IDs to match the IDs above
  8. Set SUPABASE_URL and SUPABASE_ANON_KEY
  9. Run test messages on each active channel
  10. Verify heartbeat fires on schedule

Support: $LOCALCLAW_EMAIL | $WEBSITE
Book a setup call: $CAL_LINK
SUMMARY

  # --- Final summary ---
  echo ""
  header "Onboarding Complete"
  echo -e "  ${GREEN}${BOLD}Agent created successfully!${NC}"
  echo ""
  echo -e "  ${BOLD}Directory:${NC}   $agent_dir"
  echo -e "  ${BOLD}Heartbeat:${NC}   Every $heartbeat_interval"
  echo -e "  ${BOLD}Channels:${NC}    $([ "$whatsapp_enabled" == "true" ] && echo "WhatsApp " || echo "")$([ "$telegram_enabled" == "true" ] && echo "Telegram " || echo "")$([ "$instagram_enabled" == "true" ] && echo "Instagram " || echo "")$([ "$gmail_enabled" == "true" ] && echo "Gmail " || echo "")"
  echo ""
  echo -e "  ${YELLOW}${BOLD}REMAINING STEPS:${NC}"
  echo "  1. Fill remaining placeholders in USER.md and MEMORY.md"
  echo "  2. Set environment variables (WHATSAPP_TOKEN, TELEGRAM_BOT_TOKEN, etc.)"
  echo "  3. Connect messaging channels"
  echo "  4. Import n8n workflows from: $TEMPLATES_DIR/n8n/"
  echo "  5. Run test messages and verify heartbeat"
  echo ""
  echo -e "  Full setup summary saved to: ${CYAN}$summary_file${NC}"
  echo -e "  Full onboarding checklist:   ${CYAN}$TEMPLATES_DIR/ONBOARDING-CHECKLIST.md${NC}"
  echo ""
  echo -e "  Questions? ${CYAN}$LOCALCLAW_EMAIL${NC} | Book a call: ${CYAN}$CAL_LINK${NC}"
  echo ""
}

# --- Entry point -------------------------------------------------------------
main() {
  if [[ $# -eq 0 ]]; then
    usage
    exit 0
  fi

  case "$1" in
    --help|-h) usage; exit 0 ;;
    --list)    list_agents; exit 0 ;;
    --off)
      shift
      local off_name=""
      while [[ $# -gt 0 ]]; do
        case "$1" in
          --name) off_name="$2"; shift 2 ;;
          *) shift ;;
        esac
      done
      [[ -z "$off_name" ]] && die "--name required with --off flag"
      disable_agent "$off_name"
      ;;
    --on)
      shift
      local on_name=""
      while [[ $# -gt 0 ]]; do
        case "$1" in
          --name) on_name="$2"; shift 2 ;;
          *) shift ;;
        esac
      done
      [[ -z "$on_name" ]] && die "--name required with --on flag"
      enable_agent "$on_name"
      ;;
    --status)
      shift
      local status_name=""
      while [[ $# -gt 0 ]]; do
        case "$1" in
          --name) status_name="$2"; shift 2 ;;
          *) shift ;;
        esac
      done
      [[ -z "$status_name" ]] && die "--name required with --status flag"
      show_status "$status_name"
      ;;
    --name|*)
      onboard "$@"
      ;;
  esac
}

main "$@"
