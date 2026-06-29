
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (isSignUp) {
      // REGISTRACIJA
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setErrorMsg(error.message);
      else alert("Uspešna registracija! Možeš se ulogovati.");
    } else {
      // LOGIN
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg(error.message);
      else router.push("/"); // Vodi nas na glavnu stranicu sa brojačima
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#090d16] min-h-screen flex items-center justify-center p-4">
      <div className="bg-[#111622] border border-slate-800/60 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isSignUp ? "Napravi nalog" : "Prijavi se"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0d111a] border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition"
              placeholder="tvoj.email@gmail.com"
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm block mb-1">Lozinka</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0d111a] border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && <p className="text-rose-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Samo sekund..." : isSignUp ? "REGISTRACIJA" : "PRIJAVI SE"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          {isSignUp ? "Već imaš nalog?" : "Nemaš nalog?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:underline focus:outline-none"
          >
            {isSignUp ? "Prijavi se" : "Registruj se"}
          </button>
        </p>
      </div>
    </div>
  );
}