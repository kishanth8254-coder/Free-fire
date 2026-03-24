import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  Settings, 
  ChevronRight, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Save,
  X
} from 'lucide-react';
import { 
  db, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  OperationType,
  handleFirestoreError
} from './firebase';
import { Category, Package as PackageType } from './types';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    badge: '',
    buttonText: 'Buy Now',
    status: 'active' as 'active' | 'inactive',
    displayOrder: 0,
    categoryId: ''
  });

  useEffect(() => {
    const unsubscribeCats = onSnapshot(query(collection(db, 'categories'), orderBy('displayOrder')), (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(cats);
      setIsLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'categories'));

    const unsubscribePkgs = onSnapshot(query(collection(db, 'packages'), orderBy('displayOrder')), (snapshot) => {
      const pkgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PackageType));
      setPackages(pkgs);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'packages'));

    return () => {
      unsubscribeCats();
      unsubscribePkgs();
    };
  }, []);

  const handleOpenModal = (pkg: PackageType | null = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        price: pkg.price,
        description: pkg.description || '',
        badge: pkg.badge || '',
        buttonText: pkg.buttonText || 'Buy Now',
        status: pkg.status,
        displayOrder: pkg.displayOrder,
        categoryId: pkg.categoryId
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        price: 0,
        description: '',
        badge: '',
        buttonText: 'Buy Now',
        status: 'active',
        displayOrder: packages.length + 1,
        categoryId: selectedCategory?.id || categories[0]?.id || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        await updateDoc(doc(db, 'packages', editingPackage.id), formData);
      } else {
        await addDoc(collection(db, 'packages'), formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingPackage ? OperationType.UPDATE : OperationType.CREATE, 'packages');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'packages', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'packages');
      }
    }
  };

  const filteredPackages = selectedCategory 
    ? packages.filter(p => p.categoryId === selectedCategory.id)
    : packages;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 hidden lg:block">
        <div className="mb-10">
          <h1 className="text-2xl font-black tracking-tighter neon-text-purple">BLACK LTZ</h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <nav className="space-y-2">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${!selectedCategory ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-bold text-sm">Dashboard</span>
          </button>
          
          <div className="pt-6 pb-2">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] px-4">Categories</p>
          </div>

          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${selectedCategory?.id === cat.id ? 'bg-white/10 text-white border border-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center space-x-3">
                <Package size={18} />
                <span className="font-bold text-sm">{cat.name}</span>
              </div>
              <ChevronRight size={14} className={selectedCategory?.id === cat.id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight">
              {selectedCategory ? selectedCategory.name : 'All Services'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage your packages and service data</p>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-black uppercase tracking-widest text-xs hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
            >
              <Plus size={16} />
              <span>Add Package</span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Total Services</p>
              <h3 className="text-4xl font-black text-white">{categories.length}</h3>
            </div>
            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Total Packages</p>
              <h3 className="text-4xl font-black text-white">{packages.length}</h3>
            </div>
            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Active Packages</p>
              <h3 className="text-4xl font-black text-brand-green">{packages.filter(p => p.status === 'active').length}</h3>
            </div>
            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Inactive Packages</p>
              <h3 className="text-4xl font-black text-red-500">{packages.filter(p => p.status === 'inactive').length}</h3>
            </div>
          </div>
        )}

        {/* Packages List */}
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-widest">Package List</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Showing {filteredPackages.length} items</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/10">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPackages.map(pkg => (
                  <tr key={pkg.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-white">{pkg.name}</span>
                        {pkg.badge && <span className="text-[10px] text-purple-400 font-bold uppercase">{pkg.badge}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-sm text-brand-yellow">LKR {pkg.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400">{categories.find(c => c.id === pkg.categoryId)?.name || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-black uppercase ${pkg.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {pkg.status === 'active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        <span>{pkg.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">{pkg.displayOrder}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(pkg)}
                          className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(pkg.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPackages.length === 0 && (
              <div className="p-20 text-center">
                <Package size={48} className="mx-auto text-gray-700 mb-4" />
                <p className="text-gray-500 font-bold">No packages found in this category</p>
                <button 
                  onClick={() => handleOpenModal()}
                  className="mt-4 text-purple-500 hover:text-purple-400 text-sm font-bold"
                >
                  Create your first package
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-card rounded-[40px] border border-white/10 p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-black tracking-tight uppercase">
                  {editingPackage ? 'Edit Package' : 'Add New Package'}
                </h3>
                <p className="text-gray-500 text-sm">Fill in the details below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Package Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="e.g. 1000 Diamonds"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Price (LKR)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Category</label>
                    <select 
                      required
                      value={formData.categoryId}
                      onChange={e => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Badge (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.badge}
                      onChange={e => setFormData({...formData, badge: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="e.g. Most Popular"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Display Order</label>
                    <input 
                      type="number" 
                      required
                      value={formData.displayOrder}
                      onChange={e => setFormData({...formData, displayOrder: Number(e.target.value)})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                      rows={3}
                      placeholder="Package details..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Button Text</label>
                    <input 
                      type="text" 
                      value={formData.buttonText}
                      onChange={e => setFormData({...formData, buttonText: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Status</label>
                    <div className="flex items-center space-x-4 h-[60px]">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, status: 'active'})}
                        className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${formData.status === 'active' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-500'}`}
                      >
                        Active
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, status: 'inactive'})}
                        className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${formData.status === 'inactive' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-500'}`}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl border border-white/10 text-gray-400 font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 rounded-2xl bg-purple-600 text-white font-black uppercase tracking-widest text-xs hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>{editingPackage ? 'Update Package' : 'Create Package'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
