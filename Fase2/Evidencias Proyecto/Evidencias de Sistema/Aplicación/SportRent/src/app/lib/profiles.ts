import { supabase } from "./supabase";

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", userId) 
    .single();

  if (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return null;
  }

  return data;
};

export const getUserFullName = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("nombre, apellidos")
    .eq("id", userId) 
    .single();

  if (error) {
    console.error("Error al obtener el nombre y apellidos del usuario:", error);
    return null;
  }

  if (data) {
    return `${data.nombre} ${data.apellidos}`;
  }

  return null;
};

export const getOwnerFullName = async (ownerId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("nombre, apellidos, user_type") 
    .eq("id", ownerId)
    .eq("user_type", "arrendador") 
    .single();

  if (error) {
    console.error("Error al obtener el nombre y apellidos del propietario:", error);
    return null;
  }

  if (data && data.user_type === "arrendador") {
    return `${data.nombre} ${data.apellidos}`;
  }

  return null;
};

