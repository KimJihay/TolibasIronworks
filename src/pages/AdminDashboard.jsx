import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({ title: '', desc: '', category: 'Gates' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true); // Added for initial data fetch
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setDataLoading(true);
    const { data: inqData } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    const { data: projData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (inqData) setInquiries(inqData);
    if (projData) setProjects(projData);
    setDataLoading(false);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select an image');
    setLoading(true);

    // Sanitize filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, file);
    
    if (uploadError) { setLoading(false); return alert(uploadError.message); }

    const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(fileName);

    const { error } = await supabase.from('projects').insert([{ 
      title: projectForm.title, 
      description: projectForm.desc, 
      category: projectForm.category, 
      image_url: publicUrl 
    }]);

    setLoading(false);
    if (error) alert(error.message);
    else { alert('Project Published'); setProjectForm({ title: '', desc: '', category: 'Gates' }); setFile(null); fetchData(); }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Permanently delete this project?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) fetchData();
    else alert(error.message);
  };

  return (
    <div className="min-h-screen flex bg-[#1a1a1a]">
      {/* Sidebar */}
      <aside className="w-72 bg-black/40 backdrop-blur-md border-r border-white/5 p-10 flex flex-col">
        <h1 className="text-sm text-white font-black uppercase tracking-widest mb-16">Tolibas Iron Works</h1>
        
        <nav className="flex flex-col gap-8 flex-grow">
          {['inquiries', 'add-project', 'view-projects'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`text-left text-sm font-black uppercase tracking-widest transition-all 
              ${activeTab === tab ? 'text-white' : 'text-zinc-600 hover:text-white'}`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </nav>
        
        <button onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }} className="text-left text-sm font-black uppercase tracking-widest text-red-900 hover:text-red-600">
          Log Out
        </button>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-grow flex flex-col p-16 items-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-12 text-white">{activeTab.replace('-', ' ')}</h2>

          {dataLoading ? (
            <div className="text-white">Loading data...</div>
          ) : (
            <>
              {activeTab === 'inquiries' && (
                inquiries.length > 0 ? (
                  <div className="grid gap-6">
                    {inquiries.map(inq => (
                      <div key={inq.id} className="p-8 bg-white/5 border border-white/10 rounded-sm">
                        <h4 className="font-black uppercase text-base text-white">{inq.name}</h4>
                        <p className="text-xs text-zinc-300 mb-4">{inq.contact_info}</p>
                        <p className="text-sm text-zinc-100 italic border-l-2 border-white/20 pl-4">"{inq.specifications}"</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-zinc-500">No inquiries yet.</p>
              )}

              {activeTab === 'add-project' && (
                <form onSubmit={handleAddProject} className="flex flex-col gap-6 bg-white/5 p-8 border border-white/5 rounded-sm">
                  <input placeholder="Project Title" required className="w-full p-4 bg-transparent border border-white/10 text-sm text-white outline-none focus:border-white" onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                  <textarea placeholder="Technical Description" required className="w-full p-4 bg-transparent border border-white/10 text-sm text-white h-40 outline-none focus:border-white" onChange={e => setProjectForm({...projectForm, desc: e.target.value})} />
                  
                  <div className="grid grid-cols-2 gap-3">
                    {['Gates', 'Staircases', 'Windows', 'Structural'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
                        <input type="radio" name="category" value={cat} checked={projectForm.category === cat} onChange={e => setProjectForm({...projectForm, category: e.target.value})} className="accent-white" />
                        {cat.toUpperCase()}
                      </label>
                    ))}
                  </div>

                  <input type="file" accept="image/*" required className="text-zinc-400 text-sm file:mr-4 file:bg-white file:border-none file:px-4 file:py-2 file:text-[10px] file:font-black" onChange={e => setFile(e.target.files[0])} />
                  
                  <button disabled={loading} className="w-full bg-white text-black font-black py-4 text-xs uppercase tracking-widest hover:bg-zinc-200">
                    {loading ? 'Publishing...' : 'Publish Project'}
                  </button>
                </form>
              )}

              {activeTab === 'view-projects' && (
                <div className="grid grid-cols-2 gap-6">
                  {projects.length > 0 ? projects.map(proj => (
                    <div key={proj.id} className="bg-white/5 border border-white/5 p-4 rounded-sm">
                      <img src={proj.image_url} className="h-40 w-full object-cover mb-4" alt={proj.title} />
                      <h4 className="text-sm font-bold uppercase text-white">{proj.title}</h4>
                      <button onClick={() => handleDeleteProject(proj.id)} className="text-[10px] text-red-500 uppercase mt-2 font-bold hover:text-red-400">Delete</button>
                    </div>
                  )) : <p className="text-zinc-500">No projects to display.</p>}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}