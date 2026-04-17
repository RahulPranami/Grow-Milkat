
import React from 'react';
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

interface ContactPageProps {
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
}

const ContactPage: React.FC<ContactPageProps> = ({ formatCurrency, t }) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Hero Section */}
      <section className="bg-emerald-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold serif mb-6">Connect with Grow Milkat</h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto">
            We're here to help you navigate your investment journey. Reach out to our team of experts for personalized guidance.
          </p>
        </div>
      </section>

      {/* 2. Quick Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { icon: <Mail className="w-6 h-6 sm:w-8 sm:h-8" />, label: "Email Us", val: "support@growmilkat.com", desc: "Response within 24 hours" },
            { icon: <Phone className="w-6 h-6 sm:w-8 sm:h-8" />, label: "Call Us", val: "+1 (555) 000-MILKAT", desc: "Mon-Fri, 9am - 6pm GMT" },
            { icon: <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />, label: "Visit Us", val: "Financial District, London", desc: "Headquarters & Client Center" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 transition-transform hover:-translate-y-1">
              <div className="bg-emerald-50 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-emerald-600 mb-4 sm:mb-6">
                {item.icon}
              </div>
              <h3 className="text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{item.label}</h3>
              <p className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{item.val}</p>
              <p className="text-slate-500 text-xs sm:text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Main Message Form */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col lg:flex-row border border-slate-100">
          <div className="lg:w-1/2 p-8 sm:p-12 lg:p-20 bg-slate-900 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold serif mb-6 sm:mb-8">Send us a message</h2>
            <p className="text-slate-400 mb-8 sm:mb-12 text-base sm:text-lg">
              Have a specific inquiry? Fill out the form and our specialized department will get back to you shortly.
            </p>
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-slate-300 text-sm sm:text-base">Direct access to investment advisors</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-slate-300 text-sm sm:text-base">Secure and encrypted communication</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-slate-300 text-sm sm:text-base">Priority support for verified members</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 p-8 sm:p-12 lg:p-20">
            <form className="space-y-4 sm:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">First Name</label>
                  <input type="text" placeholder="John" className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-emerald-500 transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-emerald-500 transition" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-emerald-500 transition" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Inquiry Type</label>
                <select className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-emerald-500 transition appearance-none">
                  <option>General Inquiry</option>
                  <option>Investment Support</option>
                  <option>KYC Verification</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Message</label>
                <textarea placeholder="How can we help you?" className="w-full px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-emerald-500 transition h-32 resize-none"></textarea>
              </div>
              <button className="w-full bg-emerald-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold hover:bg-emerald-700 transition shadow-xl shadow-emerald-200 flex items-center justify-center space-x-2">
                <span>Send Message</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 4. Global Presence */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold serif mb-4">Global Presence</h2>
            <p className="text-slate-500 text-sm sm:text-base">Visit our physical offices around the world.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {[
              { city: "London", address: "123 Financial District, EC2V 7WT", phone: "+44 20 7946 0000", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800" },
              { city: "New York", address: "45 Wall Street, NY 10005", phone: "+1 212 555 0123", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800" },
              { city: "Singapore", address: "8 Marina View, Asia Square Tower 1", phone: "+65 6789 0123", image: "https://images.unsplash.com/photo-1525625232717-121ad31862e1?auto=format&fit=crop&q=80&w=800" },
            ].map((office, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative h-64 rounded-3xl overflow-hidden mb-6">
                  <img src={office.image} alt={office.city} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white">{office.city}</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center text-slate-600"><MapPin className="w-4 h-4 mr-2 text-emerald-600" /> {office.address}</p>
                  <p className="flex items-center text-slate-600"><Phone className="w-4 h-4 mr-2 text-emerald-600" /> {office.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Department Directory */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-emerald-50 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-20 border border-emerald-100">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold serif mb-4 sm:mb-6 text-emerald-900">Direct Department Access</h2>
                <p className="text-emerald-800/70 mb-6 sm:mb-8 text-sm sm:text-base">Skip the queue by contacting the right department directly for your specific needs.</p>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    { dept: "Investor Relations", email: "investors@growmilkat.com" },
                    { dept: "Media & Press", email: "press@growmilkat.com" },
                    { dept: "Partnerships", email: "partners@growmilkat.com" },
                    { dept: "Career Opportunities", email: "careers@growmilkat.com" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl sm:rounded-2xl border border-emerald-100 shadow-sm gap-2">
                      <span className="font-bold text-emerald-900 text-sm sm:text-base">{item.dept}</span>
                      <a href={`mailto:${item.email}`} className="text-emerald-600 font-medium hover:underline text-sm sm:text-base break-all">{item.email}</a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative mt-8 lg:mt-0">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Team" className="rounded-2xl sm:rounded-3xl shadow-2xl" />
                <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-emerald-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">Support Team Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Live Support */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-6 sm:mb-8">
            <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Instant Assistance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold serif mb-4 sm:mb-6">Need immediate help?</h2>
          <p className="text-slate-500 mb-8 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-base">
            Our live chat support is available 24/7 for verified investors. Start a conversation now to get instant answers.
          </p>
          <button 
            onClick={() => {
              if (window.Tawk_API) {
                window.Tawk_API.maximize();
              }
            }}
            className="bg-slate-900 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl flex items-center mx-auto space-x-3 text-sm sm:text-base"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Start Live Chat</span>
          </button>
        </div>
      </section>

      {/* 7. Help Center Preview */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold serif mb-6">Explore our Help Center</h2>
              <p className="text-slate-400 mb-8 text-lg">
                Find answers to common questions about investment types, tax benefits, and platform security in our comprehensive knowledge base.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {["Investment Guide", "Tax Documentation", "Security Protocols", "Payout Schedule"].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/10">
                    <HelpCircle className="w-5 h-5 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button className="text-emerald-400 font-bold flex items-center hover:text-emerald-300 transition">
                Visit Help Center <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            <div className="bg-emerald-600 rounded-[2.5rem] p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-6 text-emerald-100" />
              <h3 className="text-2xl font-bold mb-4">Join the Community</h3>
              <p className="text-emerald-100 mb-8">Connect with over 50,000+ investors in our private forum.</p>
              <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition">
                Join Forum
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Social Connectivity */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold serif mb-12">Follow our journey</h2>
          <div className="flex justify-center space-x-6">
            {[
              { icon: <Twitter />, label: "Twitter", color: "hover:text-sky-500" },
              { icon: <Linkedin />, label: "LinkedIn", color: "hover:text-blue-700" },
              { icon: <Instagram />, label: "Instagram", color: "hover:text-pink-600" },
              { icon: <Facebook />, label: "Facebook", color: "hover:text-blue-600" },
            ].map((social, idx) => (
              <a key={idx} href="#" className={`w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 transition-all ${social.color} hover:bg-white hover:shadow-lg border border-slate-100`}>
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Partnership Inquiries */}
      <section className="py-24 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-[3rem] p-12 lg:p-20 shadow-xl shadow-emerald-100/50 border border-emerald-100 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/3">
              <div className="bg-emerald-600 w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-emerald-200">
                <Briefcase className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold serif mb-4">Partner with us</h2>
              <p className="text-slate-500">Are you a property developer or startup founder looking for funding?</p>
            </div>
            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition">
                <h3 className="font-bold text-xl mb-3">Real Estate Developers</h3>
                <p className="text-slate-500 text-sm mb-6">List your premium properties and reach global institutional investors.</p>
                <button className="text-emerald-600 font-bold flex items-center text-sm">Apply as Partner <ArrowRight className="ml-2 w-4 h-4" /></button>
              </div>
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition">
                <h3 className="font-bold text-xl mb-3">Startup Founders</h3>
                <p className="text-slate-500 text-sm mb-6">Pitch your revolutionary tech and secure seed or series A funding.</p>
                <button className="text-emerald-600 font-bold flex items-center text-sm">Submit Pitch Deck <ArrowRight className="ml-2 w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Newsletter Signup */}
      <section className="py-24 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/10 skew-x-12 translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold serif text-white mb-6">Stay ahead of the market</h2>
            <p className="text-slate-400 mb-10 text-lg">
              Get exclusive investment opportunities and market insights delivered to your inbox every Monday.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 transition"
              />
              <button className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-xl shadow-emerald-900/20">
                Subscribe Now
              </button>
            </form>
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

