/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { TrendingUp, Package } from 'lucide-react';


const Reports = () => {
  const { products, stockIn, stockOut } = useInventory();
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('week');

  const totalRevenue = stockOut.reduce((sum, sale) => {
    const product = products.find(p => p.name === sale.productName);
    return sum + (product ? sale.quantity * product.sellingPrice : 0);
  }, 0);

  const totalProfit = stockOut.reduce((sum, sale) => {
    const product = products.find(p => p.name === sale.productName);
    return sum + (product ? sale.quantity * (product.sellingPrice - product.buyingPrice) : 0);
  }, 0);

  const mostSoldProducts = stockOut.reduce((acc, sale) => {
    if (!acc[sale.productName]) {
      acc[sale.productName] = 0;
    }
    acc[sale.productName] += sale.quantity;
    return acc;
  }, {});

  const topProducts = Object.entries(mostSoldProducts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Reports & Analytics</h2>
        <div className="flex space-x-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="summary">Summary</option>
            <option value="sales">Sales Report</option>
            <option value="inventory">Inventory Report</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold opacity-90">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">₦{totalRevenue.toLocaleString()}</p>
          <div className="flex items-center mt-4 text-blue-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+12% from last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold opacity-90">Total Profit</h3>
          <p className="text-3xl font-bold mt-2">₦{totalProfit.toLocaleString()}</p>
          <div className="flex items-center mt-4 text-green-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+8% from last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold opacity-90">Items Sold</h3>
          <p className="text-3xl font-bold mt-2">{stockOut.reduce((sum, sale) => sum + sale.quantity, 0)}</p>
          <div className="flex items-center mt-4 text-purple-100">
            <Package className="w-4 h-4 mr-1" />
            <span className="text-sm">Across {products.length} products</span>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Top Selling Products</h3>
        <div className="space-y-4">
          {topProducts.map(([productName, quantity], index) => {
            const product = products.find(p => p.name === productName);
            const revenue = product ? quantity * product.sellingPrice : 0;
            return (
              <div key={productName} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{productName}</p>
                    <p className="text-sm text-gray-600">{quantity} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₦{revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inventory Status */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Inventory Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{product.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.quantity <= product.threshold 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.quantity <= product.threshold ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{product.quantity}</p>
              <p className="text-sm text-gray-500">units available</p>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    product.quantity <= product.threshold ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((product.quantity / (product.threshold * 3)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;