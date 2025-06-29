/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api'; 

export const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('auth', isAuthenticated);
  }, [isAuthenticated]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  };

  // Fetch data from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, stockInRes, stockOutRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products`, getAuthHeaders()),
          axios.get(`${API_BASE_URL}/stock-in`, getAuthHeaders()),
          axios.get(`${API_BASE_URL}/stock-out`, getAuthHeaders()),
        ]);

        setProducts(productsRes.data.data || []);
        setStockIn(stockInRes.data.data || []);
        setStockOut(stockOutRes.data.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const addProduct = async (product) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/products`, product, getAuthHeaders());
      setProducts((prev) => [...prev, res.data.data]);
    } catch (err) {
      console.error('Error adding product:', err);
      throw err; // Re-throw so components can handle errors
    }
  };

  const updateProduct = async (productId, updateData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/products/${productId}`, updateData, getAuthHeaders());
      setProducts((prev) => prev.map(p => p._id === productId ? res.data.data : p));
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const addStockIn = async (stock) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/stock-in`, stock, getAuthHeaders());
      setStockIn((prev) => [...prev, res.data.data]);

      // Refresh products to get updated stock levels
      const updated = await axios.get(`${API_BASE_URL}/products`, getAuthHeaders());
      setProducts(updated.data.data);
    } catch (err) {
      console.error('Error adding stock-in:', err);
      throw err;
    }
  };

  const addStockOut = async (stock) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/stock-out`, stock, getAuthHeaders());
      setStockOut((prev) => [...prev, res.data.data]);

      // Refresh products to get updated stock levels
      const updated = await axios.get(`${API_BASE_URL}/products`, getAuthHeaders());
      setProducts(updated.data.data);
    } catch (err) {
      console.error('Error adding stock-out:', err);
      throw err;
    }
  };

  const getLowStockItems = () => {
    return products.filter((p) => p.currentStock <= (p.lowStockThreshold || 5));
  };

  // Get dashboard stats (simplified)
  const getDashboardStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/reports/dashboard`, getAuthHeaders());
      return res.data.data;
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      throw err;
    }
  };

  // Get top selling products
  const getTopSellingProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/reports/top-selling`, getAuthHeaders());
      return res.data.data;
    } catch (err) {
      console.error('Error fetching top selling products:', err);
      throw err;
    }
  };

  // Get inventory report
  const getInventoryReport = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/reports/inventory`, getAuthHeaders());
      return res.data;
    } catch (err) {
      console.error('Error fetching inventory report:', err);
      throw err;
    }
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
    updateProduct,
    addStockIn,
    addStockOut,
    getLowStockItems,
    getDashboardStats,
    getTopSellingProducts,
    getInventoryReport,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};