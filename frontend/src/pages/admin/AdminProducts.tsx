import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productsApi } from '../../lib/products';
import type { Product, Category } from '../../types';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  description: z.string().min(10, 'Too short'),
  price: z.string().min(1, 'Required'),
  sku: z.string().min(1, 'Required'),
  categoryId: z.string().min(1, 'Required'),
  stock: z.string().optional(),
  images: z.string().optional(),
  featured: z.boolean().optional(),
  importedBrand: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  pattern: z.string().optional(),
  active: z.boolean().optional(),
  lowStockThreshold: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { active: true, featured: false, stock: '0', lowStockThreshold: '5' },
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsApi.getAll({ limit: 50 });
      setProducts(res.data.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    productsApi.getCategories().then((r) => setCategories(r.data.data)).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ active: true, featured: false, stock: '0', lowStockThreshold: '5' });
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    reset({
      name: product.name,
      description: product.description,
      price: String(product.price),
      sku: product.sku,
      categoryId: product.categoryId,
      stock: String(product.stock),
      images: product.images.join('\n'),
      featured: product.featured,
      importedBrand: product.importedBrand || '',
      material: product.material || '',
      color: product.color || '',
      pattern: product.pattern || '',
      active: product.active,
      lowStockThreshold: String(product.lowStockThreshold),
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        stock: parseInt(data.stock || '0'),
        lowStockThreshold: parseInt(data.lowStockThreshold || '5'),
        images: data.images ? data.images.split('\n').map((s) => s.trim()).filter(Boolean) : [],
      };
      if (editing) {
        await productsApi.update(editing.id, payload);
        toast.success('Product updated');
      } else {
        await productsApi.create(payload);
        toast.success('Product created');
      }
      setModalOpen(false);
      fetchProducts();
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this product?')) return;
    try {
      await productsApi.delete(id);
      toast.success('Product deactivated');
      fetchProducts();
    } catch {
      toast.error('Failed to deactivate');
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await productsApi.update(product.id, { featured: !product.featured } as Partial<Product>);
      toast.success(product.featured ? 'Removed from featured' : 'Marked as featured');
      fetchProducts();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <>
      <Helmet><title>Products — Admin | KNOVO</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-[#0B1F3B]">Products</h1>
            <p className="text-gray-400 text-sm mt-1">{products.length} products</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#0B1F3B] text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-[#162d52] transition-colors"
          >
            <Plus size={14} /> Add Product
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="animate-pulse h-16 bg-gray-50" />)}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-gray-400 font-normal">Product</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-gray-400 font-normal hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-gray-400 font-normal">Price</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-gray-400 font-normal hidden sm:table-cell">Stock</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-gray-400 font-normal hidden lg:table-cell">Featured</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-gray-400 font-normal">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 overflow-hidden flex-shrink-0">
                          <img src={product.images[0] || 'https://picsum.photos/40'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-[#0B1F3B] truncate max-w-[180px]">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{product.category?.name}</td>
                    <td className="px-4 py-3 font-medium text-[#0B1F3B]">CAD ${Number(product.price).toFixed(2)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-medium ${product.stock === 0 ? 'text-red-500' : product.stock <= product.lowStockThreshold ? 'text-amber-500' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <button onClick={() => handleToggleFeatured(product)} className="text-gray-400 hover:text-[#C6A75E] transition-colors">
                        {product.featured
                          ? <ToggleRight size={20} className="text-[#C6A75E]" />
                          : <ToggleLeft size={20} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full tracking-widest uppercase ${product.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(product)} className="text-gray-400 hover:text-[#0B1F3B] transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="text-center py-16">
                <Package size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No products yet. Add your first product.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="font-serif text-2xl text-[#0B1F3B] mb-6">{editing ? 'Edit Product' : 'Add Product'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Name *</label>
                      <input {...register('name')} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C6A75E]" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Description *</label>
                      <textarea {...register('description')} rows={3} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C6A75E] resize-none" />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Price (CAD) *</label>
                      <input {...register('price')} type="number" step="0.01" className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C6A75E]" />
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">SKU *</label>
                      <input {...register('sku')} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C6A75E]" />
                      {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Category *</label>
                      <select {...register('categoryId')} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C6A75E] bg-white">
                        <option value="">Select category</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Stock</label>
                      <input {...register('stock')} type="number" className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C6A75E]" />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Material</label>
                      <input {...register('material')} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C6A75E]" />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Color</label>
                      <input {...register('color')} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C6A75E]" />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Pattern</label>
                      <input {...register('pattern')} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C6A75E]" />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Imported Brand</label>
                      <input {...register('importedBrand')} className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C6A75E]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Image URLs (one per line)</label>
                      <textarea {...register('images')} rows={3} placeholder="https://..." className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C6A75E] resize-none font-mono" />
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" {...register('featured')} className="accent-[#C6A75E]" />
                        Featured
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" {...register('active')} className="accent-[#C6A75E]" />
                        Active
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-[#0B1F3B] text-white py-3 text-xs tracking-widest uppercase font-semibold hover:bg-[#162d52] transition-colors disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-6 border border-gray-200 text-gray-500 text-xs tracking-widest uppercase hover:border-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
