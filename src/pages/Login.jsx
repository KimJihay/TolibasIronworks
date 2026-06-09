import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) alert(error.message);
    else navigate('/admin');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1a1a]">
      
      {/* The Login Card */}
      <div className="w-full max-w-md bg-[#242424] p-10 border border-[#333] shadow-2xl flex flex-col items-center">
        
        {/* Header Text */}
        <div className="text-center mb-8">
          <h1 className="text-white text-xl font-black uppercase tracking-wider">MANAGEMENT SIGN-IN</h1>
          <p className="text-gray-400 text-xs mt-1">Tolibas Iron Works Securing Console</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Sampleadmin@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-[#e2e8f0] text-gray-900 border-none outline-none text-sm"
            required
          />
          <input 
            type="password" 
            placeholder="••••••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-[#e2e8f0] text-gray-900 border-none outline-none text-sm"
            required
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-black py-3 mt-2 hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm"
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER ACCESS'}
          </button>
        </form>

        {/* Return Button */}
        <button 
          onClick={() => navigate('/')} 
          className="mt-8 text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest underline transition-colors"
        >
          ← Return to Public Portfolio
        </button>
      </div>
    </div>
  );
}