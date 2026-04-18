
import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Globe, 
  Clock, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Facebook, 
  HelpCircle, 
  Users, 
  Briefcase, 
  Send,
  ArrowRight,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import * as emailService from '../services/emailService';

interface ContactPageProps {
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
}

const ContactPage: React.FC<ContactPageProps> = ({ formatCurrency, t }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    inquiryType: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const result = await emailService.sendEmail('SUPPORT', {
        subject: formData.inquiryType,
        category: formData.inquiryType,
        message: formData.message,
        userEmail: formData.email,
        userName: `${formData.firstName} ${formData.lastName}`
      });

      if (result.success) {
        setStatus({ type: 'success', msg: 'Message sent successfully!' });
        setFormData({ firstName: '', lastName: '', email: '', inquiryType: 'General Inquiry', message: '' });
      } else {
        setStatus({ type: 'error', msg: result.message || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Hero Section */}
      <section className="bg-emerald-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 serif">Connect with Grow Milkat</h1>
            <p className="text-emerald-100 text-lg sm:text-xl max-w-2xl mx-auto">
              Our investment specialists are available around the clock to assist with your wealth creation journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Contact Grid */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
            {/* Form */}
            <div className="lg:w-1/2 p-8 sm:p-12 lg:p-20 border-b lg:border-b-0 lg:border-r border-slate-100">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Send a Message</h2>
                <p className="text-slate-500">Private investors and institutions can reach out directly via the form below.</p>
              </div>
              
              {status && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {status.msg}
                </div>
              )}
              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John" 
                      className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-emerald-500 transition" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Doe" 
                      className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-emerald-500 transition" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com" 
                    className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-emerald-500 transition" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Inquiry Type</label>
                  <select 
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-emerald-500 transition appearance-none"
                  >
                    <option>General Inquiry</option>
                    <option>Investment Support</option>
                    <option>KYC Verification</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?" 
                    className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-emerald-500 transition h-32 resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold hover:bg-emerald-700 transition shadow-xl shadow-emerald-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {!isSubmitting && <Send className="w-5 h-5" />}
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="lg:w-1/2 bg-slate-50/50 p-8 sm:p-12 lg:p-20 flex flex-col justify-between">
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Global Headquarters</h3>
                    <p className="text-slate-500 leading-relaxed">
                      One Financial District, Suite 400<br />
                      Austin, TX 78701, USA
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Direct Contact</h3>
                    <p className="text-slate-500 mb-1">support@growmilkat.com</p>
                    <p className="text-slate-500">investors@growmilkat.com</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Office Hours</h3>
                    <p className="text-slate-500 mb-1">Mon - Fri: 9:00 AM - 6:00 PM EST</p>
                    <p className="text-slate-500">Online Support: 24/7</p>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Follow Us</h4>
                <div className="flex gap-4">
                  {[Linkedin, Twitter, Instagram, Facebook].map((Icon, i) => (
                    <button key={i} className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all">
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Global Support Locations */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 serif">Global Support Presence</h2>
            <p className="text-slate-500">Our team operates across key financial hubs to ensure local compliance and support.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { city: 'London', region: 'Europe', phone: '+44 20 7946 0123' },
              { city: 'Singapore', region: 'Asia-Pacific', phone: '+65 6789 0123' },
              { city: 'Dubai', region: 'Middle East', phone: '+971 4 123 4567' }
            ].map((loc, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-emerald-50 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{loc.city}</h3>
                  <Globe className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">{loc.region}</p>
                <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-900 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="font-medium">{loc.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Newsletter CTA */}
      <section className="pb-24 pt-12">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 serif tracking-tight">Stay Ahead with Institutional Insights</h2>
              <p className="text-slate-400 mb-10 text-lg">
                Subscribe to our private list for early access to new hospitality and technology opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Your institutional email" 
                  className="flex-grow px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 transition text-lg"
                />
                <button className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-2xl shadow-emerald-500/20 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
            <p className="mt-6 text-slate-500 text-sm">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
