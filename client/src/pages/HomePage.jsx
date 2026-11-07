import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PizzaCard from '../components/pizza/PizzaCard';
import { PizzaCardSkeleton } from '../components/common/LoadingSkeleton';
import Button from '../components/common/Button';
import {
  Flame,
  Clock,
  ShieldCheck,
  ChefHat,
  Leaf,
  Star,
  Truck,
  Sparkles,
  Wheat,
} from 'lucide-react';

const HomePage = () => {
  const [allItems, setAllItems] = useState([]);
  const [activeCollection, setActiveCollection] = useState('most_loved');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await api.get('/pizzas');
        const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        if (items.length > 0) {
          setAllItems(items);
        }
      } catch (err) {
        console.error('Failed to load menu catalogue:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const collections = [
    { id: 'most_loved', label: 'Most Loved', description: 'Customer favorites ordered week after week' },
    { id: 'chefs_special', label: "Chef's Special", description: 'Gourmet artisanal recipes crafted by our executive chefs' },
    { id: 'new_on_menu', label: 'New on the Menu', description: 'Fresh seasonal creations and bold new flavor combinations' },
    { id: 'weekend_special', label: 'Weekend Specials', description: 'Indulgent treats and feast platters designed for celebrations' },
    { id: 'family_favorites', label: 'Family Favorites', description: 'Hearty crowd-pleasing meals that satisfy everyone at the table' },
  ];

  // Filter items matching active collection tag, or fallback to first 6 items
  const filteredCollectionItems = allItems.filter(
    (item) => item.collectionTag === activeCollection
  );
  const displayItems = filteredCollectionItems.length > 0 ? filteredCollectionItems : allItems.slice(0, 6);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Large Editorial Split Hero */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-ivory dark:bg-[#0E1612] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary-light/90 dark:bg-primary/20 text-primary dark:text-primary-light border border-primary/20 text-xs sm:text-sm font-bold tracking-wide">
                <Flame className="w-4 h-4 fill-current text-primary" />
                <span>Wood-Fired Pizzeria & Gourmet Kitchen</span>
              </div>

              <h1 className="font-display font-normal text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl text-espresso dark:text-[#FAF6EF] leading-[1.04] tracking-tight transition-colors">
                Good Food.{' '}
                <span className="italic block font-serif font-normal text-primary">Great Moments.</span>
                <span className="block">Made Fresh.</span>
              </h1>

              <p className="text-lg sm:text-xl text-espresso-muted dark:text-[#A3B8AC] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans transition-colors">
                From 48-hour cold-fermented sourdough pizzas to double-smashed Angus burgers, handmade pasta, and decadent desserts: ordered fresh to your table.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/menu" className="w-full sm:w-auto">
                  <Button
                    variant="gradient"
                    size="xl"
                    className="w-full sm:w-auto shadow-glow flex items-center justify-center px-8 text-base"
                  >
                    <span>Explore Our Menu</span>
                  </Button>
                </Link>

                <Link to="/build" className="w-full sm:w-auto">
                  <Button
                    variant="forest"
                    size="xl"
                    className="w-full sm:w-auto shadow-sm flex items-center justify-center gap-2.5 px-8 text-base"
                  >
                    <ChefHat className="w-5 h-5 text-honey" />
                    <span>Build Your Pizza</span>
                  </Button>
                </Link>
              </div>

              {/* Highlights Pill Row: Concrete kitchen data */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-ivory-border dark:border-dark-border max-w-xl mx-auto lg:mx-0 transition-colors">
                <div>
                  <p className="font-display font-bold text-3xl sm:text-4xl text-espresso dark:text-[#FAF6EF]">450°C</p>
                  <p className="text-xs sm:text-sm text-espresso-muted dark:text-[#A3B8AC] font-semibold mt-1">Stone Hearth Oven</p>
                </div>
                <div>
                  <p className="font-display font-bold text-3xl sm:text-4xl text-espresso dark:text-[#FAF6EF]">48h</p>
                  <p className="text-xs sm:text-sm text-espresso-muted dark:text-[#A3B8AC] font-semibold mt-1">Slow Sourdough Rest</p>
                </div>
                <div>
                  <p className="font-display font-bold text-3xl sm:text-4xl text-espresso dark:text-[#FAF6EF]">30 Min</p>
                  <p className="text-xs sm:text-sm text-espresso-muted dark:text-[#A3B8AC] font-semibold mt-1">Hot Delivery Target</p>
                </div>
              </div>
            </div>

            {/* Right Column: Heroic Editorial Food Photography */}
            <div className="lg:col-span-5 relative flex items-center justify-center animate-slide-up">
              <div className="relative w-full max-w-xl lg:max-w-none">
                {/* Main Large Food Image: Anti-slop R-40 compliant with explicit width, height and fetchpriority */}
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-dark-border bg-ivory-soft dark:bg-dark-surface aspect-[4/3] lg:aspect-[5/4] transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85"
                    alt="Handcrafted artisan pizza fresh from stone oven"
                    width="1200"
                    height="960"
                    fetchPriority="high"
                    className="w-full h-full object-cover scale-102 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Floating Dish Badge 1: Burger Spotlight */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 dark:bg-[#15221B]/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-ivory-border dark:border-[#283D31] flex items-center gap-4 max-w-xs cursor-pointer transition-transform hover:scale-105">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"
                    alt="Gourmet smash burger"
                    width="64"
                    height="64"
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-sm"
                  />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary dark:text-honey">
                      Signature Pick
                    </span>
                    <h4 className="text-sm font-bold text-espresso dark:text-[#FAF6EF] leading-tight">
                      Classic Smash Burger
                    </h4>
                    <p className="text-sm font-extrabold text-espresso dark:text-honey mt-0.5">₹329</p>
                  </div>
                </div>

                {/* Floating Rating Pill 2 */}
                <div className="absolute -top-5 -right-4 bg-forest dark:bg-[#1C2E25] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 dark:border-honey/40 flex items-center gap-3 cursor-pointer transition-transform hover:scale-105">
                  <div className="w-9 h-9 rounded-xl bg-honey/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-honey fill-honey" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-tight text-white">Artisan Kitchen</p>
                    <p className="text-xs text-honey font-semibold">Wood-Fired Daily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 Culinary Marquee Ticker: Real culinary standards */}
      <div className="border-y border-ivory-border dark:border-dark-border bg-ivory-soft/60 dark:bg-dark-surface/60 py-3.5 overflow-hidden select-none transition-colors">
        <div className="flex w-max animate-marquee space-x-8 text-xs font-bold tracking-wider uppercase text-espresso-muted dark:text-dark-muted">
          <span className="flex items-center gap-2">🔥 450°C Hearth Stone Baking</span>
          <span className="text-primary">•</span>
          <span className="flex items-center gap-2">🌿 Italian San Marzano DOP Tomatoes</span>
          <span className="text-primary">•</span>
          <span className="flex items-center gap-2">⏱ 30-Minute Doorstep Target</span>
          <span className="text-primary">•</span>
          <span className="flex items-center gap-2">🧀 Hand-Stretched Fior Di Latte</span>
          <span className="text-primary">•</span>
          <span className="flex items-center gap-2">🛵 Live Socket.IO Kitchen Dispatch</span>
          <span className="text-primary">•</span>
          <span className="flex items-center gap-2">🥩 Prime Aged Smashed Angus Patties</span>
          <span className="text-primary">•</span>
          <span className="flex items-center gap-2">🍝 Tagliatelle Tossed Fresh to Order</span>
          <span className="text-primary">•</span>
          {/* Loop copy */}
          <span className="flex items-center gap-2">🔥 450°C Hearth Stone Baking</span>
          <span className="text-primary">•</span>
          <span className="flex items-center gap-2">🌿 Italian San Marzano DOP Tomatoes</span>
          <span className="text-primary">•</span>
          <span className="flex items-center gap-2">⏱ 30-Minute Doorstep Target</span>
          <span className="text-primary">•</span>
          <span className="flex items-center gap-2">🧀 Hand-Stretched Fior Di Latte</span>
          <span className="text-primary">•</span>
          <span className="flex items-center gap-2">🛵 Live Socket.IO Kitchen Dispatch</span>
          <span className="text-primary">•</span>
          <span className="flex items-center gap-2">🥩 Prime Aged Smashed Angus Patties</span>
          <span className="text-primary">•</span>
          <span className="flex items-center gap-2">🍝 Tagliatelle Tossed Fresh to Order</span>
          <span className="text-primary">•</span>
        </div>
      </div>

      {/* 2. Featured Food Collections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Curated Menu
          </span>
          <h2 className="font-display font-normal text-3xl sm:text-4xl text-espresso dark:text-dark-text tracking-tight transition-colors">
            Featured Dishes & House Specialties
          </h2>
          <p className="text-sm text-espresso-muted dark:text-dark-muted max-w-xl mx-auto transition-colors">
            From stone-oven sourdough pizzas and smash burgers to slow-cooked tagliatelle and desserts.
          </p>

          {/* Collection Tabs */}
          <div className="pt-4 flex items-center justify-center gap-2 flex-wrap">
            {collections.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setActiveCollection(col.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeCollection === col.id
                    ? 'bg-forest text-white shadow-md scale-105'
                    : 'bg-white dark:bg-dark-card text-espresso dark:text-dark-text hover:bg-ivory-soft dark:hover:bg-dark-surface border border-ivory-border dark:border-dark-border active:scale-95'
                }`}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <PizzaCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {displayItems.map((pizza) => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/menu">
            <Button
              variant="outlineForest"
              size="lg"
              className="text-xs uppercase tracking-wider font-extrabold"
            >
              Browse Complete Menu (37 Dishes)
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. Three Promotional Editorial Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Banner 1: Large Split Feast Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-forest text-white p-8 sm:p-12 shadow-card hover-lift flex flex-col lg:flex-row items-center justify-between gap-8 group">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-honey">
              Sharing Platter
            </span>
            <h3 className="font-display font-normal text-3xl sm:text-5xl leading-tight text-white">
              Weekend Sharing Feasts for Groups and Family.
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Includes two large stone-baked pizzas, 8 smoked wings, seasoned fries, and craft colas prepared together in one order.
            </p>
            <div className="pt-2">
              <Link to="/menu?category=Combos">
                <Button
                  variant="honey"
                  size="md"
                  className="font-bold text-xs"
                >
                  Order Feast Box: From ₹499
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80"
              alt="Weekend feast table"
              width="900"
              height="562"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Dual Promo Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 2: Gourmet Burgers */}
          <div className="rounded-3xl overflow-hidden bg-ivory-soft dark:bg-dark-surface border border-ivory-border dark:border-dark-border p-7 sm:p-8 flex flex-col justify-between group shadow-subtle hover-lift transition-all">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Smashed to Order
              </span>
              <h4 className="font-display font-normal text-2xl sm:text-3xl text-espresso dark:text-dark-text transition-colors">
                Double Smashed Patties on Toasted Brioche.
              </h4>
              <p className="text-xs text-espresso-muted dark:text-dark-muted leading-relaxed transition-colors">
                Prime beef pressed thin on hot steel for a crisp caramelized crust, stacked with sharp cheddar and house pickles.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Link
                to="/menu?category=Burgers"
                className="text-xs font-bold text-primary hover:underline"
              >
                Explore 5 Gourmet Burgers
              </Link>
              <img
                src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=250&q=80"
                alt="Burger"
                width="80"
                height="80"
                className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Banner 3: Pizza Builder */}
          <div className="rounded-3xl overflow-hidden bg-gradient-ember text-white p-7 sm:p-8 flex flex-col justify-between group shadow-subtle hover-lift transition-all">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-honey">
                Interactive Customizer
              </span>
              <h4 className="font-display font-normal text-2xl sm:text-3xl text-white">
                Build a Pizza Exactly How You Like It.
              </h4>
              <p className="text-xs text-white/90 leading-relaxed">
                Choose from 5 slow-fermented crusts, 5 simmered sauces, 4 melting cheeses, and 8 fresh vegetable toppings.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Link to="/build">
                <Button
                  variant="secondary"
                  size="md"
                  className="bg-white text-espresso hover:bg-ivory-soft hover:shadow-card font-extrabold text-xs"
                >
                  Open Pizza Builder
                </Button>
              </Link>
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <ChefHat className="w-10 h-10 text-honey" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Real Kitchen Craft & Standards */}
      <section className="bg-white dark:bg-dark-surface py-16 border-y border-ivory-border dark:border-dark-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Kitchen Standards
            </span>
            <h2 className="font-display font-normal text-3xl sm:text-4xl text-espresso dark:text-dark-text tracking-tight transition-colors">
              How Every Meal is Prepared
            </h2>
            <p className="text-sm text-espresso-muted dark:text-dark-muted max-w-xl mx-auto font-sans transition-colors">
              We operate an artisan scratch kitchen with verified culinary methods and real-time inventory management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="p-6 rounded-2xl bg-ivory-soft dark:bg-dark-card border border-ivory-border dark:border-dark-border text-center space-y-3 shadow-subtle hover-lift group transition-all">
              <div className="w-12 h-12 rounded-2xl bg-forest-light dark:bg-forest/20 text-forest dark:text-emerald-400 mx-auto flex items-center justify-center">
                <Leaf className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-sans font-bold text-base text-espresso dark:text-dark-text">Fresh Produce</h3>
              <p className="text-xs text-espresso-muted dark:text-dark-muted leading-relaxed font-sans">
                Italian San Marzano tomatoes, fresh fior di latte mozzarella, and market vegetables prepped daily.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-soft dark:bg-dark-card border border-ivory-border dark:border-dark-border text-center space-y-3 shadow-subtle hover-lift group transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary-light/80 dark:bg-primary/20 text-primary mx-auto flex items-center justify-center">
                <Flame className="w-6 h-6 stroke-[2] fill-primary" />
              </div>
              <h3 className="font-sans font-bold text-base text-espresso dark:text-dark-text">Baked to Order</h3>
              <p className="text-xs text-espresso-muted dark:text-dark-muted leading-relaxed font-sans">
                Pizzas are stretched by hand and baked in our 450°C stone hearth oven only after your order is confirmed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-soft dark:bg-dark-card border border-ivory-border dark:border-dark-border text-center space-y-3 shadow-subtle hover-lift group transition-all">
              <div className="w-12 h-12 rounded-2xl bg-honey-light dark:bg-honey/20 text-forest dark:text-honey mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-sans font-bold text-base text-espresso dark:text-dark-text">Verified Payments</h3>
              <p className="text-xs text-espresso-muted dark:text-dark-muted leading-relaxed font-sans">
                Razorpay payment processing with cryptographic server signature verification on every checkout.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-soft dark:bg-dark-card border border-ivory-border dark:border-dark-border text-center space-y-3 shadow-subtle hover-lift group transition-all">
              <div className="w-12 h-12 rounded-2xl bg-forest-light dark:bg-forest/20 text-forest dark:text-emerald-400 mx-auto flex items-center justify-center">
                <Truck className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-sans font-bold text-base text-espresso dark:text-dark-text">Thermal Bags</h3>
              <p className="text-xs text-espresso-muted dark:text-dark-muted leading-relaxed font-sans">
                Orders are dispatched in insulated thermal bags to maintain crust texture and warmth to your door.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-soft dark:bg-dark-card border border-ivory-border dark:border-dark-border text-center space-y-3 shadow-subtle hover-lift group transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary-light/80 dark:bg-primary/20 text-primary mx-auto flex items-center justify-center">
                <ChefHat className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-sans font-bold text-base text-espresso dark:text-dark-text">Live Customizer</h3>
              <p className="text-xs text-espresso-muted dark:text-dark-muted leading-relaxed font-sans">
                A 4-step customizer with live ingredient pricing and atomic stock checks before checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Authentic Sourcing & Culinary Craft Showcase: Replaces fake testimonials adhering to antislop R-18 and C-5 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Ingredient Heritage
          </span>
          <h2 className="font-display font-normal text-3xl sm:text-4xl text-espresso dark:text-dark-text tracking-tight transition-colors">
            Our Kitchen Sourcing Standards
          </h2>
          <p className="text-xs sm:text-sm text-espresso-muted dark:text-dark-muted max-w-xl mx-auto transition-colors font-sans">
            Every ingredient is sourced from verified producers, from slow-milled flour to heritage cheeses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Craft 1 */}
          <div className="bg-white dark:bg-dark-card rounded-3xl border border-ivory-border dark:border-dark-border overflow-hidden shadow-subtle hover-lift flex flex-col group transition-all">
            <div className="h-52 overflow-hidden bg-ivory-soft dark:bg-dark-surface">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80"
                alt="48-hour cold fermentation sourdough dough"
                width="700"
                height="466"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-6 space-y-2.5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">48-Hour Rest</span>
                <h3 className="font-sans font-bold text-lg text-espresso dark:text-dark-text mt-1">Slow Cold Fermentation</h3>
                <p className="text-xs text-espresso-muted dark:text-dark-muted leading-relaxed mt-2 font-sans">
                  Our natural sourdough starter rests in cold storage for two days. This develops complex flavor and an airy, digestible crumb structure.
                </p>
              </div>
              <div className="pt-3 border-t border-ivory-border dark:border-dark-border text-[11px] font-semibold text-forest dark:text-emerald-400">
                100% Organic Stone-Ground Flour
              </div>
            </div>
          </div>

          {/* Craft 2 */}
          <div className="bg-white dark:bg-dark-card rounded-3xl border border-ivory-border dark:border-dark-border overflow-hidden shadow-subtle hover-lift flex flex-col group transition-all">
            <div className="h-52 overflow-hidden bg-ivory-soft dark:bg-dark-surface">
              <img
                src="https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=700&q=80"
                alt="Ripe San Marzano tomatoes"
                width="700"
                height="466"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-6 space-y-2.5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Volcanic Soil DOP</span>
                <h3 className="font-sans font-bold text-lg text-espresso dark:text-dark-text mt-1">San Marzano Tomatoes</h3>
                <p className="text-xs text-espresso-muted dark:text-dark-muted leading-relaxed mt-2 font-sans">
                  Harvested from the volcanic soil of Mount Vesuvius, our sauce is crushed raw with sea salt and cold-pressed olive oil, with zero added sugar.
                </p>
              </div>
              <div className="pt-3 border-t border-ivory-border dark:border-dark-border text-[11px] font-semibold text-forest dark:text-emerald-400">
                Natural Sweetness & Low Acidity
              </div>
            </div>
          </div>

          {/* Craft 3 */}
          <div className="bg-white dark:bg-dark-card rounded-3xl border border-ivory-border dark:border-dark-border overflow-hidden shadow-subtle hover-lift flex flex-col group transition-all">
            <div className="h-52 overflow-hidden bg-ivory-soft dark:bg-dark-surface">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"
                alt="450 Celsius stone hearth oven"
                width="700"
                height="466"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-6 space-y-2.5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">High Heat Bake</span>
                <h3 className="font-sans font-bold text-lg text-espresso dark:text-dark-text mt-1">450°C Hearth Fire</h3>
                <p className="text-xs text-espresso-muted dark:text-dark-muted leading-relaxed mt-2 font-sans">
                  Extreme stone hearth heat bakes each pizza in under 90 seconds. This traps moisture inside while blistering the exterior edges.
                </p>
              </div>
              <div className="pt-3 border-t border-ivory-border dark:border-dark-border text-[11px] font-semibold text-forest dark:text-emerald-400">
                Authentic Neapolitan Leopard Crust
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. About Us Anchor Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-36 pt-4 pb-12">
        <div className="rounded-3xl bg-ivory-soft dark:bg-dark-surface border border-ivory-border dark:border-dark-border p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group shadow-subtle hover-lift transition-all">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Our Kitchen Story
            </span>
            <h3 className="font-display font-normal text-3xl sm:text-4xl text-espresso dark:text-dark-text leading-snug transition-colors">
              Food Prepared with Patience and Baked to Order.
            </h3>
            <p className="text-xs sm:text-sm text-espresso-muted dark:text-dark-muted leading-relaxed font-sans transition-colors">
              SliceFlow was founded on a simple conviction: fast delivery should never mean cutting culinary corners. We cold-ferment our dough for two days, cook with authentic regional ingredients, and pair traditional cooking methods with transparent live inventory management.
            </p>
            <p className="text-xs text-espresso-muted dark:text-dark-muted font-sans leading-relaxed transition-colors">
              Built as a flagship full-stack capstone for the Oasis Infobyte Web Development Internship, SliceFlow brings together interactive custom recipes, two-phase atomic inventory reservation, and real-time Socket.IO live order tracking.
            </p>
          </div>
          <div className="lg:col-span-5 aspect-square rounded-2xl overflow-hidden shadow-card border-2 border-white dark:border-dark-border bg-ivory-soft dark:bg-dark-surface">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
              alt="Artisan pizza chef stretching dough"
              width="800"
              height="800"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
