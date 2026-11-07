import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from './Button';
import WishlistModal from './WishlistModal';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  LogOut,
  Menu as MenuIcon,
  X,
  Shield,
  ChefHat,
  ChevronDown,
  Sparkles,
  Flame,
  Sun,
  Moon,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount, wishlistCount } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navCategories = [
    { name: 'Home', path: '/' },
    { name: 'Explore Menu', path: '/menu' },
    { name: 'Pizza', path: '/menu?category=Pizza' },
    { name: 'Burgers', path: '/menu?category=Burgers' },
    { name: 'Pasta', path: '/menu?category=Pasta' },
    { name: 'Sides', path: '/menu?category=Sides' },
    { name: 'About Us', path: '/#about' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.search;
    if (path.includes('?category=')) {
      const cat = path.split('?category=')[1];
      return location.pathname === '/menu' && location.search.includes(`category=${cat}`);
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* 1. Announcement Bar */}
      <div className="bg-forest dark:bg-[#121E17] text-white py-2 px-4 text-xs font-medium border-b border-forest-dark dark:border-dark-border transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-honey animate-pulse" />
            <span className="text-white/90">
              Freshly prepared. Delivered with love. Every single time.
            </span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center gap-4 text-center sm:text-right">
            <span>
              🚚 <strong className="text-honey">Free Delivery</strong> on orders above ₹499
            </span>
            <span className="hidden md:inline text-white/50">•</span>
            <span className="hidden md:inline text-white/80">
              Kitchen Open 11:00 AM to 11:30 PM
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FAF6EF]/90 dark:bg-dark-bg/90 backdrop-blur-xl border-b border-ivory-border dark:border-dark-border shadow-subtle transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Brand Identity */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl p-1 transition-transform"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-ember flex items-center justify-center text-white shadow-glow group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <Flame className="w-6 h-6 stroke-[2.2] fill-honey text-honey" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl tracking-tight text-espresso dark:text-dark-text leading-none transition-colors">
                  Slice<span className="text-primary">Flow</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-espresso-muted dark:text-dark-muted mt-1 transition-colors">
                  Artisanal Kitchen & Bar
                </span>
              </div>
            </Link>

            {/* Center: Restaurant Category Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navCategories.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-3.5 py-2 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200 ${
                      active
                        ? 'text-primary bg-primary-light/80 dark:bg-primary/20 dark:text-primary-light shadow-sm'
                        : 'text-espresso dark:text-dark-text hover:text-primary dark:hover:text-primary hover:bg-ivory-soft dark:hover:bg-dark-surface'
                    }`}
                  >
                    {item.name}
                    {active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}

              {/* Pizza Builder Highlight Button */}
              <Link
                to="/build"
                className="ml-2 px-4 py-2 rounded-2xl text-xs font-extrabold bg-gradient-ember text-white shadow-glow hover:shadow-card hover:-translate-y-0.5 flex items-center gap-1.5 transition-all duration-200 active:scale-95 btn-shine"
              >
                <ChefHat className="w-4 h-4 text-honey" />
                <span>Build Pizza</span>
              </Link>
            </nav>

            {/* Right: Actions (Theme Toggle, Search, Wishlist, Bag, Account) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Theme Toggle Button (Dark / Light Mode) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-2xl text-espresso dark:text-dark-text hover:bg-ivory-soft dark:hover:bg-dark-surface hover:text-primary dark:hover:text-primary transition-all active:scale-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                title={isDark ? 'Switch to Warm Ivory Light Mode' : 'Switch to Dark Bistro Obsidian Mode'}
                aria-label="Toggle theme mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-honey animate-fade-in hover:rotate-45 transition-transform duration-300" />
                ) : (
                  <Moon className="w-5 h-5 text-espresso hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>

              {/* Search Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-2xl text-espresso dark:text-dark-text hover:bg-ivory-soft dark:hover:bg-dark-surface hover:text-primary dark:hover:text-primary transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  aria-label="Search food menu"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Inline Search Bar Popup */}
                {searchOpen && (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="absolute right-0 top-12 z-50 w-72 sm:w-80 bg-white dark:bg-dark-card p-2 rounded-2xl shadow-modal border border-ivory-border dark:border-dark-border flex items-center gap-2 animate-scale-in"
                  >
                    <Search className="w-4 h-4 text-espresso-muted dark:text-dark-muted ml-2 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search pizzas, burgers, pasta..."
                      className="w-full text-xs bg-transparent py-1.5 focus:outline-none text-espresso dark:text-dark-text placeholder-espresso-muted dark:placeholder-dark-muted"
                      autoFocus
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="xs"
                      className="shrink-0"
                    >
                      Find
                    </Button>
                  </form>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                className="relative min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-2xl text-espresso dark:text-dark-text hover:bg-ivory-soft dark:hover:bg-dark-surface hover:text-primary dark:hover:text-primary transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                aria-label="View saved favorites"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute 1 top-1 right-1 bg-forest text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart / Shopping Bag Button */}
              <Link
                to="/cart"
                className="relative min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-2xl text-espresso dark:text-dark-text hover:bg-ivory-soft dark:hover:bg-dark-surface hover:text-primary dark:hover:text-primary transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                aria-label="View shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {totalItemCount}
                  </span>
                )}
              </Link>

              {/* Authenticated User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-ivory-border dark:border-dark-border hover:border-primary bg-white dark:bg-dark-card text-xs font-bold text-espresso dark:text-dark-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary shadow-subtle cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary-light dark:bg-primary/20 text-primary font-extrabold text-xs flex items-center justify-center">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline truncate max-w-[100px]">
                      {user?.name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-espresso-muted dark:text-dark-muted" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-2xl shadow-modal border border-ivory-border dark:border-dark-border py-2 z-50 animate-scale-in">
                      <div className="px-4 py-2 border-b border-ivory-border dark:border-dark-border">
                        <p className="text-xs font-bold text-espresso dark:text-dark-text truncate">{user?.name}</p>
                        <p className="text-[11px] text-espresso-muted dark:text-dark-muted truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-espresso dark:text-dark-text hover:bg-ivory-soft dark:hover:bg-dark-surface font-semibold transition-colors"
                      >
                        <User className="w-4 h-4 text-espresso-muted dark:text-dark-muted" />
                        Order History & Profile
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-primary hover:bg-primary-light dark:hover:bg-primary/10 font-bold transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Console
                        </Link>
                      )}

                      <div className="border-t border-ivory-border dark:border-dark-border my-1"></div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-status-error hover:bg-red-50 dark:hover:bg-red-950/30 font-bold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-xs font-bold">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="gradient" size="sm" className="text-xs font-bold shadow-sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-2xl text-espresso dark:text-dark-text hover:bg-ivory-soft dark:hover:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-ivory-border dark:border-dark-border bg-white dark:bg-dark-bg px-4 pt-4 pb-6 space-y-2 animate-fade-in shadow-xl">
            {navCategories.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-2xl text-sm font-bold text-espresso dark:text-dark-text hover:bg-ivory-soft dark:hover:bg-dark-surface hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/build"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-ember text-white font-extrabold text-sm shadow-glow mt-3"
            >
              <ChefHat className="w-4 h-4 text-honey" />
              <span>Build Custom Pizza (4-Step)</span>
            </Link>

            {!isAuthenticated && (
              <div className="pt-4 border-t border-ivory-border dark:border-dark-border grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="md" className="w-full text-xs font-bold">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gradient" size="md" className="w-full text-xs font-bold">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Wishlist Drawer Modal */}
      <WishlistModal isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </>
  );
};

export default Navbar;
