import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Plus, Search, Filter, Loader, Package, X, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Products = () => {
  const { products, addProduct, updateProduct } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    currentStock: '',
    buyingPrice: '',
    sellingPrice: '',
    lowStockThreshold: 5
  });
  const [editProduct, setEditProduct] = useState({
    name: '',
    category: '',
    buyingPrice: '',
    sellingPrice: '',
    lowStockThreshold: 5
  });

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Ensure all required fields are filled
    if (!newProduct.name.trim() || !newProduct.category.trim() || !newProduct.buyingPrice || !newProduct.sellingPrice) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        name: newProduct.name.trim(),
        category: newProduct.category.trim(),
        currentStock: newProduct.currentStock === '' ? 0 : Number(newProduct.currentStock),
        buyingPrice: Number(newProduct.buyingPrice),
        sellingPrice: Number(newProduct.sellingPrice),
        lowStockThreshold: Number(newProduct.lowStockThreshold) || 5
      };

      console.log('Product data being sent:', productData); // Debug log
      
      await addProduct(productData);
      toast.success('Product added successfully!');
      setNewProduct({
        name: '',
        category: '',
        currentStock: '',
        buyingPrice: '',
        sellingPrice: '',
        lowStockThreshold: 5
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Frontend error:', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map(error => error.msg || error.message).join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
      } else {
        toast.error('Failed to add product. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditProduct({
      name: product.name,
      category: product.category,
      buyingPrice: product.buyingPrice,
      sellingPrice: product.sellingPrice,
      lowStockThreshold: product.lowStockThreshold
    });
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProduct(editingProduct._id, {
        ...editProduct,
        buyingPrice: Number(editProduct.buyingPrice),
        sellingPrice: Number(editProduct.sellingPrice),
        lowStockThreshold: Number(editProduct.lowStockThreshold)
      });
      toast.success('Product updated successfully!');
      setShowEditForm(false);
      setEditingProduct(null);
    } catch (err) {
      toast.error('Failed to update product. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const closeModal = (e) => {
      if (e.key === 'Escape') setShowAddForm(false);
    };
    window.addEventListener('keydown', closeModal);
    return () => window.removeEventListener('keydown', closeModal);
  }, []);

  const getStatusColor = (stock, threshold) => {
    if (stock === 0) return 'from-red-500 to-red-600 text-white';
    if (stock <= threshold) return 'from-orange-500 to-orange-600 text-white';
    return 'from-emerald-500 to-emerald-600 text-white';
  };

  const getStatusText = (stock, threshold) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= threshold) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Products
            </h2>
            <p className="text-slate-600 mt-1 font-medium">Manage your inventory products</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
              />
            </div>
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 font-medium hover:bg-slate-100 focus:bg-white min-w-48"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>Showing {filteredProducts.length} of {products.length} products</span>
            {(searchTerm || filterCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Modal */}
        {showAddForm && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-4 min-h-screen w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Add New Product</h3>
                    <p className="text-slate-600">Fill in the essential product details</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      placeholder="Enter category"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Initial Stock (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newProduct.currentStock}
                      onChange={(e) => setNewProduct({ ...newProduct, currentStock: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Low Stock Threshold <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={newProduct.lowStockThreshold}
                      onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      placeholder="5"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Buying Price (₦) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.buyingPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, buyingPrice: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Selling Price (₦) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.sellingPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex-1 flex justify-center items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin w-5 h-5 mr-2" />
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Add Product
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-xl transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditForm && editingProduct && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-4 min-h-screen w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Edit2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Edit Product</h3>
                    <p className="text-slate-600">Update product details</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingProduct(null);
                  }}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={editProduct.category}
                      onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      placeholder="Enter category"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Current Stock
                    </label>
                    <input
                      type="number"
                      value={editingProduct.currentStock}
                      disabled
                      className="w-full px-4 py-3 bg-slate-200 border border-slate-200 rounded-xl text-slate-600 font-medium cursor-not-allowed"
                      placeholder="Use Stock In/Out to change"
                    />
                    <p className="text-xs text-slate-500">Stock levels can only be changed through Stock In/Out transactions</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Low Stock Threshold <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={editProduct.lowStockThreshold}
                      onChange={(e) => setEditProduct({ ...editProduct, lowStockThreshold: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      placeholder="5"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Buying Price (₦) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={editProduct.buyingPrice}
                      onChange={(e) => setEditProduct({ ...editProduct, buyingPrice: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Selling Price (₦) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={editProduct.sellingPrice}
                      onChange={(e) => setEditProduct({ ...editProduct, sellingPrice: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={handleUpdate}
                    className="flex-1 flex justify-center items-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin w-5 h-5 mr-2" />
                        Updating Product...
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-5 h-5 mr-2" />
                        Update Product
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingProduct(null);
                    }}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-xl transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid/Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-blue-100">
                <tr>
                  {['Product', 'Category', 'Stock', 'Buying Price', 'Selling Price', 'Status', 'Actions'].map((col) => (
                    <th key={col} className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium">No matching products found</p>
                        <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id || product.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-900">{product.currentStock ?? 0}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">₦{product.buyingPrice?.toLocaleString() || '0'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">₦{product.sellingPrice?.toLocaleString() || '0'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold bg-gradient-to-r ${getStatusColor(product.currentStock ?? 0, product.lowStockThreshold)} rounded-full`}>
                          {getStatusText(product.currentStock ?? 0, product.lowStockThreshold)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(product)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No matching products found</p>
                <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id || product.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                        <p className="text-sm text-slate-600">{product.category}</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-xs font-bold bg-gradient-to-r ${getStatusColor(product.currentStock ?? 0, product.lowStockThreshold)} rounded-full`}>
                      {getStatusText(product.currentStock ?? 0, product.lowStockThreshold)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Stock:</span>
                      <span className="font-semibold text-slate-900 ml-2">{product.currentStock ?? 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Threshold:</span>
                      <span className="font-semibold text-slate-900 ml-2">{product.lowStockThreshold}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Buy Price:</span>
                      <span className="font-semibold text-slate-900 ml-2">₦{product.buyingPrice?.toLocaleString() || '0'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Sell Price:</span>
                      <span className="font-semibold text-slate-900 ml-2">₦{product.sellingPrice?.toLocaleString() || '0'}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => handleEdit(product)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;