/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, createContext, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle, 
  Search, 
  Filter, 
  BarChart3, 
  LogOut, 
  Eye, 
  EyeOff,
  Home,
  PackagePlus,
  PackageMinus,
  FileText,
  Bell
} from 'lucide-react';

// Context for global state management
const InventoryContext = createContext();

const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};

// Sample data for demonstration
const sampleProducts = [
  {
    id: 1,
    name: 'Coca Cola 35cl',
    category: 'Beverages',
    packSize: '35cl bottle',
    quantity: 48,
    buyingPrice: 150,
    sellingPrice: 200,
    supplier: 'Nigerian Bottling Company',
    expiryDate: '2025-12-31',
    threshold: 10
  },
  {
    id: 2,
    name: 'Indomie Noodles',
    category: 'Food',
    packSize: '70g pack',
    quantity: 5,
    buyingPrice: 80,
    sellingPrice: 120,
    supplier: 'Dufil Prima Foods',
    expiryDate: '2025-08-15',
    threshold: 15
  },
  {
    id: 3,
    name: 'Paracetamol Tablets',
    category: 'Drugs',
    packSize: '100 tablets',
    quantity: 25,
    buyingPrice: 450,
    sellingPrice: 600,
    supplier: 'Emzor Pharmaceuticals',
    expiryDate: '2026-03-20',
    threshold: 8
  },
  {
    id: 4,
    name: 'Peak Milk',
    category: 'Food',
    packSize: '400g tin',
    quantity: 32,
    buyingPrice: 520,
    sellingPrice: 680,
    supplier: 'FrieslandCampina',
    expiryDate: '2025-11-30',
    threshold: 12
  }
];

const sampleStockIn = [
  { id: 1, productId: 1, productName: 'Coca Cola 35cl', quantity: 24, date: '2025-06-18', supplier: 'Nigerian Bottling Company' },
  { id: 2, productId: 2, productName: 'Indomie Noodles', quantity: 50, date: '2025-06-17', supplier: 'Dufil Prima Foods' }
];

const sampleStockOut = [
  { id: 1, productId: 1, productName: 'Coca Cola 35cl', quantity: 12, date: '2025-06-18' },
  { id: 2, productId: 2, productName: 'Indomie Noodles', quantity: 45, date: '2025-06-18' }
];

// Provider component
const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState(sampleProducts);
  const [stockIn, setStockIn] = useState(sampleStockIn);
  const [stockOut, setStockOut] = useState(sampleStockOut);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const addProduct = (product) => {
    setProducts(prev => [...prev, { ...product, id: Date.now() }]);
  };

  const addStockIn = (stock) => {
    setStockIn(prev => [...prev, { ...stock, id: Date.now() }]);
    // Update product quantity
    setProducts(prev => prev.map(p => 
      p.id === stock.productId 
        ? { ...p, quantity: p.quantity + stock.quantity }
        : p
    ));
  };

  const addStockOut = (stock) => {
    setStockOut(prev => [...prev, { ...stock, id: Date.now() }]);
    // Update product quantity
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

export { InventoryProvider, useInventory, sampleProducts, sampleStockIn, sampleStockOut };
export const icons = {
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  BarChart3,
  LogOut,
  Eye,
  EyeOff,
  Home,
  PackagePlus: PackagePlus,
  PackageMinus: PackageMinus,
  FileText: FileText,
  Bell: Bell
};
