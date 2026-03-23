import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function isAuthed(req: NextRequest): boolean {
  const cookie = req.cookies.get("lc_admin");
  return cookie?.value === process.env.ADMIN_PASSWORD;
}

// GET — list all skills, or skills for a specific agent
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getSupabase();
  const sp = req.nextUrl.searchParams;
  const agentId = sp.get("agentId");

  // If agentId provided, return skills assigned to that agent
  if (agentId) {
    const { data, error } = await db
      .from("agent_skills")
      .select("*, skill:skills(*)")
      .eq("agent_id", agentId)
      .order("assigned_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ agentSkills: data || [] });
  }

  // Otherwise return all skills
  const { data, error } = await db
    .from("skills")
    .select("*")
    .order("is_template", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ skills: data || [] });
}

// POST — create, update, delete skills + assign/unassign from agents
export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;
  const db = getSupabase();

  // ── CREATE SKILL ──
  if (action === "create") {
    const { name, description, category, instructions, userInvocable, plans, requiredTools } = body;

    if (!name || !description || !instructions) {
      return NextResponse.json({ error: "name, description, and instructions are required" }, { status: 400 });
    }

    const { data, error } = await db
      .from("skills")
      .insert({
        name,
        description,
        category: category || "custom",
        instructions,
        user_invocable: userInvocable || false,
        plans: plans || ["starter", "business", "fullstack"],
        required_tools: requiredTools || [],
        is_template: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, skill: data });
  }

  // ── UPDATE SKILL ──
  if (action === "update") {
    const { skillId, name, description, category, instructions, userInvocable, plans, requiredTools } = body;

    if (!skillId) {
      return NextResponse.json({ error: "skillId required" }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (instructions !== undefined) updates.instructions = instructions;
    if (userInvocable !== undefined) updates.user_invocable = userInvocable;
    if (plans !== undefined) updates.plans = plans;
    if (requiredTools !== undefined) updates.required_tools = requiredTools;

    const { data, error } = await db
      .from("skills")
      .update(updates)
      .eq("id", skillId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, skill: data });
  }

  // ── DELETE SKILL ──
  if (action === "delete") {
    const { skillId } = body;
    if (!skillId) {
      return NextResponse.json({ error: "skillId required" }, { status: 400 });
    }

    // Don't allow deleting template skills
    const { data: skill } = await db.from("skills").select("is_template").eq("id", skillId).single();
    if (skill?.is_template) {
      return NextResponse.json({ error: "Cannot delete template skills" }, { status: 400 });
    }

    const { error } = await db.from("skills").delete().eq("id", skillId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  // ── ASSIGN SKILL TO AGENT ──
  if (action === "assign") {
    const { agentId, skillId } = body;
    if (!agentId || !skillId) {
      return NextResponse.json({ error: "agentId and skillId required" }, { status: 400 });
    }

    const { data, error } = await db
      .from("agent_skills")
      .upsert({ agent_id: agentId, skill_id: skillId, enabled: true }, { onConflict: "agent_id,skill_id" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, agentSkill: data });
  }

  // ── UNASSIGN SKILL FROM AGENT ──
  if (action === "unassign") {
    const { agentId, skillId } = body;
    if (!agentId || !skillId) {
      return NextResponse.json({ error: "agentId and skillId required" }, { status: 400 });
    }

    const { error } = await db
      .from("agent_skills")
      .delete()
      .eq("agent_id", agentId)
      .eq("skill_id", skillId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
