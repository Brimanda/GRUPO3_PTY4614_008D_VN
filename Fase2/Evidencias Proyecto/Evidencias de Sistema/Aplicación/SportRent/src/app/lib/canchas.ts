import { supabase } from "./supabase"; 

export async function getCanchas() {
  const { data, error } = await supabase.from("canchas").select("*");
  if (error) throw error;
  return data;
}

export async function getCanchaById(canchaId: number) {
  const { data, error } = await supabase
    .from("canchas")
    .select("*")
    .eq("id", canchaId)
    .single();
  if (error) throw error;
  return data;
}

export async function createCancha(canchaData: any) {
  const { data, error } = await supabase.from("canchas").insert([canchaData]);
  if (error) throw error;
  return data;
}

export async function updateCancha(canchaId: number, updatedData: any) {
  const { data, error } = await supabase
    .from("canchas")
    .update(updatedData)
    .eq("id", canchaId);
  if (error) throw error;
  return data;
}

export async function deleteCancha(canchaId: number) {
  const { data, error } = await supabase.from("canchas").delete().eq("id", canchaId);
  if (error) throw error;
  return data;
}

export const getPromedioYTotalPuntuacion = async (canchaId: number) => {
  const { data, error } = await supabase
    .from('reservas')
    .select('puntuacion')
    .eq('cancha_id', canchaId);

  if (error) {
    console.error("Error al obtener puntuaciones:", error);
    return { promedio: 0, total: 0 };
  }

  const totalPuntuaciones = data.length;
  const sumaPuntuaciones = data.reduce((sum, { puntuacion }) => sum + puntuacion, 0);
  const promedio = totalPuntuaciones > 0 ? sumaPuntuaciones / totalPuntuaciones : 0;

  return { promedio, total: totalPuntuaciones };
};