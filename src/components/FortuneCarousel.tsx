import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award, Star } from 'lucide-react';

interface CarouselItem {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  popularity?: number;
  tags?: string[];
}

interface FortuneCarouselProps {
  items: CarouselItem[];
  onItemClick: (itemId: string) => void;
  title: string;
  className?: string;
}

const FortuneCarousel: React.FC<FortuneCarouselProps> = ({ 
  items, 
  onItemClick, 
  title,
  className = '' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const carouselRef = useRef<HTMLDivElement>(null);

  // 响应式项目数量
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerView(1);
      else if (width < 1024) setItemsPerView(2);
      else if (width < 1280) setItemsPerView(3);
      else setItemsPerView(4);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // 交集观察器用于动画
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(maxIndex, Math.max(0, index)));
  };

  return (
    <div 
      ref={carouselRef}
      className={`relative ${className} ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Star className="w-6 h-6 text-yellow-400 mr-2" />
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <span className="ml-3 px-3 py-1 bg-purple-600/30 rounded-full text-sm text-purple-200">
            {items.length} 项
          </span>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg bg-purple-800/50 hover:bg-purple-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-purple-600"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="p-2 rounded-lg bg-purple-800/50 hover:bg-purple-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-purple-600"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-xl">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            width: `${(items.length / itemsPerView) * 100}%`
          }}
        >
          {items.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / items.length}%` }}
              >
                <div
                  onClick={() => onItemClick(item.id)}
                  className="group relative bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm rounded-xl p-6 border border-purple-400/20 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-yellow-400/50 h-full"
                >
                  {/* Popularity Badge */}
                  {item.popularity && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-yellow-500/20 px-2 py-1 rounded-full border border-yellow-400/30">
                        <span className="text-xs text-yellow-400 font-semibold flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          {item.popularity}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-r ${item.color} p-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="w-full h-full text-white" />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-yellow-400 transition-colors text-white">
                      {item.title}
                    </h3>
                    <p className="text-purple-200 text-sm leading-relaxed mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {item.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-purple-700/50 rounded-full text-xs text-purple-200 border border-purple-600/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator */}
      {maxIndex > 0 && (
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' 
                  : 'bg-purple-600/50 hover:bg-purple-500/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-4 bg-purple-800/30 rounded-full h-1 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + itemsPerView) / items.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default FortuneCarousel;