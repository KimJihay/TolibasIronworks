import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import AdminDashboard from './AdminDashboard'; 
import { Hammer, Ruler, Zap, ShieldCheck } from 'lucide-react'; // Added icons

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const [formData, setFormData] = useState({ name: '', contact: '', specs: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4';
      document.head.appendChild(script);
    }

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes satinRustFlow {
        0% { background-position: 0% 50%, 100% 30%, 0% 70%, 0% 0%; }
        50% { background-position: 100% 50%, 0% 70%, 100% 30%, 0% 0%; }
        100% { background-position: 0% 50%, 100% 30%, 0% 70%, 0% 0%; }
      }
      body, html, #root { 
        margin: 0 !important; padding: 0 !important; background-color: #0b0b0d; 
        background-image: 
          radial-gradient(ellipse at 35% 25%, #7a7a8c 0%, transparent 45%),
          radial-gradient(ellipse at 75% 75%, #30303a 0%, #050506 65%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='rustTexture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' result='pitting'/%3E%3CfeTurbulence type='turbulence' baseFrequency='0.05' numOctaves='2' result='corrosion'/%3E%3CfeBlend mode='multiply' in='pitting' in2='corrosion'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23rustTexture)' opacity='0.22'/%3E%3C/svg%3E");
        background-size: 200% 200%, 200% 200%, auto; animation: satinRustFlow 12s ease-in-out infinite;
        overflow-x: hidden; width: 100% !important; max-width: 100% !important;
      }
    `;
    document.head.appendChild(style);

    supabase.from('projects').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) {
        setItems(data);
        setFilteredItems(data);
      }
    });
  }, []);

  useEffect(() => {
    let output = [...items];
    if (selectedCategory !== 'all') {
      output = output.filter(item => item.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase());
    }
    if (searchQuery.trim() !== '') {
      output = output.filter(item => 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredItems(output);
  }, [searchQuery, selectedCategory, items]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    const { error } = await supabase.from('inquiries').insert([
      { name: formData.name, contact_info: formData.contact, specifications: formData.specs }
    ]);
    setFormSubmitting(false);
    if (error) { alert('Error submitting inquiry request: ' + error.message); } 
    else { alert('Success! Your inquiry has been sent to Tolibas Iron Works Admin.'); setFormData({ name: '', contact: '', specs: '' }); }
  };

  if (activeTab === 'admin') {
    return <AdminDashboard onBackToPortfolio={() => setActiveTab('home')} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col font-sans antialiased box-border m-0 p-0" style={{ color: '#ffffff' }}>
      <header className="w-full bg-black/40 text-white z-20 sticky top-0 shadow-xl m-0 p-0 border-b border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-center py-5 px-8 md:px-16 max-w-7xl mx-auto w-full box-border">
          <div onClick={() => setActiveTab('home')} className="flex items-center gap-3 text-xl font-black tracking-tight uppercase cursor-pointer select-none">
            <img src="/img/logo.png" alt="Logo" className="w-9 h-9 rounded-full object-cover border-2 border-white bg-zinc-900 shadow-md" />
            <span style={{ color: '#ffffff' }}>Tolibas Iron Works</span>
          </div>
          <nav className="flex gap-8 items-center">
            {['home', 'projects', 'about', 'contact'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className="bg-transparent border-none text-sm font-bold uppercase tracking-wider cursor-pointer pb-1 transition-all" style={{ color: activeTab === tab ? '#ffffff' : '#cccccc', borderBottom: activeTab === tab ? '2px solid #ffffff' : '2px solid transparent' }}>
                {tab === 'about' ? 'About Us' : tab}
              </button>
            ))}
            <button onClick={() => window.location.href = '/login'} className="text-zinc-600 hover:text-white text-xs font-mono uppercase bg-white/5 px-2 py-1 rounded border border-white/5 transition-colors">Log In</button>
          </nav>
        </div>
      </header>

      {activeTab === 'home' && (
        <div className="w-full flex-grow flex justify-center items-center m-0 p-0">
          <section className="w-full py-44 px-8 md:px-16 box-border text-center">
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight m-0 drop-shadow-[0_4px_16_rgba(0,0,0,0.85)]" style={{ color: '#ffffff', fontWeight: '900' }}>Custom Metalwork Built to Last a Lifetime.</h1>
              <p className="text-base md:text-xl leading-relaxed m-0 font-normal max-w-3xl text-center drop-shadow-md" style={{ color: '#ffffff', opacity: 0.95 }}>From secure security gates and window grills to heavy structural iron frameworks, Tolibas Iron Works delivers premium, durable fabrication in Zamboanga City.</p>
              <div className="flex gap-5 mt-8 justify-center">
                <button onClick={() => setActiveTab('contact')} className="bg-white hover:bg-zinc-200 text-black font-black px-10 py-4 rounded-sm text-sm tracking-wide uppercase transition-colors border-none cursor-pointer shadow-2xl">Contact us</button>
                <button onClick={() => setActiveTab('projects')} className="bg-transparent hover:bg-white/10 border-2 border-white font-black px-10 py-4 rounded-sm text-sm tracking-wide uppercase transition-colors cursor-pointer shadow-md">View Our Work</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'projects' && (
        <section className="w-full max-w-7xl mx-auto pt-10 pb-24 px-8 md:px-16 box-border flex-grow">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2 text-white">Our Work Portfolio</h2>
            <p className="text-sm font-light m-0 text-zinc-300">Browse through actual pictures of our finished project layouts and complete shop fabrications.</p>
          </div>
          <div className="w-full max-w-xl mx-auto mb-14 flex items-center gap-3">
            <div className="flex-grow relative">
              <input type="text" placeholder="Search portfolio work..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-3.5 pl-4 bg-zinc-900/90 border border-white/10 rounded-sm outline-none text-xs text-white placeholder-zinc-500 shadow-xl" />
            </div>
            <div className="relative">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-3.5 bg-zinc-900/90 text-white text-xs font-bold uppercase tracking-wider rounded-sm border border-white/10 outline-none cursor-pointer appearance-none pr-10 pl-4 shadow-xl" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23ffffff\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundSize: '16px', backgroundPosition: 'calc(100% - 12px) center', backgroundRepeat: 'no-repeat' }}>
                <option value="all">All Types</option>
                <option value="gates">Gates</option>
                <option value="staircases">Staircases / Railings</option>
                <option value="windows">Windows</option>
                <option value="structural">Structural</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <article key={item.id} onClick={() => setSelectedProject(item)} className="bg-black/30 backdrop-blur-sm shadow-2xl rounded-sm border border-white/10 overflow-hidden flex flex-col group cursor-pointer hover:border-white/30 transition-all duration-300">
                <div className="w-full h-64 overflow-hidden bg-zinc-900 relative border-b border-white/10">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95" />
                  <div className="absolute top-3 left-3 bg-white text-black font-black text-[10px] tracking-wider uppercase py-1 px-3 rounded-sm shadow-md">
                    {item.category || 'Fabrication'}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-white">{item.title}</h3>
                    <p className="text-xs leading-relaxed m-0 text-zinc-400 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <span>Registry Archive</span>
                    <span className="text-emerald-400 font-black">✓ Complete Build</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'about' && (
        <section className="w-full max-w-4xl mx-auto py-24 px-8 md:px-16 box-border flex-grow flex flex-col justify-center">
          <div className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-sm p-8 md:p-12 shadow-2xl flex flex-col gap-8">
            <div className="border-b border-white/10 pb-6 text-center">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-3">Tolibas Iron Works</h2>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex flex-col gap-1.5 justify-center items-center">
                <span>Purok 1, Abahada, Sinunuc, Zamboanga City, Philippines</span>
                <span className="text-zinc-300 font-black tracking-normal text-sm">0906 174 7230</span>
              </div>
            </div>
            <div className="space-y-5 text-sm leading-relaxed text-zinc-300 font-normal">
              <p>Based natively in Zamboanga City, Tolibas Iron Works is a dedicated professional fabrication hub. We specialize in turning raw iron and premium steel configurations into robust, custom high-security structures designed to shield residential spaces and support industrial frameworks.</p>
            </div>
            {/* Icons Grid Added Here */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-white/10 pt-8 text-center">
              <div className="flex flex-col items-center gap-3 text-white"><Hammer className="w-8 h-8 opacity-80" /><span className="text-[10px] uppercase font-black tracking-widest">Custom Builds</span></div>
              <div className="flex flex-col items-center gap-3 text-white"><Ruler className="w-8 h-8 opacity-80" /><span className="text-[10px] uppercase font-black tracking-widest">Precise Cuts</span></div>
              <div className="flex flex-col items-center gap-3 text-white"><Zap className="w-8 h-8 opacity-80" /><span className="text-[10px] uppercase font-black tracking-widest">Clean Welds</span></div>
              <div className="flex flex-col items-center gap-3 text-white"><ShieldCheck className="w-8 h-8 opacity-80" /><span className="text-[10px] uppercase font-black tracking-widest">Durable Steel</span></div>
            </div>
            <div className="mt-4 pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-4 text-center">
              <h3 className="text-2xl font-black tracking-tight text-white m-0 uppercase">Follow Us On:</h3>
              <a href="https://www.facebook.com/tolibasironworks" target="_blank" rel="noopener noreferrer" className="cursor-pointer text-blue-500 bg-white rounded-full p-0.5 border-none shadow-xl"><svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg></a>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'contact' && (
        <section className="w-full max-w-7xl mx-auto py-24 px-8 md:px-16 grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr] gap-12 lg:gap-20 flex-grow items-center box-border">
          <div className="flex flex-col gap-6 text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-3">Ready to start your project?</h2>
              <p className="text-sm leading-relaxed text-zinc-400 max-w-md m-0">Let’s build something strong together. Reach out directly to our workshop floor or submit your design specifications via our digital counter.</p>
            </div>
            <div className="flex flex-col gap-5 mt-4 border-t border-white/10 pt-6">
              <div className="flex items-start gap-4">
                <span className="text-xl p-2 bg-white/5 rounded-sm border border-white/10">📞</span>
                <div className="flex flex-col"><span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Phone Directory</span><span className="text-sm font-bold text-white mt-0.5">+63 906 174 7230</span></div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-xl p-2 bg-white/5 rounded-sm border border-white/10">📍</span>
                <div className="flex flex-col max-w-xs md:max-w-sm"><span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Workshop Address</span><span className="text-sm font-bold text-white leading-relaxed mt-0.5">Abahada, Sinunuc, Purok 1, Zamboanga City, Philippines</span></div>
              </div>
            </div>
          </div>
          <form onSubmit={handleInquirySubmit} className="bg-black/50 backdrop-blur-md p-8 md:p-10 shadow-2xl border border-white/10 rounded-sm flex flex-col gap-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black tracking-wider uppercase text-zinc-400">Your Name</label>
                <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-3.5 bg-zinc-950/80 border border-white/10 rounded-sm text-xs text-white focus:border-white outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black tracking-wider uppercase text-zinc-400">Contact Email / Number</label>
                <input type="text" placeholder="Email or Phone Number" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="p-3.5 bg-zinc-950/80 border border-white/10 rounded-sm text-xs text-white focus:border-white outline-none" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black tracking-wider uppercase text-zinc-400">Describe Your Specifications</label>
              <textarea placeholder="Provide sizing metrics, iron type preferences, or design requirements..." required value={formData.specs} onChange={(e) => setFormData({...formData, specs: e.target.value})} className="p-4 bg-zinc-950/80 border border-white/10 rounded-sm text-xs text-white h-40 resize-none focus:border-white outline-none"></textarea>
            </div>
            <button type="submit" disabled={formSubmitting} className="w-full bg-white text-black font-black py-4 tracking-widest uppercase cursor-pointer text-xs rounded-sm shadow-xl hover:bg-zinc-200 transition-all">
              {formSubmitting ? 'PROCESSING EXPORT...' : 'SUBMIT PROJECT REQUEST'}
            </button>
          </form>
        </section>
      )}

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setSelectedProject(null)}>
          <div className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-sm shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="w-full h-64 md:h-full bg-zinc-900 relative border-b md:border-b-0 md:border-r border-white/10">
              <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-black uppercase text-white">{selectedProject.title}</h3>
                  <button onClick={() => setSelectedProject(null)} className="bg-transparent border-none text-zinc-500 hover:text-white text-xl cursor-pointer">✕</button>
                </div>
                <p className="text-sm leading-relaxed text-zinc-300">{selectedProject.description}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                <div className="flex justify-between"><span>Category Build:</span> <span className="text-zinc-300">{selectedProject.category}</span></div>
                <button onClick={() => { setSelectedProject(null); setActiveTab('contact'); }} className="w-full mt-4 bg-white text-black py-3 font-black text-xs uppercase cursor-pointer rounded-sm">Inquire About Similar Build</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full bg-black/60 text-xs py-8 px-8 border-t border-white/10 text-center tracking-wider mt-auto box-border" style={{ color: '#9ca3af' }}>
        <div>© {new Date().getFullYear()} TOLIBAS IRON WORKS. ALL RIGHTS RESERVED.</div>
      </footer>
    </div>
  );
}