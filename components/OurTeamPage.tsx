
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Twitter, Instagram, ArrowRight } from 'lucide-react';
import { TeamMember } from '../types';

interface OurTeamPageProps {
  t: (key: string) => string;
  teamMembers: TeamMember[];
}

const OurTeamPage: React.FC<OurTeamPageProps> = ({ t, teamMembers }) => {
  const categories = [
    { id: 'leadership', label: t('leadership') },
    { id: 'advisory', label: t('advisoryBoard') },
    { id: 'operations', label: t('operations') }
  ];

  return (
    <div className="bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
              {t('ourTeam')}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 serif tracking-tight">
              {t('teamSubtitle')}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t('teamDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {categories.map((cat) => (
          <section key={cat.id} className="mb-24 last:mb-0">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-bold text-slate-900 serif">{cat.label}</h2>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {teamMembers.filter(m => m.category === cat.id).map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="relative mb-6 overflow-hidden rounded-[2rem] aspect-square">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                      <div className="flex gap-4">
                        {member.socials.linkedin && <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 transition"><Linkedin className="w-5 h-5" /></a>}
                        {member.socials.x && <a href={member.socials.x} target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 transition"><Twitter className="w-5 h-5" /></a>}
                        {member.socials.instagram && <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 transition"><Instagram className="w-5 h-5" /></a>}
                        {member.socials.mail && <a href={`mailto:${member.socials.mail}`} className="text-white hover:text-emerald-400 transition"><Mail className="w-5 h-5" /></a>}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-emerald-600 font-black uppercase text-[10px] tracking-widest mb-4">{member.role}</p>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Careers CTA */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 serif mb-6">{t('joinOurTeam')}</h2>
              <p className="text-slate-600 leading-relaxed">
                {t('careersDesc')}
              </p>
            </div>
            <button className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 group">
              {t('viewOpenings')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurTeamPage;
