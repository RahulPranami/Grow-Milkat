
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Clock, User, Share2, 
  ChevronRight, Twitter, Linkedin, Facebook, 
  Link as LinkIcon, Instagram, MessageCircle,
  FileText, Play, ExternalLink
} from 'lucide-react';
import { BlogPost, View } from '../types';

interface BlogDetailPageProps {
  post: BlogPost;
  onBack: () => void;
  onNavigate: (view: View, data?: any) => void;
  t: (key: string) => string;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ post, onBack, onNavigate, t }) => {
  const shareUrl = window.location.href;
  const shareTitle = post.title;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL for web, usually users share via mobile app
        alert('To share on Instagram, please use the mobile app or copy the link.');
        return;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        return;
    }
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-12 font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Insights
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {post.category}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 serif leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-8 py-8 border-y border-slate-100">
            <div className="flex items-center gap-4">
              <img 
                src={post.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`} 
                alt={post.author}
                className="w-14 h-14 rounded-full border-2 border-primary/20 shadow-lg"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-bold text-slate-900 text-lg">{post.author}</p>
                <p className="text-sm text-slate-500 font-medium">{post.authorRole}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleShare('twitter')}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-all"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleShare('linkedin')}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#0077B5] hover:text-white transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleShare('instagram')}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#E4405F] hover:text-white transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#25D366] hover:text-white transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="w-px h-8 bg-slate-100 mx-2"></div>
              <button 
                onClick={() => handleShare('copy')}
                className="flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest"
              >
                <LinkIcon className="w-4 h-4" /> Copy Link
              </button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Featured Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="aspect-[1536/864] w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white"
        >
          <img 
            src={post.featuredImageUrl || post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg prose-slate max-w-none">
          <p className="text-2xl text-slate-600 font-medium leading-relaxed mb-12 italic border-l-4 border-primary pl-8 py-2">
            {post.excerpt}
          </p>
          
          <div className="text-slate-700 leading-relaxed space-y-12 text-lg">
            {post.blocks && post.blocks.length > 0 ? (
              post.blocks.map((block) => (
                <div key={block.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {block.type === 'h1' && <h1 className="text-4xl font-bold text-slate-900 serif mt-12 mb-6">{block.content}</h1>}
                  {block.type === 'h2' && <h2 className="text-3xl font-bold text-slate-900 serif mt-12 mb-6">{block.content}</h2>}
                  {block.type === 'h3' && <h3 className="text-2xl font-bold text-slate-900 serif mt-10 mb-4">{block.content}</h3>}
                  {block.type === 'h4' && <h4 className="text-xl font-bold text-slate-900 serif mt-8 mb-4">{block.content}</h4>}
                  {block.type === 'h5' && <h5 className="text-lg font-bold text-slate-900 serif mt-6 mb-3">{block.content}</h5>}
                  {block.type === 'h6' && <h6 className="text-base font-bold text-slate-900 serif mt-4 mb-2">{block.content}</h6>}
                  {block.type === 'paragraph' && <p className="leading-relaxed text-slate-700 whitespace-pre-wrap">{block.content}</p>}
                  {block.type === 'bullets' && (
                    <ul className="list-disc list-inside space-y-4 text-slate-700 leading-relaxed">
                      {block.items?.map((item, i) => (
                        <li key={i} className="pl-2">{item}</li>
                      ))}
                    </ul>
                  )}
                  {block.type === 'numbers' && (
                    <ol className="list-decimal list-inside space-y-4 text-slate-700 leading-relaxed">
                      {block.items?.map((item, i) => (
                        <li key={i} className="pl-2">{item}</li>
                      ))}
                    </ol>
                  )}
                  {block.type === 'image' && (
                    <figure className="my-12">
                      <img src={block.content} alt="" className="w-full rounded-[2rem] shadow-2xl" referrerPolicy="no-referrer" />
                    </figure>
                  )}
                  {block.type === 'video' && (
                    <div className="my-12 aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-slate-100 flex items-center justify-center group relative">
                      {block.content.includes('youtube.com') || block.content.includes('youtu.be') ? (
                        <iframe 
                          src={block.content.replace('watch?v=', 'embed/')} 
                          className="w-full h-full"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video src={block.content} controls className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                  {block.type === 'pdf' && (
                    <div className="my-12 p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 border-dashed flex flex-col items-center text-center group hover:bg-slate-100 transition-colors">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">Resource Document</h4>
                      <p className="text-sm text-slate-400 mb-6 font-medium">Download the PDF version of this article or related resources.</p>
                      <a 
                        href={block.content} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors shadow-xl"
                      >
                        View PDF <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                <p>
                  In the rapidly evolving landscape of 2026, the traditional barriers to high-value asset ownership are dissolving. What was once the exclusive playground of institutional giants and ultra-high-net-worth individuals is now accessible to a broader spectrum of investors through the power of fractionalization.
                </p>
                
                <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6 serif">The Convergence of Technology and Trust</h2>
                <p>
                  The core of this transformation lies in the seamless integration of blockchain technology for transparent ledger management and robust legal structures like Special Purpose Vehicles (SPVs). This combination ensures that every fraction of an asset is not just a digital entry, but a legally protected ownership stake.
                </p>
                
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" 
                  alt="Data Analysis" 
                  className="w-full rounded-3xl my-12 shadow-xl"
                  referrerPolicy="no-referrer"
                />
                
                <p>
                  At Grow Milkat, our G.R.O.W. framework (Governance, Risk, Operations, Wealth Projection) serves as the bedrock of our selection process. We don't just look for high yields; we look for sustainable, institutional-grade assets that can weather market volatility.
                </p>
                
                <blockquote className="bg-slate-50 p-10 rounded-3xl border-l-8 border-primary my-12">
                  <p className="text-2xl font-bold text-slate-900 italic mb-4">
                    "Fractional ownership isn't just about lower entry points; it's about superior risk management through diversification."
                  </p>
                  <cite className="text-slate-500 font-bold uppercase tracking-widest text-sm">— Vikram Sethi, CIO</cite>
                </blockquote>
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-20 pt-12 border-t border-slate-100 flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-wrap gap-3">
            {post.tags.map(tag => (
              <span key={tag} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-slate-900 serif">Related Intelligence</h2>
          <button 
            onClick={() => onNavigate('blog')}
            className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest hover:underline"
          >
            View All Insights <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Mock related posts - in a real app these would be filtered by tag/category */}
          {[1, 2, 3].map(i => (
            <div key={i} className="group cursor-pointer" onClick={() => onNavigate('blog')}>
              <div className="h-48 rounded-3xl overflow-hidden mb-6 relative">
                <img 
                  src={`https://picsum.photos/seed/blog${i}/800/600`} 
                  alt="Related Post" 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                The Future of Digital Asset Custody in 2026
              </h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">March 12, 2026 • 5 min read</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;
