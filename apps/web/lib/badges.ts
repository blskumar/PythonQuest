import { SupabaseClient } from "@supabase/supabase-js";
import { ALL_BADGES, BadgeInfo } from "./curriculum";

export interface StudentBadgeRecord {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

/**
 * Syncs or awards a badge to a learner by name or ID.
 */
export async function awardBadge(
  supabase: SupabaseClient,
  userId: string,
  badgeNameOrId: string
): Promise<{ awarded: boolean; badge: BadgeInfo | null }> {
  const badgeInfo = ALL_BADGES.find(
    (b) =>
      b.id.toLowerCase() === badgeNameOrId.toLowerCase() ||
      b.name.toLowerCase() === badgeNameOrId.toLowerCase()
  );

  if (!badgeInfo) {
    return { awarded: false, badge: null };
  }

  try {
    // 1. Check if badge exists in public.badges table, or insert it
    const { data: existingBadge } = await supabase
      .from("badges")
      .select("id, name")
      .eq("name", badgeInfo.name)
      .maybeSingle();

    let badgeUuid = existingBadge?.id;

    if (!badgeUuid) {
      const { data: newBadge } = await supabase
        .from("badges")
        .insert({
          name: badgeInfo.name,
          description: badgeInfo.description,
          icon: badgeInfo.icon,
        })
        .select("id")
        .maybeSingle();

      badgeUuid = newBadge?.id;
    }

    if (!badgeUuid) {
      return { awarded: false, badge: badgeInfo };
    }

    // 2. Insert into student_badges
    const { error: studentBadgeError } = await supabase
      .from("student_badges")
      .insert({
        user_id: userId,
        badge_id: badgeUuid,
      });

    if (studentBadgeError && studentBadgeError.code !== "23505") {
      // 23505 is unique violation (already earned)
      console.warn("Could not award badge:", studentBadgeError.message);
      return { awarded: false, badge: badgeInfo };
    }

    return { awarded: true, badge: badgeInfo };
  } catch (err) {
    console.warn("awardBadge error:", err);
    return { awarded: false, badge: badgeInfo };
  }
}

/**
 * Fetches all earned badges for a user with fallback.
 */
export async function getStudentBadges(
  supabase: SupabaseClient,
  userId: string
): Promise<StudentBadgeRecord[]> {
  try {
    const { data, error } = await supabase
      .from("student_badges")
      .select("earned_at, badge_id, badges(id, name, description, icon)")
      .eq("user_id", userId);

    if (error || !data) {
      return [];
    }

    return data
      .map((item: any) => {
        const b = Array.isArray(item.badges) ? item.badges[0] : item.badges;
        if (!b) return null;
        return {
          id: b.id,
          name: b.name,
          description: b.description || "",
          icon: b.icon || "🏆",
          earned_at: item.earned_at,
        };
      })
      .filter((b): b is StudentBadgeRecord => b !== null);
  } catch (err) {
    console.warn("getStudentBadges error:", err);
    return [];
  }
}
