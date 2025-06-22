/* eslint-disable no-unused-vars */
import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Package,
  PackagePlus,
  TrendingUp,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';

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
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      label: 'Inventory Value',
      value: `₦${totalValue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      label: 'Low Stock Items',
      value: lowStockItems.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
    {
      label: 'Categories',
      value: [...new Set(products.map((p) => p.category))].length,
      icon: BarChart3,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color }, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
              </div>
              <div
                className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            Low Stock Alert
          </h3>
          {lowStockItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              All items are well stocked! 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div
                  key={item._id || item.id || index}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      {item.currentStock || item.quantity}
                    </p>
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
    <p className="text-gray-500 text-center py-8">
      No recent stock entries
    </p>
  ) : (
    <div className="space-y-3">
      {recentStockIn.map((stock, index) => {
        const product = products.find(
          (p) => p._id === stock.productId || p.id === stock.productId
        );

        return (
          <div
            key={stock._id || stock.id || index}
            className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-800">
                {product?.name || 'Unknown Product'}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(stock.date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">
                +{stock.quantity}
              </p>
              <p className="text-xs text-gray-500">units added</p>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default Dashboard;
