// Mock data for products
export const mockProducts = [
  {
    _id: '1',
    name: 'Mango pickle',
    description: 'Traditional mango pickle with authentic spices',
    price: 199,
    unit: '500g jar',
    category: 'Veg pickles',
    image: '/images/categories/veg-pickles/mango-pickle.jpg',
    stock: 50,
    discount: 10,
    rating: 4.5,
    reviews: 120,
    tags: ['spicy', 'traditional', 'homemade'],
    isNewLaunch: true,
    createdAt: '2024-03-15'
  },
  {
    _id: '2',
    name: 'Lemon pickle',
    description: 'Tangy lemon pickle with special spices',
    price: 179,
    unit: '500g jar',
    category: 'Veg pickles',
    image: '/images/categories/veg-pickles/lemon-pickle.jpg',
    stock: 45,
    discount: 5,
    rating: 4.3,
    reviews: 98,
    tags: ['tangy', 'traditional', 'homemade'],
    isNewLaunch: false,
    createdAt: '2024-03-10'
  },
  {
    _id: '3',
    name: 'Chicken pickle',
    description: 'Spicy chicken pickle with authentic taste',
    price: 299,
    unit: '500g jar',
    category: 'Non-veg pickles',
    image: '/images/categories/non-veg-pickles/chicken-pickle.jpg',
    stock: 30,
    discount: 15,
    rating: 4.7,
    reviews: 85,
    tags: ['spicy', 'non-veg', 'homemade'],
    isNewLaunch: true,
    createdAt: '2024-03-12'
  }
];

// Export mock data
export default mockProducts;