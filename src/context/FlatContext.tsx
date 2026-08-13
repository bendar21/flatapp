import { supabase } from "@/src/config/supabase";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useAuth } from "./AuthContext";

type Flat = {
  id: string;
  name: string;
  address: string;
  suburb: string | null;
  join_code: string;
};

type FlatContextValue = {
  flat: Flat | null;
  role: "admin" | "member" | null;
  isLoaded: boolean;
  hasFlat: boolean;
  createFlat: (
    name: string,
    address: string,
  ) => Promise<{ error: string | null }>;
  joinFlat: (code: string) => Promise<{ error: string | null }>;
  refresh: () => Promise<void>;
};

const FlatContext = createContext<FlatContextValue | undefined>(undefined);

// No 0/O or 1/I/L — those look identical when a flatmate reads the code
// out loud or texts it to you.
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generateJoinCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function FlatProvider({ children }: { children: React.ReactNode }) {
  const { session, isLoaded: authLoaded } = useAuth();
  const [flat, setFlat] = useState<Flat | null>(null);
  const [role, setRole] = useState<"admin" | "member" | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (!session?.user) {
      setFlat(null);
      setRole(null);
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
    const { data, error } = await supabase
      .from("flat_members")
      .select("role, flats(id, name, address, suburb, join_code)")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error || !data?.flats) {
      setFlat(null);
      setRole(null);
    } else {
      // Supabase types a join as an array unless told otherwise — it's
      // always a single row here, since one flat_members row = one flat.
      const flatRow = Array.isArray(data.flats) ? data.flats[0] : data.flats;
      setFlat(flatRow as Flat);
      setRole(data.role as "admin" | "member");
    }
    setIsLoaded(true);
  }, [session?.user?.id]);

  useEffect(() => {
    if (authLoaded) refresh();
  }, [authLoaded, refresh]);

  const createFlat = useCallback(
    async (name: string, address: string) => {
      if (!session?.user) return { error: "Not signed in" };

      let flatId: string | null = null;
      let lastError: string | null = null;

      // join_code is UNIQUE in your schema — retry a couple times on the
      // (extremely unlikely) chance of a collision.
      for (let attempt = 0; attempt < 3 && !flatId; attempt++) {
        const { data, error } = await supabase
          .from("flats")
          .insert({
            name: name.trim(),
            address: address.trim(),
            join_code: generateJoinCode(),
          })
          .select("id")
          .single();

        if (data) {
          flatId = data.id;
        } else if (error?.code === "23505") {
          lastError = error.message;
        } else {
          return { error: error?.message ?? "Could not create flat" };
        }
      }

      if (!flatId)
        return {
          error: lastError ?? "Could not generate a unique code — try again",
        };

      const { error: memberError } = await supabase
        .from("flat_members")
        .insert({ flat_id: flatId, user_id: session.user.id, role: "admin" });
      if (memberError) return { error: memberError.message };

      await refresh();
      return { error: null };
    },
    [session?.user?.id, refresh],
  );

  const joinFlat = useCallback(
    async (code: string) => {
      if (!session?.user) return { error: "Not signed in" };

      const { data: flatRow, error: lookupError } = await supabase
        .from("flats")
        .select("id")
        .eq("join_code", code.trim().toUpperCase())
        .maybeSingle();

      if (lookupError) return { error: lookupError.message };
      if (!flatRow)
        return {
          error:
            "No flat found with that code — double check it with your flatmate",
        };

      const { error: memberError } = await supabase
        .from("flat_members")
        .insert({
          flat_id: flatRow.id,
          user_id: session.user.id,
          role: "member",
        });
      if (memberError) return { error: memberError.message };

      await refresh();
      return { error: null };
    },
    [session?.user?.id, refresh],
  );

  return (
    <FlatContext.Provider
      value={{
        flat,
        role,
        isLoaded,
        hasFlat: !!flat,
        createFlat,
        joinFlat,
        refresh,
      }}
    >
      {children}
    </FlatContext.Provider>
  );
}

export function useFlat() {
  const ctx = useContext(FlatContext);
  if (!ctx) throw new Error("useFlat must be used within a FlatProvider");
  return ctx;
}
