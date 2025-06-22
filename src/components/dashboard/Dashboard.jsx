/* eslint-disable no-unused-vars */
import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Package,PackagePlus, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';




const Dashboard = () => {
  const { products, getLowStockItems, stockIn, stockOut } = useInventory();
  
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.sellingPrice), 0);
  const lowStockItems = getLowStockItems();
  const recentStockIn = stockIn.slice(-3);

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: Package, color: 'bg-blue-500' },
    { label: 'Inventory Value', value: `₦${totalValue.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Low Stock Items', value: lowStockItems.length, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Categories', value: [...new Set(products.map(p => p.category))].length, icon: BarChart3, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            Low Stock Alert
          </h3>
          {lowStockItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">All items are well stocked! 🎉</p>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{item.quantity}</p>
                    <p className="text-xs text-gray-500">units left</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Stock In */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <PackagePlus className="w-5 h-5 text-green-500 mr-2" />
            Recent Stock In
          </h3>
          {recentStockIn.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent stock entries</p>
          ) : (
            <div className="space-y-3">
              {recentStockIn.map((stock) => (
                <div key={stock.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{stock.productName}</p>
                    <p className="text-sm text-gray-600">{stock.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">+{stock.quantity}</p>
                    <p className="text-xs text-gray-500">units added</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
