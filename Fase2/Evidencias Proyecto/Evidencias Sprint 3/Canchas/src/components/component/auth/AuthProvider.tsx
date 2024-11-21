"use client";
import { useState, useEffect, createContext, useContext, SetStateAction } from "react";
import { Session, AuthChangeEvent, ResendParams } from "@supabase/supabase-js";
import { supabase } from "@/app/lib/supabase";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  userType: string | null; 
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, nombre: string, apellidos: string, userType: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType>( {
  session: null,
  isLoading: true,
  userType: null, 
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resendVerificationEmail: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null); 

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUserType(data.session?.user?.user_metadata?.user_type || null); 
      setIsLoading(false);
    };

    fetchSession();

    const { data: { subscription }} = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      setSession(session);
      setUserType(session?.user?.user_metadata?.user_type || null); 
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, username: string, nombre: string, apellidos: string, userType: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const user = data.user;


    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ 
        id: user?.id, 
        username, 
        nombre, 
        apellidos, 
        user_type: userType 
      }]);

    if (profileError) throw profileError;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resendVerificationEmail = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError; 
      }

      if (!session || !session.user || !session.user.email) {
        throw new Error("Could not find user's email.");
      }

      const { error } = await supabase.auth.resend({
        email: session.user.email,
        type: "signup",
      } as ResendParams);

      if (error) throw error;
    } catch (error: any) {
      if (error.name === "AuthApiError" && error.status === 400) {
        throw new Error("El usuario ya ha sido verificado.");
      } else {
        throw new Error("Error al reenviar el correo de verificación.");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        userType, 
        signIn,
        signUp,
        signOut,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
