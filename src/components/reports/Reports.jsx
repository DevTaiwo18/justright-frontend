import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { TrendingUp, Package, BarChart3, Award, DollarSign, ShoppingCart, AlertTriangle } from 'lucide-react';

const Reports = () => {
  const { products, stockOut, getLowStockItems } = useInventory();
  const [reportType, setReportType] = useState('summary');

  const totalRevenue = stockOut.reduce((sum, sale) => {
    const productId = typeof sale.product === 'object' ? sale.product._id : sale.product;
    const product = products.find(p => String(p._id) === String(productId));
    
    if (product && product.sellingPrice && sale.quantity) {
      return sum + (sale.quantity * product.sellingPrice);
    }
    return sum;
  }, 0);

  const totalProfit = stockOut.reduce((sum, sale) => {
    const productId = typeof sale.product === 'object' ? sale.product._id : sale.product;
    const product = products.find(p => String(p._id) === String(productId));
    
    if (product && product.sellingPrice && product.buyingPrice && sale.quantity) {
      const profitPerUnit = product.sellingPrice - product.buyingPrice;
      const totalProfitFromSale = sale.quantity * profitPerUnit;
      return sum + totalProfitFromSale;
    }
    return sum;
  }, 0);

  const totalItemsSold = stockOut.reduce((sum, sale) => {
    return sum + (sale.quantity || 0);
  }, 0);

  const totalStockValue = products.reduce((sum, product) => {
    if (product.currentStock && product.buyingPrice) {
      return sum + (product.currentStock * product.buyingPrice);
    }
    return sum;
  }, 0);

  const productSales = {};
  stockOut.forEach(sale => {
    const productId = typeof sale.product === 'object' ? sale.product._id : sale.product;
    if (!productSales[productId]) {
      productSales[productId] = { quantity: 0, revenue: 0 };
    }
    productSales[productId].quantity += sale.quantity;
    
    const product = typeof sale.product === 'object' 
      ? sale.product 
      : products.find(p => String(p._id) === String(productId));
    if (product) {
      productSales[productId].revenue += sale.quantity * product.sellingPrice;
      productSales[productId].name = product.name;
      productSales[productId].category = product.category;
    }
  });

  const topProducts = Object.entries(productSales)
    .map(([id, data]) => ({ id, ...data }))
    .filter(item => item.name)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const lowStockItems = getLowStockItems?.() || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Business Reports
            </h2>
            <p className="text-slate-600 mt-1 font-medium">Simple overview of your business performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 font-medium hover:bg-slate-100 focus:bg-white min-w-48"
              >
                <option value="summary">Business Summary</option>
                <option value="inventory">Stock Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Total Sales</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-2">₦{totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-slate-600">From {stockOut.length} transactions</p>
            </div>
          </div>

          <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Total Profit</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-2">₦{totalProfit.toLocaleString()}</p>
              <p className="text-sm text-slate-600">Your earnings</p>
            </div>
          </div>

          <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Items Sold</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-2">{totalItemsSold}</p>
              <p className="text-sm text-slate-600">Total units sold</p>
            </div>
          </div>

          <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Stock Value</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-2">₦{totalStockValue.toLocaleString()}</p>
              <p className="text-sm text-slate-600">Total inventory worth</p>
            </div>
          </div>
        </div>

        {reportType === 'summary' && (
          <>
            {/* Top Selling Products */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Best Selling Products</h3>
                  <p className="text-sm text-slate-600">Your top 5 products by sales volume</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {topProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium">No sales recorded yet</p>
                    <p className="text-slate-500 text-sm mt-1">Start making sales to see your top products</p>
                  </div>
                ) : (
                  topProducts.map((item, index) => {
                    const rankColors = [
                      'from-yellow-500 to-yellow-600', // Gold
                      'from-slate-400 to-slate-500',   // Silver
                      'from-orange-500 to-orange-600', // Bronze
                      'from-blue-500 to-blue-600',     // Others
                      'from-purple-500 to-purple-600'  // Others
                    ];
                    
                    return (
                      <div key={item.id || `top-product-${index}`} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${rankColors[index] || rankColors[3]} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                            {index + 1}
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{item.name}</p>
                              <p className="text-sm text-slate-600">{item.quantity} units sold</p>
                              <p className="text-xs text-slate-500">{item.category}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600 text-lg">₦{item.revenue.toLocaleString()}</p>
                          <p className="text-sm text-slate-500">Revenue</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Low Stock Alert</h3>
                  <p className="text-sm text-slate-600">Products that need restocking</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {lowStockItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-emerald-600" />
                    </div>
                    <p className="text-slate-600 font-medium">All products are well stocked!</p>
                    <p className="text-slate-500 text-sm mt-1">Great job managing your inventory</p>
                  </div>
                ) : (
                  lowStockItems.map((item, index) => (
                    <div key={item._id || index} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-l-4 border-red-500">
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">{item.currentStock}</p>
                        <p className="text-xs text-slate-500">units left</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Inventory Status */}
        {reportType === 'inventory' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">All Products Stock Status</h3>
                <p className="text-sm text-slate-600">Current stock levels for all your products</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => {
                const isLowStock = product.currentStock <= product.lowStockThreshold;
                
                return (
                  <div key={product._id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">{product.name}</h4>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        product.currentStock === 0
                          ? 'bg-red-100 text-red-800'
                          : isLowStock 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {product.currentStock === 0 ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>
                    
                    <p className="text-2xl font-bold text-slate-900 mb-1">{product.currentStock}</p>
                    <p className="text-sm text-slate-600 mb-2">units available</p>
                    <p className="text-xs text-slate-500">Category: {product.category}</p>
                    <p className="text-xs text-slate-500">Alert when below: {product.lowStockThreshold}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;