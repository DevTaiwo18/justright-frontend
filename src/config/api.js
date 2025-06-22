const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
export default API_BASE_URL;
// API Endpoints:
//    - POST /api/auth/login - Login
//    - GET /api/auth/profile - Get user profile
//    - GET /api/products - Get all products
//    - POST /api/products - Create product
//    - GET /api/products/low-stock - Get low stock products
//    - POST /api/stock-in - Add stock
//    - POST /api/stock-out - Record sale
//    - POST /api/stock-out/batch - Record multiple sales
//    - GET /api/reports/dashboard - Dashboard stats
//    - GET /api/reports/sales - Sales report
//    - GET /api/reports/top-selling - Top selling products
//    - GET /api/reports/inventory - Inventory report