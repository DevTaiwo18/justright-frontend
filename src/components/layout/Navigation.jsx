import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Home, Package, PackagePlus, PackageMinus, FileText, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

const Navigation = () => {
  const { activeTab, setActiveTab, setIsAuthenticated } = useInventory();

  const handleLogout = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col space-y-4 p-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Confirm Logout</p>
              <p className="text-xs text-slate-600">Are you sure you want to logout?</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              onClick={closeToast}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
        className: 'custom-toast',
      }
    );
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-400' },
    { id: 'products', label: 'Products', icon: Package, color: 'text-cyan-400' },
    { id: 'stock-in', label: 'Stock In', icon: PackagePlus, color: 'text-emerald-400' },
    { id: 'stock-out', label: 'Stock Out', icon: PackageMinus, color: 'text-orange-400' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'text-purple-400' },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-2xl border-b border-blue-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between py-4">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Just Right
              </h1>
              <p className="text-blue-300 text-sm font-medium">Inventory Management</p>
            </div>
          </div>

          {/* Right Section - Logout */}
          <div className="flex items-center">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600/90 hover:bg-red-600 backdrop-blur-sm px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-red-500/25 group"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="pb-4">
          <div className="flex space-x-1 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 border border-slate-700/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color} group-hover:scale-110 transition-transform duration-200`} />
                  <span className="font-medium text-sm sm:text-base hidden sm:block">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;