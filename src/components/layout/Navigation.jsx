import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Home, Package, PackagePlus, PackageMinus, FileText, Bell, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

const Navigation = () => {
  const { activeTab, setActiveTab, setIsAuthenticated, getLowStockItems } = useInventory();
  const lowStockCount = getLowStockItems().length;

  const handleLogout = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium">Are you sure you want to logout?</p>
          <div className="flex justify-end gap-2">
            <button
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded"
              onClick={closeToast}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.setItem('auth', 'false');
                setIsAuthenticated(false);
                closeToast();
                toast.success('Logged out successfully');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'stock-in', label: 'Stock In', icon: PackagePlus },
    { id: 'stock-out', label: 'Stock Out', icon: PackageMinus },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <nav className="bg-blue-900 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-green-400" />
          <div>
            <h1 className="text-xl font-bold">Just Right</h1>
            <p className="text-blue-300 text-sm">Inventory Tracker</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {lowStockCount > 0 && (
            <div className="relative">
              <Bell className="w-6 h-6 text-yellow-400" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {lowStockCount}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
