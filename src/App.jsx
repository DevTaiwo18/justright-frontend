import React from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import LoginForm from './components/auth/LoginForm';
import Navigation from './components/layout/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import Products from './components/products/Products';
import StockIn from './components/stock/StockIn';
import StockOut from './components/stock/StockOut';
import Reports from './components/reports/Reports';
import './App.css'; 

const App = () => {
  const { isAuthenticated, activeTab } = useInventory();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'stock-in':
        return <StockIn />;
      case 'stock-out':
        return <StockOut />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {renderActiveComponent()}
      </main>
    </div>
  );
};

// Root Component with Provider
export default function JustRightInventory() {
  return (
    <InventoryProvider>
      <App />
    </InventoryProvider>
  );
}