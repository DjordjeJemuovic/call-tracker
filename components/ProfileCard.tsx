"use client";

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, Mail, LogOut, ShieldCheck, RefreshCw, Camera } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfileCard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [poruka, setPoruka] = useState<{ tip: 'success' | 'error', tekst: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const uzmiProfil = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          setUsername(session.user.user_metadata?.username || session.user.user_metadata?.name || 'Korisnik');
          setAvatarUrl(session.user.user_metadata?.avatar_url || null);
        }
      } catch (err) {
        console.error("Greška pri učitavanju profila:", err);
      } finally {
        setLoading(false);
      }
    };

    uzmiProfil();
  }, []);

  const hendlujLogout = async () => {
    const potvrda = window.confirm("Da li sigurno želiš da se odjaviš?");
    if (!potvrda) return;
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  const hendlujUploadSlike = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      setPoruka(null);
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Pravimo jedinstveno ime fajla preko ID-ja korisnika da ne gomilamo stare slike
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload u 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Uzmi javni URL te slike
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Sačuvaj javni URL u metapodatke korisnika
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setPoruka({ tip: 'success', tekst: 'Profilna slika je uspešno promenjena!' });
    } catch (err: any) {
      console.error(err);
      setPoruka({ tip: 'error', tekst: err.message || 'Greška prilikom uploada slike.' });
    } finally {
      setUploading(false);
    }
  };

  const azurirajProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      setPoruka(null);

      const { error } = await supabase.auth.updateUser({
        data: { username: username }
      });

      if (error) throw error;

      setPoruka({ tip: 'success', tekst: 'Profil je uspešno ažuriran!' });
    } catch (err: any) {
      setPoruka({ tip: 'error', tekst: err.message || 'Greška pri ažuriranju.' });
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#111622] border border-slate-800/80 rounded-3xl p-8 w-full max-w-md text-center shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-slate-400 mt-4 text-sm">Učitavam profil...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111622] border border-slate-800/80 rounded-3xl p-5 w-full max-w-md shadow-2xl md:p-6 mb-6">
      
      {/* Skriveni input za izbor fajla */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={hendlujUploadSlike} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Zaglavlje profila */}
      <div className="flex flex-col items-center text-center border-b border-slate-800/60 pb-5 mb-5">
        
        {/* Klikom na ovaj krug se pokreće biranje slike */}
        <div 
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="relative w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/10 cursor-pointer group overflow-hidden border-2 border-slate-800 hover:border-blue-500/50 transition-all"
        >
          {uploading ? (
            <RefreshCw size={24} className="animate-spin text-white" />
          ) : avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={40} />
          )}
          
          {/* Efekat prelaza preko slike na hover */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Camera size={18} className="text-white" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-100">{username}</h2>
        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
          <Mail size={12} /> {user?.email}
        </p>
      </div>

      {/* Forma za izmenu podataka */}
      <form onSubmit={azurirajProfil} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Nadimak / Username
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#181f30] border border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all pl-10"
              placeholder="Unesi nadimak"
              required
            />
            <User size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
          </div>
        </div>

        {poruka && (
          <div className={`p-3 rounded-xl text-xs font-medium text-center ${
            poruka.tip === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {poruka.tekst}
          </div>
        )}

        <button
          type="submit"
          disabled={updateLoading || uploading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-3 px-4 rounded-2xl transition-all shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {updateLoading ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <>
              <ShieldCheck size={16} /> Sačuvaj Izmene
            </>
          )}
        </button>
      </form>

      {/* Dugme za Logout */}
      <div className="mt-6 pt-4 border-t border-slate-800/60">
        <button
          onClick={hendlujLogout}
          className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium text-sm py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <LogOut size={16} /> Izloguj se
        </button>
      </div>
    </div>
  );
}