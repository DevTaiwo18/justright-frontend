/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { PackagePlus, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StockIn = () => {
  const { products, stockIn, addStockIn } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newStock, setNewStock] = useState({
    productId: '',
    quantity: 0,
    date: new Date().toISOString().split('T')[0],
    supplier: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = products.find(p => String(p._id) === newStock.productId);

    if (product) {
      try {
        setLoading(true);

        // ✅ Correct backend-compatible payload
        await addStockIn({
          product: newStock.productId,
          quantity: parseInt(newStock.quantity),
          date: newStock.date,
          supplier: newStock.supplier
        });

        toast.success(`Stock added for ${product.name}`);
        setNewStock({
          productId: '',
          quantity: 0,
          date: new Date().toISOString().split('T')[0],
          supplier: ''
        });
        setShowAddForm(false);
      } catch (error) {
        toast.error('Failed to add stock. Try again.');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Invalid product selected.');
    }
  };

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') setShowAddForm(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Stock In</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <PackagePlus className="w-5 h-5" />
          <span>Add Stock</span>
        </button>
      </div>

      {/* Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add New Stock</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product</label>
                <select
                  value={newStock.productId}
                  onChange={(e) => setNewStock({ ...newStock, productId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id || product._id} value={String(product.id || product._id)}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={newStock.quantity}
                  onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newStock.date}
                  onChange={(e) => setNewStock({ ...newStock, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                <input
                  type="text"
                  value={newStock.supplier}
                  onChange={(e) => setNewStock({ ...newStock, supplier: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter supplier name" required
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 font-semibold flex items-center justify-center"
                >
                  {loading ? <Loader className="animate-spin w-5 h-5" /> : 'Add Stock'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 rounded-xl hover:from-gray-500 hover:to-gray-600 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Entries */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
          <h3 className="text-lg font-semibold text-gray-800">Recent Stock Entries</h3>
        </div>
        <div className="overflow-x-auto">
          {stockIn.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Product', 'Quantity', 'Date', 'Supplier'].map((heading) => (
                    <th key={heading} className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stockIn.slice().reverse().map((stock, index) => (
                  <tr key={stock._id || `${stock.product?.name}-${index}`} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{stock.product?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                        +{stock.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(stock.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{stock.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 py-10 text-sm">
              No stock-in records available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockIn;
