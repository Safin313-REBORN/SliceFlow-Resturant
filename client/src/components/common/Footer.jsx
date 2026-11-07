import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Phone,
  Mail,
  MapPin,
  Heart,
  ShieldCheck,
  Check,
  Send,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Clock,
  Sparkles,
} from 'lucide-react';
import Button from './Button';

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3500);
    }
  };

  return (
    <footer className="relative bg-gradient-forest text-[#FAF6EF] pt-16 pb-12 border-t border-[#1C2E25] font-sans overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-honey/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Pill Row */}
        <div className="mb-12 pb-8 border-b border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-honey shrink-0 shadow-sm">
              <Flame className="w-5 h-5 fill-honey" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">450°C Stone Hearth</p>
              <p className="text-[11px] text-white/70">Blistered Neapolitan Crust</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-honey shrink-0 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">30-Min Fast Track</p>
              <p className="text-[11px] text-white/70">Doorstep Hot Thermal Bags</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-honey shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Razorpay Verified</p>
              <p className="text-[11px] text-white/70">HMAC-SHA256 Signatures</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-honey shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Live Kitchen Updates</p>
              <p className="text-[11px] text-white/70">Real-Time Socket.IO Feed</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-ember flex items-center justify-center text-white shadow-glow">
                <Flame className="w-6 h-6 stroke-[2.2] fill-honey text-honey" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Slice<span className="text-primary">Flow</span>
              </span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-sans">
              Good Food. Great Moments. Made Fresh. From 450°C stone-baked sourdough pizzas to double-smashed Angus burgers, rich handmade pasta, and decadent desserts.
            </p>
            <div className="flex items-center gap-2 text-xs text-honey font-bold font-sans">
              <ShieldCheck className="w-4 h-4 text-honey" />
              <span>Oasis Infobyte Internship: Web Dev Level 3, Task 1</span>
            </div>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href="#social-instagram"
                aria-label="Instagram"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-honey hover:text-forest flex items-center justify-center text-white transition-all duration-200 active:scale-95"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#social-twitter"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-honey hover:text-forest flex items-center justify-center text-white transition-all duration-200 active:scale-95"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#social-facebook"
                aria-label="Facebook"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-honey hover:text-forest flex items-center justify-center text-white transition-all duration-200 active:scale-95"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#social-youtube"
                aria-label="YouTube"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-honey hover:text-forest flex items-center justify-center text-white transition-all duration-200 active:scale-95"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Culinary Categories */}
          <div>
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-honey mb-4">
              Explore Our Kitchen
            </h3>
            <ul className="space-y-2.5 text-xs text-white/80 font-sans">
              <li>
                <Link to="/menu?category=Pizza" className="hover:text-honey hover:translate-x-1 inline-block transition-all">
                  Signature Stone-Baked Pizzas
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Burgers" className="hover:text-honey hover:translate-x-1 inline-block transition-all">
                  Gourmet Smash Burgers
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Pasta" className="hover:text-honey hover:translate-x-1 inline-block transition-all">
                  Handcrafted Italian Pasta
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Sides" className="hover:text-honey hover:translate-x-1 inline-block transition-all">
                  Sides, Wings & Loaded Fries
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Desserts" className="hover:text-honey hover:translate-x-1 inline-block transition-all">
                  Artisanal Sweets & Lava Cakes
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Drinks" className="hover:text-honey hover:translate-x-1 inline-block transition-all">
                  Craft Coolers & Cold Colas
                </Link>
              </li>
              <li>
                <Link to="/build" className="text-honey font-bold hover:underline transition-all inline-flex items-center gap-1">
                  <span>★ Custom Pizza Builder (4-Step)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours & Kitchen Status */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-honey">
                Kitchen Open Now
              </h3>
            </div>
            <div className="space-y-2.5 text-xs text-white/80 font-sans">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Mon to Thu:</span>
                <span className="font-bold text-white">11:00 AM to 11:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Fri to Sat:</span>
                <span className="font-bold text-white">11:00 AM to 01:00 AM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Sunday:</span>
                <span className="font-bold text-white">12:00 PM to 11:30 PM</span>
              </div>
              <div className="mt-3 p-3.5 rounded-2xl bg-white/10 border border-white/10 text-[11px] text-white/90">
                <span className="text-honey font-bold">⚡ Fast Delivery:</span> 30-min doorstep hot bag promise across the metro area.
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter & Location */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-honey">
              Secret Menu & Offers
            </h3>
            <p className="text-xs text-white/80 font-sans">
              Subscribe to get secret weekend specials and exclusive discount codes directly in your inbox.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-honey font-sans transition-colors"
              />
              <Button
                type="submit"
                variant="gradient"
                size="sm"
                className="shrink-0"
              >
                {subscribed ? <Check className="w-4 h-4 stroke-[3]" /> : <Send className="w-3.5 h-3.5" />}
              </Button>
            </form>
            {subscribed && (
              <p className="text-[11px] text-honey font-bold animate-fade-in">
                ✓ Welcome to the SliceFlow Circle! Check your inbox soon.
              </p>
            )}

            <div className="pt-2 text-xs text-white/80 space-y-1.5 font-sans">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>42 Artisan Lane, Koramangala, Bengaluru</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>+91 (80) 4123-SLICE</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/70 gap-4 font-sans">
          <p>© {new Date().getFullYear()} SliceFlow Restaurant Group. Oasis Infobyte Internship Program.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="hover:text-honey font-semibold transition-colors">
              Staff & Kitchen Portal
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-primary fill-current" /> for food lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
