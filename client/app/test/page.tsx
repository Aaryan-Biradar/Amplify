import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("test_items")
    .select("id,name,description,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <pre>
        {JSON.stringify(
          { message: error.message, details: error.details, hint: error.hint, code: error.code },
          null,
          2
        )}
      </pre>
    );
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
