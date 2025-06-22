import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { PackagePlus, PackageMinus } from 'lucide-react';


const StockOut = () => {
  const { products, stockOut, addStockOut } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStock, setNewStock] = useState({
    productId: '',
    quantity: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === parseInt(newStock.productId));
    if (product && product.quantity >= parseInt(newStock.quantity)) {
      addStockOut({
        ...newStock,
        productName: product.name,
        quantity: parseInt(newStock.quantity)
      });
      setNewStock({
        productId: '',
        quantity: 0,
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
    } else {
      alert('Insufficient stock available!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Stock Out (Sales)</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <PackageMinus className="w-5 h-5" />
          <span>Record Sale</span>
        </button>
      </div>

      {/* Add Stock Out Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Record Sale</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product</label>
                <select
                  value={newStock.productId}
                  onChange={(e) => setNewStock({...newStock, productId: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Product</option>
                  {products.filter(p => p.quantity > 0).map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Available: {product.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity Sold</label>
                <input
                  type="number"
                  value={newStock.quantity}
                  onChange={(e) => setNewStock({...newStock, quantity: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                  min="1"
                  max={newStock.productId ? products.find(p => p.id === parseInt(newStock.productId))?.quantity || 0 : 0}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newStock.date}
                  onChange={(e) => setNewStock({...newStock, date: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-lg"
                >
                  Record Sale
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

      {/* Sales Records */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-orange-100">
          <h3 className="text-lg font-semibold text-gray-800">Recent Sales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stockOut.slice().reverse().map((stock) => {
                const product = products.find(p => p.name === stock.productName);
                const revenue = product ? stock.quantity * product.sellingPrice : 0;
                return (
                  <tr key={stock.id} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{stock.productName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded-full">
                        -{stock.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{stock.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ₦{revenue.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockOut;