/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Plus, Search, Filter, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Products = () => {
  const { products, addProduct } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    packSize: '',
    quantity: 0,
    buyingPrice: 0,
    sellingPrice: 0,
    supplier: '',
    expiryDate: '',
    threshold: 10
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
    try {
      await addProduct({
        ...newProduct,
        currentStock: newProduct.quantity,
        lowStockThreshold: newProduct.threshold,
      });
      toast.success('Product added successfully!');
      setNewProduct({
        name: '',
        category: '',
        packSize: '',
        quantity: 0,
        buyingPrice: 0,
        sellingPrice: 0,
        supplier: '',
        expiryDate: '',
        threshold: 10
      });
      setShowAddForm(false);
    } catch (err) {
      toast.error('Failed to add product. Try again.');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Products</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Product Name', name: 'name', type: 'text' },
                  { label: 'Category', name: 'category', type: 'text' },
                  { label: 'Pack Size', name: 'packSize', type: 'text' },
                  { label: 'Initial Quantity', name: 'quantity', type: 'number' },
                  { label: 'Buying Price (₦)', name: 'buyingPrice', type: 'number' },
                  { label: 'Selling Price (₦)', name: 'sellingPrice', type: 'number' },
                  { label: 'Supplier', name: 'supplier', type: 'text' },
                  { label: 'Low Stock Threshold', name: 'threshold', type: 'number' }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      required
                      type={field.type}
                      value={newProduct[field.name]}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          [field.name]: field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={newProduct.expiryDate}
                  onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex justify-center items-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {loading ? <Loader className="animate-spin w-5 h-5" /> : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Product', 'Category', 'Quantity', 'Buying Price', 'Selling Price', 'Supplier', 'Status'].map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No matching products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">Pack Size: {product.packSize}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-red-900">{product.currentStock ?? 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₦{product.buyingPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₦{product.sellingPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.supplier}</td>
                    <td className="px-6 py-4">
                      {(product.currentStock ?? 0) <= product.lowStockThreshold ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
