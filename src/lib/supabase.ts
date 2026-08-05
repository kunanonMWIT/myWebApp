import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type StudyRecord = {
  id: string | null;
  subjectName: string;
  createdAt: Date;
  chapters: number;
  totalMinutes: number;
};

export type { SupabaseClient };

const TABLE = "Study Report";

type StudyRow = {
  id: string;
  created_at: string;
  subject_name: string | null;
  study_time: number | null;
  chapter_amount: number | null;
};

function mapRow(row: StudyRow): StudyRecord {
  return {
    id: row.id,
    subjectName: row.subject_name ?? "",
    createdAt: new Date(row.created_at),
    chapters: Number(row.chapter_amount ?? 0),
    totalMinutes: Number(row.study_time ?? 0),
  };
}

export function createStudyClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export async function verifyConnection(sb: SupabaseClient): Promise<void> {
  const { error } = await sb.from(TABLE).select("id").limit(1);
  if (error) throw error;
}

export async function fetchRecords(sb: SupabaseClient): Promise<StudyRecord[]> {
  const { data, error } = await sb
    .from(TABLE)
    .select("id, created_at, subject_name, study_time, chapter_amount")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function insertRecord(
  sb: SupabaseClient,
  rec: {
    subjectName: string;
    chapters: number;
    totalMinutes: number;
    createdAt: Date;
  }
): Promise<StudyRecord> {
  const { data, error } = await sb
    .from(TABLE)
    .insert({
      subject_name: rec.subjectName,
      study_time: rec.totalMinutes,
      chapter_amount: rec.chapters,
      created_at: rec.createdAt.toISOString(),
    })
    .select();
  if (error) throw error;
  if (!data || data.length === 0) throw new Error("Insert returned no row");
  return mapRow(data[0]);
}

export async function deleteRecord(
  sb: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await sb.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
