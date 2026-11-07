import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PizzaCard from '../components/pizza/PizzaCard';
import { PizzaCardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { Search, Flame, Utensils, Filter, X } from 'lucide-react';

const categories = [
  { id: 'All', label: 'All Dishes', countTag: '37' },
  { id: 'Pizza', label: 'Pizzas 🍕', countTag: '8' },
  { id: 'Burgers', label: 'Burgers 🍔', countTag: '5' },
  { id: 'Pasta', label: 'Pasta 🍝', countTag: '4' },
  { id: 'Sides', label: 'Sides & Wings 🍗', countTag: '7' },
  { id: 'Desserts', label: 'Desserts 🍰', countTag: '4' },
  { id: 'Drinks', label: 'Drinks & Beverages 🥤', countTag: '5' },
  { id: 'Combos', label: 'Meal Combos 🍱', countTag: '4' },
];

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category') || 'All';
  const urlSearch = searchParams.get('search') || '';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [dietaryFilter, setDietaryFilter] = useState('All'); // 'All', 'Vegetarian', 'Non-Veg'
  const [spiceFilter, setSpiceFilter] = useState(false); // Only spicy
  const [sortBy, setSortBy] = useState('popular');

  // Sync category when URL changes
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlCategory, urlSearch]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (dietaryFilter !== 'All') params.append('dietary', dietaryFilter);
      if (sortBy) params.append('sort', sortBy);

      const res = await api.get(`/pizzas?${params.toString()}`);
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setItems(list);
    } catch (err) {
      console.error('Error fetching menu catalogue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, dietaryFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  // Local filter for spice toggle if active
  const displayedItems = items.filter((item) => {
    if (!spiceFilter) return true;
    return (item.spiceLevel || 0) > 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Editorial Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-primary block">
          Complete Restaurant Catalogue
        </span>
        <h1 className="font-display font-normal text-4xl sm:text-5xl text-espresso dark:text-dark-text tracking-tight transition-colors">
          The SliceFlow Kitchen Menu
        </h1>
        <p className="text-sm text-espresso-muted dark:text-dark-muted leading-relaxed font-sans transition-colors">
          Explore handcrafted Neapolitan pizzas, smashed Angus beef burgers, slow-simmered pastas, crispy wings, and chilled craft coolers.
        </p>
      </div>

      {/* Filter and Category Navigation Bar */}
      <div className="bg-white dark:bg-dark-card p-5 sm:p-6 rounded-3xl border border-ivory-border dark:border-dark-border shadow-card space-y-5 transition-colors">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={`min-h-[44px] px-4 py-2.5 rounded-2xl text-xs font-bold tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-forest text-white shadow-md scale-105'
                  : 'bg-ivory-soft dark:bg-dark-surface text-espresso dark:text-dark-text hover:bg-ivory-border/70 dark:hover:bg-dark-border hover:scale-102 border border-ivory-border dark:border-dark-border active:scale-95'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Secondary Controls: Search, Dietary Filters, Spice, Sort */}
        <div className="pt-4 border-t border-ivory-border dark:border-dark-border flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Dietary & Spice toggles */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            <span className="text-xs font-bold text-espresso-muted dark:text-dark-muted mr-1 font-sans">Filter:</span>
            {['All', 'Vegetarian', 'Non-Veg'].map((diet) => (
              <button
                key={diet}
                type="button"
                onClick={() => setDietaryFilter(diet)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  dietaryFilter === diet
                    ? 'bg-primary text-white shadow-sm scale-105'
                    : 'bg-ivory-soft dark:bg-dark-surface text-espresso dark:text-dark-text hover:bg-ivory-border dark:hover:bg-dark-border border border-ivory-border dark:border-dark-border active:scale-95'
                }`}
              >
                {diet}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setSpiceFilter(!spiceFilter)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                spiceFilter
                  ? 'bg-status-error text-white shadow-sm'
                  : 'bg-ivory-soft dark:bg-dark-surface text-espresso dark:text-dark-text hover:bg-ivory-border dark:hover:bg-dark-border border border-ivory-border dark:border-dark-border'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Spicy Only</span>
            </button>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search menu or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-ivory-border dark:border-dark-border text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-ivory-soft dark:bg-dark-surface text-espresso dark:text-dark-text placeholder-espresso-muted dark:placeholder-dark-muted transition-colors"
              />
              <Search className="w-4 h-4 text-espresso-muted dark:text-dark-muted absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchParams.delete('search');
                    setSearchParams(searchParams);
                    fetchItems();
                  }}
                  className="absolute right-2.5 top-2.5 text-espresso-muted hover:text-espresso dark:text-dark-muted dark:hover:text-dark-text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-ivory-border dark:border-dark-border text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-ivory-soft dark:bg-dark-surface font-bold text-espresso dark:text-dark-text cursor-pointer transition-colors"
            >
              <option value="popular">Most Popular ★</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      {!loading && (
        <div className="flex items-center justify-between text-xs font-bold text-espresso-muted dark:text-dark-muted px-1">
          <span>
            Showing <strong className="text-espresso dark:text-dark-text">{displayedItems.length}</strong> items in{' '}
            <span className="text-primary">{selectedCategory === 'All' ? 'Complete Menu' : selectedCategory}</span>
          </span>
          {(dietaryFilter !== 'All' || spiceFilter || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setDietaryFilter('All');
                setSpiceFilter(false);
                setSearchQuery('');
                searchParams.delete('category');
                searchParams.delete('search');
                setSearchParams(searchParams);
              }}
              className="text-primary hover:underline text-xs font-bold cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      )}

      {/* Menu Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <PizzaCardSkeleton key={i} />
          ))}
        </div>
      ) : displayedItems.length === 0 ? (
        <EmptyState
          icon={Utensils}
          title="No culinary items match your filter"
          description="Try broadening your category selection, resetting the dietary filter, or searching for other items."
          actionText="Reset Filters"
          onAction={() => {
            setSelectedCategory('All');
            setDietaryFilter('All');
            setSpiceFilter(false);
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {displayedItems.map((item) => (
            <PizzaCard key={item._id} pizza={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
