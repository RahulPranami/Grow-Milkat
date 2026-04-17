
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Calendar, Clock, User, ArrowRight, 
  ChevronRight, Tag, Filter, TrendingUp, MessageSquare
} from 'lucide-react';
import { BlogPost, View } from '../types';

interface BlogPageProps {
  onNavigate: (view: View, data?: any) => void;
  t: (key: string) => string;
  blogs: BlogPost[];
}

const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Rise of Fractional Real Estate in 2026',
    excerpt: 'How blockchain and SPVs are democratizing high-value asset ownership for the next generation of investors.',
    content: 'Full content here...',
    author: 'Vikram Sethi',
    authorRole: 'Chief Investment Officer',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
    date: 'March 28, 2026',
    category: 'Market Trends',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000',
    readTime: '6 min read',
    tags: ['Real Estate', 'Fractional Ownership', 'Wealth Tech']
  },
  {
    id: '2',
    title: 'Understanding the G.R.O.W. Framework',
    excerpt: 'A deep dive into our proprietary vetting protocol that ensures institutional-grade security for your capital.',
    content: 'Full content here...',
    author: 'Elena Rodriguez',
    authorRole: 'Head of Risk Management',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
    date: 'March 24, 2026',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
    readTime: '8 min read',
    tags: ['Risk Management', 'Governance', 'Investment Strategy']
  },
  {
    id: '3',
    title: 'Why Hospitality Assets are Outperforming in Q1',
    excerpt: 'Analyzing the surge in luxury hotel yields across Europe and the Middle East.',
    content: 'Full content here...',
    author: 'Marcus Thorne',
    authorRole: 'Hospitality Specialist',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    date: 'March 20, 2026',
    category: 'Assets Analysis',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
    readTime: '5 min read',
    tags: ['Hotels', 'Hospitality', 'Yield Analysis']
  },
  {
    id: '4',
    title: 'Diversification: Beyond Stocks and Bonds',
    excerpt: 'Why alternative assets like land and startups are essential for a resilient 2026 portfolio.',
    content: 'Full content here...',
    author: 'Sarah Jenkins',
    authorRole: 'Portfolio Strategist',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    date: 'March 15, 2026',
    category: 'Wealth Management',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    readTime: '7 min read',
    tags: ['Diversification', 'Alternative Assets', 'Portfolio Growth']
  }
];

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, t, blogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Market Trends', 'Education', 'Assets Analysis', 'Wealth Management'];

  const filteredPosts = (blogs || MOCK_BLOG_POSTS).filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 serif tracking-tight">
                Insights & <span className="text-primary">Intelligence</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Expert analysis, market trends, and educational resources to help you navigate the world of fractional investing.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-y border-slate-200 py-4 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onNavigate('blog-detail', post)}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.authorAvatar} 
                        alt={post.author}
                        className="w-8 h-8 rounded-full border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{post.author}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{post.authorRole}</p>
                      </div>
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No articles found</h3>
            <p className="text-slate-500">Try adjusting your search or category filters.</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
              className="mt-8 text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[100px]"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6 serif leading-tight">
                Stay Ahead of the <br /> <span className="text-primary">Market Curve</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Join 5,000+ investors receiving our weekly intelligence report on fractional assets and alternative markets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="flex-grow px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-all"
                />
                <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition shadow-xl shadow-primary/20">
                  Subscribe Now
                </button>
              </div>
              <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                No spam. Only high-signal intelligence.
              </p>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-6">
              {[
                { icon: <TrendingUp />, label: "Market Reports" },
                { icon: <MessageSquare />, label: "Expert Q&A" },
                { icon: <Tag />, label: "Early Access" },
                { icon: <Filter />, label: "Curated Deals" }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-4">
                    {item.icon}
                  </div>
                  <p className="text-white font-bold text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
