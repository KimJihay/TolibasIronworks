import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Hammer, Ruler, Zap, ShieldCheck } from 'lucide-react';

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  return (
    <div className="min-h-screen w-full flex flex-col font-sans antialiased text-white">
      {/* HEADER */}
      <header className="w-full bg-black/40 z-20 sticky top-0 border-b border-white/10 backdrop-blur-md">
        <div className="flex flex-wrap justify-between items-center py-4 px-6 md:px-16 max-w-7xl mx-auto w-full gap-4">
          <div onClick={() => setActiveTab('home')} className="flex items-center gap-3 text-base md:text-xl font-black uppercase cursor-pointer">
            <img src="/img/logo.png" alt="Logo" className="w-8 h-8 rounded-full object-cover border border-white bg-zinc-900" />
            <span>Tolibas Iron Works</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-8 items-center">
            {['home', 'projects', 'about', 'contact'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className="bg-transparent border-none text-xs md:text-sm font-bold uppercase cursor-pointer transition-all" style={{ color: activeTab === tab ? '#ffffff' : '#cccccc', borderBottom: activeTab === tab ? '2px solid #ffffff' : '2px solid transparent' }}>
                {tab === 'about' ? 'About Us' : tab}
              </button>
            ))}
            <Link to="/login" className="text-zinc-600 hover:text-white text-[10px] md:text-xs font-mono uppercase bg-white/5 px-3 py-1 rounded border border-white/5 transition-colors">
              Log In
            </Link>
          </nav>
        </div>
      </header>

      {/* HOME SECTION */}
      {activeTab === 'home' && (
        <section className="w-full py-24 md:py-44 px-6 text-center flex-grow flex justify-center items-center">
          <div className="max-w-4xl flex flex-col items-center gap-6">
            <h1 className="text-4xl md:text-7xl font-black tracking-tight uppercase">Custom Metalwork Built to Last a Lifetime.</h1>
            <p className="text-sm md:text-xl text-zinc-300 max-w-2xl px-4">From secure security gates and window grills to heavy structural iron frameworks, Tolibas Iron Works delivers premium, durable fabrication in Zamboanga City.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full px-4">
              <button onClick={() => setActiveTab('contact')} className="bg-white text-black font-black py-4 px-10 text-xs uppercase flex-1">Contact us</button>
              <button onClick={() => setActiveTab('projects')} className="bg-transparent border-2 border-white font-black py-4 px-10 text-xs uppercase flex-1">View Our Work</button>
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS SECTION */}
      {activeTab === 'projects' && (
        <section className="w-full max-w-7xl mx-auto pt-10 pb-24 px-6 md:px-16 flex-grow">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-2">Our Work Portfolio</h2>
            <p className="text-xs md:text-sm text-zinc-400">Actual shop fabrications and project site installations.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:w-64 p-3 bg-zinc-900 border border-white/10 text-xs" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-3 bg-zinc-900 text-xs uppercase font-bold border border-white/10">
              <option value="all">All Types</option>
              <option value="gates">Gates</option>
              <option value="staircases">Staircases / Railings</option>
              <option value="windows">Windows</option>
              <option value="structural">Structural</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <article key={item.id} className="bg-black/30 border border-white/10 p-6 flex flex-col">
                <img src={item.image_url} alt={item.title} className="w-full h-64 object-cover mb-4" />
                {/* Category Tag Added Below */}
                {item.category && (
                  <span className="self-start text-[9px] uppercase font-bold tracking-widest bg-white/10 text-zinc-300 px-2 py-1 mb-2 border border-white/10">
                    {item.category}
                  </span>
                )}
                <h3 className="text-lg font-black uppercase">{item.title}</h3>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT US SECTION */}
{activeTab === 'about' && (
  <section className="w-full max-w-4xl mx-auto py-24 px-6 flex-grow flex flex-col justify-center">
    <div className="bg-black/30 border border-white/10 p-8 md:p-12 shadow-2xl flex flex-col gap-6 text-center">
      <h2 className="text-3xl md:text-4xl font-black uppercase">Tolibas Iron Works</h2>
      
      {/* Removed "Professional Welding Hub" */}
      
      <div className="text-xs text-zinc-400 border-t border-b border-white/10 py-6">
        <p>📍 Purok 1, Abahada, Sinunuc, Zamboanga City</p>
        <p className="mt-2 text-sm text-zinc-200 font-bold">📞 0906 174 7230</p>
      </div>
      
      <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl mx-auto">
        Tolibas Iron Works is a fabrication hub dedicated to quality metalwork. We specialize in transforming raw iron and steel into secure, custom structures, including residential gates, window grills, balustrades, commercial trusses, and structural steel frames. 
        <br /><br />
        Our mission is to deliver premium, durable craftsmanship that prioritizes structural integrity, precise measurements, and clean, hand-welded connections to ensure long-lasting security for our clients across Zamboanga City.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
        <div className="flex flex-col items-center gap-2"><Hammer className="w-6 h-6"/><span className="text-[9px] uppercase font-black">Custom</span></div>
        <div className="flex flex-col items-center gap-2"><Ruler className="w-6 h-6"/><span className="text-[9px] uppercase font-black">Precise</span></div>
        <div className="flex flex-col items-center gap-2"><Zap className="w-6 h-6"/><span className="text-[9px] uppercase font-black">Welds</span></div>
        <div className="flex flex-col items-center gap-2"><ShieldCheck className="w-6 h-6"/><span className="text-[9px] uppercase font-black">Durable</span></div>
      </div>
    </div>
  </section>
)}

      {/* CONTACT SECTION */}
      {activeTab === 'contact' && (
        <section className="w-full max-w-7xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-grow">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">Start Your Project</h2>
            <p className="text-zinc-400 text-sm">Send us your specifications. We prioritize quality fabrication and timely delivery.</p>
          </div>
          <form onSubmit={handleInquirySubmit} className="bg-black/50 p-8 border border-white/10 flex flex-col gap-6">
            <input type="text" placeholder="Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-3 bg-zinc-950 border border-white/10 text-white text-xs" />
            <input type="text" placeholder="Contact" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="p-3 bg-zinc-950 border border-white/10 text-white text-xs" />
            <textarea placeholder="Requirements..." required value={formData.specs} onChange={(e) => setFormData({...formData, specs: e.target.value})} className="p-3 bg-zinc-950 border border-white/10 text-white text-xs h-32"></textarea>
            <button type="submit" disabled={formSubmitting} className="bg-white text-black font-black py-4 uppercase text-xs">
              {formSubmitting ? 'SENDING...' : 'SUBMIT REQUEST'}
            </button>
          </form>
        </section>
      )}

      <footer className="w-full text-center p-6 border-t border-white/10 mt-auto text-[10px] text-zinc-500 uppercase tracking-widest">
        © 2026 TOLIBAS IRON WORKS. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}