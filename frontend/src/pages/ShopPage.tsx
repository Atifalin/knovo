import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import Pagination from '../components/ui/Pagination';
import { productsApi } from '../lib/products';
import type { Product, PaginationMeta, Category } from '../types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOptions, setFilterOptions] = useState<{ colors: string[]; materials: string[] }>({ colors: [], materials: [] });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const color = searchParams.get('color') || '';
  const material = searchParams.get('material') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12, sort };
      if (category) params.category = category;
      if (color) params.color = color;
      if (material) params.material = material;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (search) params.search = search;
      const res = await productsApi.getAll(params);
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, color, material, minPrice, maxPrice, sort, search, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    productsApi.getCategories().then((r) => setCategories(r.data.data)).catch(() => {});
    productsApi.getFilterOptions().then((r) => setFilterOptions(r.data.data)).catch(() => {});
  }, []);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasFilters = category || color || material || minPrice || maxPrice || search;

  const pageTitle = category
    ? categories.find((c) => c.slug === category)?.name || 'Shop'
    : search
    ? `Search: "${search}"`
    : 'Shop All';

  return (
    <>
      <Helmet>
        <title>{pageTitle} — KNOVO</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-2">Collection</p>
          <h1 className="font-serif text-4xl text-[#0B1F3B]">{pageTitle}</h1>
          {pagination && (
            <p className="text-gray-400 text-sm mt-2">{pagination.total} {pagination.total === 1 ? 'product' : 'products'}</p>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <FilterPanel
              categories={categories}
              filterOptions={filterOptions}
              category={category}
              color={color}
              material={material}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setParam={setParam}
              clearFilters={clearFilters}
              hasFilters={!!hasFilters}
            />
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-xs tracking-widest uppercase text-[#0B1F3B] border border-gray-200 px-4 py-2 hover:border-[#C6A75E] transition-colors"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <label className="text-xs text-gray-500 whitespace-nowrap">Sort by:</label>
                <select
                  value={sort}
                  onChange={(e) => setParam('sort', e.target.value)}
                  className="text-xs border border-gray-200 px-3 py-2 text-[#0B1F3B] outline-none focus:border-[#C6A75E] bg-white"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-serif text-2xl text-[#0B1F3B] mb-3">No products found</p>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search term.</p>
                <button onClick={clearFilters} className="text-xs tracking-widest uppercase text-[#C6A75E] border border-[#C6A75E] px-6 py-2.5 hover:bg-[#C6A75E] hover:text-white transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                key={`${category}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </motion.div>
            )}

            {pagination && (
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                onPageChange={(p) => setParam('page', String(p))}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg text-[#0B1F3B]">Filters</h3>
              <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
            </div>
            <FilterPanel
              categories={categories}
              filterOptions={filterOptions}
              category={category}
              color={color}
              material={material}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setParam={(k, v) => { setParam(k, v); setFiltersOpen(false); }}
              clearFilters={() => { clearFilters(); setFiltersOpen(false); }}
              hasFilters={!!hasFilters}
            />
          </div>
        </div>
      )}
    </>
  );
}

interface FilterPanelProps {
  categories: Category[];
  filterOptions: { colors: string[]; materials: string[] };
  category: string; color: string; material: string;
  minPrice: string; maxPrice: string;
  setParam: (k: string, v: string) => void;
  clearFilters: () => void;
  hasFilters: boolean;
}

function FilterPanel({ categories, filterOptions, category, color, material, minPrice, maxPrice, setParam, clearFilters, hasFilters }: FilterPanelProps) {
  return (
    <div className="space-y-8">
      {hasFilters && (
        <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-[#C6A75E] tracking-widest uppercase">
          <X size={12} /> Clear All
        </button>
      )}

      {/* Category */}
      <div>
        <h4 className="text-xs tracking-widest uppercase text-[#0B1F3B] font-semibold mb-4">Category</h4>
        <div className="space-y-2">
          <button
            onClick={() => setParam('category', '')}
            className={`block text-sm w-full text-left ${!category ? 'text-[#C6A75E] font-medium' : 'text-gray-500 hover:text-[#0B1F3B]'}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setParam('category', c.slug)}
              className={`block text-sm w-full text-left ${category === c.slug ? 'text-[#C6A75E] font-medium' : 'text-gray-500 hover:text-[#0B1F3B]'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="text-xs tracking-widest uppercase text-[#0B1F3B] font-semibold mb-4">Price (CAD)</h4>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setParam('minPrice', e.target.value)}
            className="w-full border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-[#C6A75E]"
          />
          <span className="text-gray-300">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setParam('maxPrice', e.target.value)}
            className="w-full border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-[#C6A75E]"
          />
        </div>
      </div>

      {/* Color */}
      {filterOptions.colors.length > 0 && (
        <div>
          <h4 className="text-xs tracking-widest uppercase text-[#0B1F3B] font-semibold mb-4">Color</h4>
          <div className="space-y-2">
            {filterOptions.colors.map((c) => (
              <button
                key={c}
                onClick={() => setParam('color', color === c ? '' : c!)}
                className={`block text-sm w-full text-left ${color === c ? 'text-[#C6A75E] font-medium' : 'text-gray-500 hover:text-[#0B1F3B]'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Material */}
      {filterOptions.materials.length > 0 && (
        <div>
          <h4 className="text-xs tracking-widest uppercase text-[#0B1F3B] font-semibold mb-4">Material</h4>
          <div className="space-y-2">
            {filterOptions.materials.map((m) => (
              <button
                key={m}
                onClick={() => setParam('material', material === m ? '' : m!)}
                className={`block text-sm w-full text-left ${material === m ? 'text-[#C6A75E] font-medium' : 'text-gray-500 hover:text-[#0B1F3B]'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
