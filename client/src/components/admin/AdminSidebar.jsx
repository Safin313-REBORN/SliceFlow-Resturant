import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowLeft,
  LogOut,
  Flame,
  Utensils,
} from 'lucide-react';

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders Control', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Menu Management', path: '/admin/menu', icon: Utensils },
    { name: 'Inventory & Stock', path: '/admin/inventory', icon: Package },
    { name: 'Low Stock Alerts', path: '/admin/alerts', icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 bg-[#1B2721] text-ivory flex flex-col justify-between shrink-0 min-h-screen border-r border-[#2A3830]">
      <div>
        {/* Brand header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
            <Flame className="w-5 h-5 stroke-[2.2] fill-honey" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-white block leading-none">
              Slice<span className="text-primary">Flow</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-honey">
              Kitchen Console
            </span>
          </div>
        </div>

        {/* Current Admin Tag */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/5">
          <p className="text-xs text-white/50">Authenticated Admin</p>
          <p className="text-sm font-semibold text-white truncate">{user?.name || 'Master Admin'}</p>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Customer Store</span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
