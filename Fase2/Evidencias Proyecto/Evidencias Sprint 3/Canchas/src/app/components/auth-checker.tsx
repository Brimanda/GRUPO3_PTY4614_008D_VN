import { supabase } from "@/app/lib/supabase";

export async function AuthChecker() {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session; 
}
