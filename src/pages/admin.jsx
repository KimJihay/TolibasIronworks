import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AdminDashboard from './AdminDashboard';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) navigate('/login');
    });
  }, [navigate]);

  if (loading) return <div className="text-white p-10">Verifying session...</div>;
  
  // This is the ONLY thing that should render if authenticated
  return <AdminDashboard />;
}