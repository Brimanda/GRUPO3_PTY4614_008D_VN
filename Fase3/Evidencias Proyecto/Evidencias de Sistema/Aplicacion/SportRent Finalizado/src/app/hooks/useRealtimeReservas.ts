import { useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function useRealtimeReservas(onChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel("reservas-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservas" },
        () => {
          console.log("Cambio detectado en reservas");
          onChange(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); 
    };
  }, [onChange]);
}
