import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { PackageMinus, Loader, Package, X, Calendar, ArrowDown, DollarSign } from 'lucide-react';
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
        productId: product._id,
        productName: product.name,
        quantity: quantityToSell,
        date: newStock.date,
      });

      toast.success(`Sold ${quantityToSell} of ${product.name}`);

      setNewStock({
        productId: '',
        quantity: '',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Stock Out
            </h2>
            <p className="text-slate-600 mt-1 font-medium">Record sales and inventory reductions</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl font-semibold"
          >
            <PackageMinus className="w-5 h-5" />
            <span>Record Sale</span>
          </button>
        </div>

        {/* Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <PackageMinus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Record Sale</h3>
                    <p className="text-slate-600">Remove items from inventory</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <select
                      value={newStock.productId}
                      onChange={(e) => setNewStock({ ...newStock, productId: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product._id} value={String(product._id)}>
                          {product.name} - Available: {product.currentStock || 0}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Quantity Sold <span className="text-red-500">*</span>
                    </label>
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
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                      placeholder="Enter quantity"
                      required = {false}
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="date"
                        value={newStock.date}
                        onChange={(e) => setNewStock({ ...newStock, date: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 font-medium hover:bg-slate-100 focus:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Revenue Preview */}
                {newStock.productId && newStock.quantity > 0 && (
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Expected Revenue</p>
                        <p className="text-lg font-bold text-emerald-600">
                          ₦{(
                            (products.find(p => String(p._id) === newStock.productId)?.sellingPrice || 0) * 
                            parseInt(newStock.quantity || 0)
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex justify-center items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin w-5 h-5 mr-2" />
                        Recording Sale...
                      </>
                    ) : (
                      <>
                        <PackageMinus className="w-5 h-5 mr-2" />
                        Record Sale
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
              </form>
            </div>
          </div>
        )}

        {/* Sales Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <ArrowDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Recent Sales</h3>
                <p className="text-sm text-slate-600">Latest inventory reductions</p>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            {stockOut.length > 0 ? (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {['Product', 'Quantity', 'Date', 'Revenue'].map((heading) => (
                      <th key={heading} className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {stockOut.slice().reverse().map((stock, index) => {
                    const product = typeof stock.product === 'object'
                      ? stock.product
                      : products.find((p) => p._id === stock.productId || p._id === stock.product);
                    const revenue = product ? stock.quantity * (product.sellingPrice || 0) : 0;
                    
                    return (
                      <tr key={stock._id || `${stock.productId}-${index}`} className="hover:bg-blue-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">
                                {product?.name || stock.productName || 'Unknown Product'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 text-sm font-bold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-full">
                            <ArrowDown className="w-4 h-4 mr-1" />
                            -{stock.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {new Date(stock.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                          ₦{revenue.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PackageMinus className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No sales recorded yet</p>
                <p className="text-slate-500 text-sm mt-1">Sales transactions will appear here</p>
              </div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-4 space-y-4">
            {stockOut.length > 0 ? (
              stockOut.slice().reverse().map((stock, index) => {
                const product = typeof stock.product === 'object'
                  ? stock.product
                  : products.find((p) => p._id === stock.productId || p._id === stock.product);
                const revenue = product ? stock.quantity * (product.sellingPrice || 0) : 0;
                
                return (
                  <div key={stock._id || `mobile-${stock.productId}-${index}`} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {product?.name || stock.productName || 'Unknown Product'}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {new Date(stock.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 text-sm font-bold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-full">
                        <ArrowDown className="w-4 h-4 mr-1" />
                        -{stock.quantity}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-slate-500">Revenue:</span>
                      <span className="font-bold text-emerald-600 ml-2">₦{revenue.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PackageMinus className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No sales recorded yet</p>
                <p className="text-slate-500 text-sm mt-1">Sales transactions will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockOut;