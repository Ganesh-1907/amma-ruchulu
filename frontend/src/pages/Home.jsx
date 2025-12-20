import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from 'framer-motion';
import apiService from '../api/apiService';

// Custom arrow components to fix the prop warnings
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
    aria-label="Previous slide"
  >
    <svg
      className="w-6 h-6 text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
    aria-label="Next slide"
  >
    <svg
      className="w-6 h-6 text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>
);

// Custom dot component
const CustomDot = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-3 h-3 mx-1 rounded-full bg-white opacity-50 hover:opacity-100 transition-opacity duration-200"
    aria-label="Go to slide"
  />
);

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      id: 1,
      name: 'Green Chilli Pickle',
      description: 'Spicy and tangy, our green chilli pickle adds a fiery kick to every meal with its bold, flavorful blend of spices.',
      price: 187,
      image: 'https://cinnamonsnail.com/wp-content/uploads/2023/07/green-chili-pickle-feature.jpg',
      category: 'Green chilli Pickle',
      rating: 4.8,
      reviews: 120
    },
    {
      id: 2,
      name: 'Ginger pickle',
      description: 'Handmade fresh paneer with high protein content.',
      price: 220,
      image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/01/ginger-chutney-allam-chutney.jpg',
      category: 'Ginger pickle',
      rating: 4.9,
      reviews: 85
    },
    {
      id: 3,
      name: 'Chana Methi Pickle',
      description: 'Traditional curd made with pure milk and natural cultures.',
      price: 150,
      image: 'https://cdn.dotpe.in/longtail/store-items/8107508/c43vz1Dn.jpeg',
      category: 'Chana Methi Pickle',
      rating: 4.7,
      reviews: 95
    },
    {
      id: 4,
      name: 'Brinjal Pickle',
      description: '100% pure cow ghee made using traditional methods.',
      price: 250,
      image: 'https://dwarakapickles.com/wp-content/uploads/2022/05/BrinjalPickle-1.png',
      category: 'Brinjal Pickle',
      rating: 4.9,
      reviews: 150
    },
    {
      id: 5,
      name: 'Garlic Pickle',
      description: 'Creamy and rich butter made from fresh cream.',
      price: 180,
      image: 'https://saffronandherbs.com/wp-content/uploads/2024/02/torshi-seer.jpg',
      category: 'Garlic Pickle',
      rating: 4.8,
      reviews: 110
    }
  ]);

  // Comment out the API call for development
  // useEffect(() => {
  //   const fetchFeaturedProducts = async () => {
  //     try {
  //       const response = await apiService.get('/products/featured');
  //       setFeaturedProducts(response.data);
  //       setLoading(false);
  //     } catch (err) {
  //       setError('Failed to load featured products');
  //       setLoading(false);
  //     }
  //   };

  //   fetchFeaturedProducts();
  // }, []);

  // Set loading to false since we're using sample data
  useEffect(() => {
    setLoading(false);
  }, []);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    customPaging: () => <CustomDot />,
    appendDots: dots => (
      <div className="absolute bottom-4 left-0 right-0">
        <ul className="flex justify-center items-center m-0 p-0"> {dots} </ul>
      </div>
    )
  };

  const carouselItems = [
    {
      id: 1,
       title: 'veg-pickles',
      // description: 'Get the freshest pcikles product delivered to your doorstep',
      image: '/images/hero1.jpg',
       buttonText: 'Shop Now',
      // buttonLink: '/products',
    },
    {
      id: 2,
       title: 'Non-veg pickles',
      // description: 'Never run out of your daily essentials with our subscription service',
      image: '/images/Banner/prawn.jpg',
       buttonText: 'Subscribe Now',
      buttonLink: '/subscriptions',
    },
    {
      id: 3,
      title: 'Leaf pickles',
      // description: 'We ensure the highest quality standards for all our products',
      image: '/images/Banner/leafp.jpg',
       buttonText: 'Learn More',
      // buttonLink: '/about',
    },
  ];

  const categories = [
    { 
      id: 1, 
      name: 'Veg Pickles', 
      image: '/images/veg/veg1.jpg', 
      link: '/products' 
    },
     { 
      id: 2, 
      name: 'Non-Veg Pickles', 
     image: '/images/Non-veg/Non-veg1.jpg', 
      link: '/products' 
     },
     { 
       id: 3, 
       name: 'Sweets', 
      image: '/images/Sweets/swt1.jpg', 
       link: '/products' 
    },
     { 
      id: 4, 
      name: 'Hots', 
      image: '/images/Hots/hot1.jpg', 
      link: '/products' 
     },
     { 
       id: 5, 
      name: 'Ingrediants', 
      image: '/images/Ingredients/Ing1.webp', 
      link: '/products' 
    },
    { 
      id: 6, 
      name: 'All Types of Sweets&Hots', 
      image: '/images/All/all.jpg', 
      link: '/products' 
    },
    //  { 
    //   id: 6, 
    //   name: 'All Types of Pickles', 
    //   image: '/images/All/all.jpg', 
    //   link: '/products' 
    // },
  ];
  const farmToHomeImages = [
    {
      id: 1,
      title: 'Pickle preparation',
      description: 'Direct from our Home',
       image: '/public/images/PIC1.webp',
    },
    {
      id: 2,
      title: 'Quality Check',
      description: 'Rigorous quality control',
      image: '/public/images/PIC.webp',
    },
    {
      id: 3,
      title: 'Home Delivery',
      description: 'Fresh at your doorstep',
      image: '/public/images/PDeliveryBoy.jpg',
    },
  ];

  const whyAkshiPoints = [
    {
      id: 1,
      title: 'Premium Quality',
      description: 'We source our dairy products from the finest farms, ensuring the highest quality standards.',
      icon: 'https://cdn-icons-png.freepik.com/256/16146/16146186.png?ga=GA1.1.1693911840.1744959436&semt=ais_hybrid'
    },
    {
      id: 2,
      title: 'Fresh Delivery',
      description: 'Get your dairy products delivered fresh to your doorstep every morning.',
      icon: 'https://cdn-icons-png.freepik.com/256/14090/14090766.png?ga=GA1.1.1693911840.1744959436&semt=ais_hybrid'
    },
    {
      id: 3,
      title: 'Hygienic Packaging',
      description: 'Our products are packed in hygienic, tamper-proof packaging to maintain freshness.',
      icon: 'https://cdn-icons-png.freepik.com/256/10645/10645206.png?ga=GA1.1.1693911840.1744959436&semt=ais_hybrid'
    },
    {
      id: 4,
      title: 'Best Prices',
      description: 'Enjoy competitive prices without compromising on quality.',
      icon: 'https://cdn-icons-png.freepik.com/256/7661/7661944.png?ga=GA1.1.1693911840.1744959436&semt=ais_hybrid'
    }
  ];

  return (
    <div className="min-h-screen pt-2 bg-white">
      {/* Hero Carousel */}
      <div className="relative">
        <Slider {...carouselSettings} className="w-full">
          {carouselItems.map((item) => (
            <div key={item.id} className="relative h-[300px] sm:h-[400px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${item.image})`,
                  // backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* <div className="absolute inset-0 bg-black bg-opacity-40" /> */}
              </div>
              <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
                >
                  {item.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-base sm:text-lg text-white mb-6"
                >
                  {item.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {/* <Link
                    to={item.buttonLink}
                    className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-5 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    {item.buttonText}
                  </Link> */}
                </motion.div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Explore Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center bg-yellow-400 py-2 px-4 rounded-lg inline-block">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:flex sm:overflow-x-auto sm:gap-8 px-4 py-2 sm:scrollbar-hide">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={category.link} 
                className="group sm:flex-none sm:w-[220px]"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-[200px] sm:h-[260px]">
                  <div className="relative h-[140px] sm:h-[180px]">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-2 sm:p-3 text-center bg-white">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Simple and Clear Options */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 mb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 bg-yellow-400 py-2 px-4 rounded-lg inline-block mx-auto block">Simple and Clear Options</h2>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-base font-medium text-gray-800">"Ma Amma Ruchulu Pickles – A Taste of Tradition in Every Bite!"</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-base font-medium text-gray-800">"Ma Amma Ruchulu Pickles – All Types, All Tastes, All Love!"</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-base font-medium text-gray-800">"From Our Home to Yours – Ma Amma Ruchulu Pickles."</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-base font-medium text-gray-800">"Ma Amma Ruchulu – Authentic Pickles, Just Like Mom Makes."</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-base font-medium text-gray-800">"Every Jar, a Flavorful Memory – Ma Amma Ruchulu Pickles."</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-base font-medium text-gray-800">"Andariki Kavalsina Avakaya ikkada ready!"</h3>
                  </div>
                </div>
              </div>
              <div className="hidden md:block p-6">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <img
                      src="/images/veg/veg1.jpg"
                      alt="Veg Pickles"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">Veg Pickles</span>
                    </div>
                  </div>
                  <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <img
                      src="/images/Non-veg/Non-veg1.jpg"
                      alt="Non-Veg Pickles"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">Non-Veg Pickles</span>
                    </div>
                  </div>
                  <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <img
                      src="/images/Sweets/swt1.jpg"
                      alt="Sweets"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">Sweets</span>
                    </div>
                  </div>
                  <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <img
                      src="/images/Hots/hot1.jpg"
                      alt="Hots"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">Hots</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Maa Amma Ruchulu */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-yellow-300 -mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Choose Maa Amma Ruchulu?</h2>
            <p className="text-base text-gray-600">Experience the difference with our premium pickle products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyAkshiPoints.map((point) => (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <img 
                  src={point.icon} 
                  alt={point.title} 
                  className="w-12 h-12 mx-auto mb-3"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{point.title}</h3>
                <p className="text-sm text-gray-600">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* View All Products Button */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            to="/products"
            className="inline-block bg-red-600 hover:bg-primary-700 text-white font-medium py-4 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 