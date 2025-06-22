/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { sampleProducts, sampleStockIn, sampleStockOut } from '../data/sampleData';

export const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState(sampleProducts);
  const [stockIn, setStockIn] = useState(sampleStockIn);
  const [stockOut, setStockOut] = useState(sampleStockOut);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('auth', isAuthenticated);
  }, [isAuthenticated]);

  const addProduct = (product) => {
    setProducts(prev => [...prev, { ...product, id: Date.now() }]);
  };

  const addStockIn = (stock) => {
    setStockIn(prev => [...prev, { ...stock, id: Date.now() }]);
    setProducts(prev => prev.map(p =>
      p.id === stock.productId
        ? { ...p, quantity: p.quantity + stock.quantity }
        : p
    ));
  };

  const addStockOut = (stock) => {
    setStockOut(prev => [...prev, { ...stock, id: Date.now() }]);
    setProducts(prev => prev.map(p =>
      p.id === stock.productId
        ? { ...p, quantity: Math.max(0, p.quantity - stock.quantity) }
        : p
    ));
  };

  const getLowStockItems = () => {
    return products.filter(p => p.quantity <= p.threshold);
  };

  const value = {
    products,
    stockIn,
    stockOut,
    activeTab,
    setActiveTab,
    isAuthenticated,
    setIsAuthenticated,
    addProduct,
    addStockIn,
    addStockOut,
    getLowStockItems
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

 
