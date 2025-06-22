import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { PackageMinus, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StockOut = () => {
  const { products, stockOut, addStockOut } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newStock, setNewStock] = useState({
    productId: '',
    quantity: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = products.find((p) => String(p._id) === newStock.productId);
    const quantityToSell = parseInt(newStock.quantity);

    if (!product) return toast.error('Selected product not found');
    if (quantityToSell <= 0) return toast.warning('Quantity must be greater than zero');
    if (product.currentStock < quantityToSell) return toast.error('Insufficient stock available');

    try {
      setLoading(true);
      await addStockOut({
        product: product._id,
        productId: product._id, // Add this
        productName: product.name, // Add this
        quantity: quantityToSell,
        date: newStock.date,
      });

      toast.success(`Sold ${quantityToSell} of ${product.name}`);

      setNewStock({
        productId: '',
        quantity: 0,
        date: new Date().toISOString().split('T')[0],
      });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to record sale');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') setShowAddForm(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Stock Out (Sales)</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <PackageMinus className="w-5 h-5" />
          <span>Record Sale</span>
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">Record Sale</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product</label>
                <select
                  value={newStock.productId}
                  onChange={(e) => setNewStock({ ...newStock, productId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product._id} value={String(product._id)}>
                      {product.name} (Available: {product.currentStock || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity Sold</label>
                <input
                  type="number"
                  value={newStock.quantity}
                  onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                  min="1"
                  max={
                    newStock.productId
                      ? products.find((p) => String(p._id) === newStock.productId)?.currentStock || 0
                      : 0
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newStock.date}
                  onChange={(e) => setNewStock({ ...newStock, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl flex justify-center items-center hover:from-orange-600 hover:to-red-600"
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Record Sale'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 rounded-xl hover:from-gray-500 hover:to-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sales Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-orange-100">
          <h3 className="text-lg font-semibold text-gray-800">Recent Sales</h3>
        </div>
        <div className="overflow-x-auto">
          {stockOut.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stockOut.slice().reverse().map((stock, index) => {
                  const product = typeof stock.product === 'object'
                    ? stock.product
                    : products.find((p) => p._id === stock.productId || p._id === stock.product);
                  const revenue = product ? stock.quantity * (product.sellingPrice || 0) : 0;
                  return (
                    <tr key={stock._id || `${stock.productId}-${index}`} className="hover:bg-orange-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {product?.name || stock.productName || 'Unknown Product'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded-full">
                          -{stock.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(stock.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        ₦{revenue.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 py-10 text-sm">
              No sales recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockOut;
