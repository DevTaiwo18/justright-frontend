/* eslint-disable no-unused-vars */
import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Package, PackagePlus, TrendingUp, AlertTriangle, BarChart3, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

const Dashboard = () => {
  const { products, getLowStockItems, stockIn, stockOut } = useInventory();

  const totalProducts = products?.length || 0;

  const totalValue = products.reduce((sum, p) => {
    const quantity = Number(p.currentStock || p.quantity) || 0;
    const price = Number(p.sellingPrice) || 0;
    return sum + quantity * price;
  }, 0);

  const lowStockItems = getLowStockItems?.() || [];

  const recentStockIn = [...stockIn]
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB - dateA; 
      }
      
      return (b._id || '').localeCompare(a._id || '');
    })
    .slice(0, 3);

  const stats = [
    { 
      label: 'Total Products', 
      value: totalProducts, 
      icon: Package, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500'
    },
    { 
      label: 'Inventory Value', 
      value: `₦${totalValue.toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-500'
    },
    { 
      label: 'Low Stock Items', 
      value: lowStockItems.length, 
      icon: AlertTriangle, 
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      iconBg: 'bg-red-500'
    },
    { 
      label: 'Categories', 
      value: [...new Set(products.map((p) => p.category))].length, 
      icon: BarChart3, 
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'from-cyan-50 to-cyan-100',
      iconBg: 'bg-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-slate-600 mt-1 font-medium">Welcome back! Here's your inventory overview</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0 text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-xl">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-white/20 hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2 group-hover:text-slate-900 transition-colors">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-14 h-14 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Low Stock Alert */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                Low Stock Alert
              </h3>
              {lowStockItems.length > 0 && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {lowStockItems.length} items
                </span>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {lowStockItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-slate-600 font-medium">All items are well stocked!</p>
                  <p className="text-slate-500 text-sm mt-1">🎉 Great inventory management!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockItems.map((item, index) => (
                    <div key={item._id || item.id || index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-l-4 border-red-500 hover:shadow-md transition-all duration-200">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 group-hover:text-red-700 transition-colors">{item.name}</p>
                        <p className="text-sm text-slate-600 mt-1">{item.category}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-red-600">{item.currentStock || item.quantity}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">units left</p>
                        </div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Stock In */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <PackagePlus className="w-5 h-5 text-white" />
                </div>
                Recent Stock In
              </h3>
              {recentStockIn.length > 0 && (
                <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {recentStockIn.length} entries
                </span>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {recentStockIn.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PackagePlus className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">No recent stock entries</p>
                  <p className="text-slate-500 text-sm mt-1">Stock movements will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentStockIn.map((stock, index) => {
                    // Since stock.product is already a full product object, use it directly
                    const product = typeof stock.product === 'object' && stock.product 
                      ? stock.product 
                      : products.find(
                          (p) => String(p._id) === String(stock.product) || 
                                 String(p._id) === String(stock.productId) || 
                                 String(p.id) === String(stock.product) || 
                                 String(p.id) === String(stock.productId)
                        );

                    return (
                      <div key={stock._id || stock.id || index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl hover:shadow-md transition-all duration-200">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                            {product?.name || stock.productName || 'Unknown Product'}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {new Date(stock.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-600 flex items-center">
                              <ArrowUp className="w-5 h-5 mr-1" />
                              {stock.quantity}
                            </p>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">units added</p>
                          </div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;