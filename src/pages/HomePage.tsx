import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import CategoryGrid from '../components/Home/CategoryGrid';
import FeaturedProducts from '../components/Home/FeaturedProducts';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
    </div>
  );
};

export default HomePage;