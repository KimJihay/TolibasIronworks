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
      
      // FIX: Only redirect if you are NOT already at the login page
      if (!session && window.location.pathname !== '/login') {
        navigate('/login');
      }
    });
  }, [navigate]);

  if (loading) return <div className="text-white p-10">Verifying session...</div>;
  
  // If there is no session, don't show the dashboard
  if (!session) return null; 

  return <AdminDashboard />;
}