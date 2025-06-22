/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { TrendingUp, Package, BarChart3, Filter, Calendar, Award, DollarSign, ShoppingCart } from 'lucide-react';

const Reports = () => {
  const { products, stockIn, stockOut } = useInventory();
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('week');

  // Calculate Total Revenue
  const totalRevenue = stockOut.reduce((sum, sale) => {
    const product = products.find(p => p.id === sale.productId || p._id === sale.productId);
    return sum + (product ? sale.quantity * product.sellingPrice : 0);
  }, 0);

  // Calculate Total Profit
  const totalProfit = stockOut.reduce((sum, sale) => {
    const product = products.find(p => p.id === sale.productId || p._id === sale.productId);
    return sum + (product ? sale.quantity * (product.sellingPrice - product.buyingPrice) : 0);
  }, 0);

  // Most Sold Products (by productId)
  const mostSoldMap = stockOut.reduce((acc, sale) => {
    if (!acc[sale.productId]) {
      acc[sale.productId] = { quantity: 0 };
    }
    acc[sale.productId].quantity += sale.quantity;
    return acc;
  }, {});

  const topProducts = Object.entries(mostSoldMap)
    .map(([productId, { quantity }]) => {
      const product = products.find(p => p.id === productId || p._id === productId);
      return { product, quantity };
    })
    .filter(item => item.product)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Reports & Analytics
            </h2>
            <p className="text-slate-600 mt-1 font-medium">Insights and performance metrics</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative group">
              <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 font-medium hover:bg-slate-100 focus:bg-white min-w-48"
              >
                <option value="summary">Summary</option>
                <option value="sales">Sales Report</option>
                <option value="inventory">Inventory Report</option>
              </select>
            </div>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 font-medium hover:bg-slate-100 focus:bg-white min-w-48"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Total Revenue</h3>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-3">₦{totalRevenue.toLocaleString()}</p>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+12% from last period</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Total Profit</h3>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-3">₦{totalProfit.toLocaleString()}</p>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+8% from last period</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Items Sold</h3>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-3">
                  {stockOut.reduce((sum, sale) => sum + sale.quantity, 0)}
                </p>
                <div className="flex items-center text-purple-600">
                  <Package className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Across {products.length} products</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Top Selling Products</h3>
              <p className="text-sm text-slate-600">Best performing items by quantity sold</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No sales recorded yet</p>
                <p className="text-slate-500 text-sm mt-1">Top products will appear here</p>
              </div>
            ) : (
              topProducts.map(({ product, quantity }, index) => {
                const revenue = quantity * product.sellingPrice;
                const rankColors = [
                  'from-yellow-500 to-yellow-600', // Gold
                  'from-slate-400 to-slate-500',   // Silver
                  'from-orange-500 to-orange-600', // Bronze
                  'from-blue-500 to-blue-600',     // Others
                  'from-purple-500 to-purple-600'  // Others
                ];
                
                return (
                  <div key={product._id || product.id || `top-product-${index}`} className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl hover:shadow-md transition-all duration-200 border border-slate-200">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${rankColors[index] || rankColors[3]} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {index + 1}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{product.name}</p>
                          <p className="text-sm text-slate-600">{quantity} units sold</p>
                          {product.packSize && (
                            <p className="text-xs text-slate-500">Pack Size: {product.packSize}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 text-lg">₦{revenue.toLocaleString()}</p>
                      <p className="text-sm text-slate-500">Revenue</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Inventory Status</h3>
              <p className="text-sm text-slate-600">Current stock levels across all products</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => {
              const isLowStock = product.currentStock <= product.lowStockThreshold;
              const stockPercentage = Math.min(
                (product.currentStock / Math.max(product.lowStockThreshold * 3, 1)) * 100,
                100
              );
              
              return (
                <div key={product._id || product.id || `inventory-${product.name}`} className="group bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{product.name}</h4>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      isLowStock 
                        ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' 
                        : 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800'
                    }`}>
                      {isLowStock ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>
                  
                  <p className="text-2xl font-bold text-slate-900 mb-1">{product.currentStock}</p>
                  <p className="text-sm text-slate-600 mb-3">units available</p>
                  
                  <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isLowStock ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      }`}
                      style={{ width: `${stockPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>0</span>
                    <span>Threshold: {product.lowStockThreshold}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;