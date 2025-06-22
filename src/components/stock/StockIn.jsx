/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { PackagePlus } from 'lucide-react';
import { format } from 'date-fns';
import { formatISO } from 'date-fns/formatISO';
import { parseISO } from 'date-fns/parseISO';


const StockIn = () => {
  const { products, stockIn, addStockIn } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStock, setNewStock] = useState({
    productId: '',
    quantity: 0,
    date: new Date().toISOString().split('T')[0],
    supplier: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === parseInt(newStock.productId));
    if (product) {
      addStockIn({
        ...newStock,
        productName: product.name,
        quantity: parseInt(newStock.quantity)
      });
      setNewStock({
        productId: '',
        quantity: 0,
        date: new Date().toISOString().split('T')[0],
        supplier: ''
      });
      setShowAddForm(false);
    }
  };

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

      {/* Add Stock Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform animate-pulse">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add New Stock</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product</label>
                <select
                  value={newStock.productId}
                  onChange={(e) => setNewStock({...newStock, productId: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={newStock.quantity}
                  onChange={(e) => setNewStock({...newStock, quantity: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newStock.date}
                  onChange={(e) => setNewStock({...newStock, date: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                <input
                  type="text"
                  value={newStock.supplier}
                  onChange={(e) => setNewStock({...newStock, supplier: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter supplier name"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg"
                >
                  Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all font-semibold"
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
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stockIn.slice().reverse().map((stock, index) => (
                <tr key={stock.id} className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{stock.productName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                      +{stock.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{stock.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{stock.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockIn;