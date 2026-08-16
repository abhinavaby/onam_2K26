import React from 'react';
import Hero from '../components/Hero';

const Home = () => {
  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-12rem)] animate-in fade-in duration-500">
      <Hero />
    </div>
  );
};

export default Home;



