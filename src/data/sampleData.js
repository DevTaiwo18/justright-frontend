// src/data/sampleData.js

export const sampleProducts = [
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
    quantity: 12,
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
  },
  {
    id: 5,
    name: 'Always Sanitary Pads',
    category: 'Health & Hygiene',
    packSize: '8 pads',
    quantity: 20,
    buyingPrice: 300,
    sellingPrice: 450,
    supplier: 'Procter & Gamble',
    expiryDate: '2026-06-01',
    threshold: 5
  },
  {
    id: 6,
    name: 'Bottled Water 75cl',
    category: 'Beverages',
    packSize: '75cl bottle',
    quantity: 60,
    buyingPrice: 100,
    sellingPrice: 150,
    supplier: 'Nestlé Waters',
    expiryDate: '2025-10-01',
    threshold: 20
  }
];

export const sampleStockIn = [
  {
    id: 1,
    productId: 1,
    productName: 'Coca Cola 35cl',
    quantity: 24,
    date: '2025-06-18',
    supplier: 'Nigerian Bottling Company'
  },
  {
    id: 2,
    productId: 2,
    productName: 'Indomie Noodles',
    quantity: 50,
    date: '2025-06-17',
    supplier: 'Dufil Prima Foods'
  },
  {
    id: 3,
    productId: 3,
    productName: 'Paracetamol Tablets',
    quantity: 20,
    date: '2025-06-15',
    supplier: 'Emzor Pharmaceuticals'
  },
  {
    id: 4,
    productId: 5,
    productName: 'Always Sanitary Pads',
    quantity: 30,
    date: '2025-06-10',
    supplier: 'Procter & Gamble'
  },
  {
    id: 5,
    productId: 6,
    productName: 'Bottled Water 75cl',
    quantity: 100,
    date: '2025-06-05',
    supplier: 'Nestlé Waters'
  }
];

export const sampleStockOut = [
  {
    id: 1,
    productId: 1,
    productName: 'Coca Cola 35cl',
    quantity: 12,
    date: '2025-06-18'
  },
  {
    id: 2,
    productId: 2,
    productName: 'Indomie Noodles',
    quantity: 45,
    date: '2025-06-18'
  },
  {
    id: 3,
    productId: 5,
    productName: 'Always Sanitary Pads',
    quantity: 10,
    date: '2025-06-16'
  },
  {
    id: 4,
    productId: 6,
    productName: 'Bottled Water 75cl',
    quantity: 40,
    date: '2025-06-15'
  },
  {
    id: 5,
    productId: 4,
    productName: 'Peak Milk',
    quantity: 15,
    date: '2025-06-14'
  }
];
