import { Link } from 'react-router-dom'
import { useState } from 'react';
import Layout from '../../components/Layout';
import HeroSlider from '../../components/HeroSlider';
import { useCategories } from '../../api/useProducts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './homePage.css';

export default function Home() {
  const { categories, loading } = useCategories();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Lấy tối đa 8 categories để có thể scroll 2 lần (4 categories mỗi lần)
  const displayCategories = categories.slice(0, 8);
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(displayCategories.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentCategories = () => {
    const start = currentSlide * itemsPerSlide;
    return displayCategories.slice(start, start + itemsPerSlide);
  };

  // Mapping cho các category với ảnh
  const getCategoryImage = (name: string) => {
    const lowerName = name.toLowerCase();
    // Sử dụng nguồn ảnh công khai (Picsum) để tránh vấn đề bản quyền
    if (lowerName.includes('laptop')) return 'https://picsum.photos/seed/laptops/800/500';
    if (lowerName.includes('pc') || lowerName.includes('máy tính')) return 'https://picsum.photos/seed/pc/800/500';
    if (lowerName.includes('điện thoại') || lowerName.includes('phone') || lowerName.includes('smartphone')) return 'https://picsum.photos/seed/smartphones/800/500';
    if (lowerName.includes('phụ kiện') || lowerName.includes('accessory')) return 'https://picsum.photos/seed/accessories/800/500';
    if (lowerName.includes('tablet') || lowerName.includes('ipad')) return 'https://picsum.photos/seed/tablet/800/500';
    if (lowerName.includes('watch') || lowerName.includes('đồng hồ')) return 'https://picsum.photos/seed/watch/800/500';
    if (lowerName.includes('tai nghe') || lowerName.includes('headphone') || lowerName.includes('audio')) return 'https://picsum.photos/seed/audio/800/500';
    if (lowerName.includes('chuột') || lowerName.includes('mouse')) return 'https://picsum.photos/seed/mouse/800/500';
    return 'https://picsum.photos/seed/default-category/800/500';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Slider */}
        <div className="max-w-7xl mx-auto px-4 pt-8">
          <HeroSlider />
        </div>

        {/* Categories Slider */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Danh Mục Sản Phẩm</h2>
            <p className="text-gray-600 mt-1">Khám phá các danh mục hàng đầu</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="w-full h-40 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              {/* Navigation Buttons */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}

              {/* Categories Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getCurrentCategories().map((category, index) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}  
                    className="category-card-container"
                  >
                    <div className={`category-card category-card-${index % 4}`}>
                      <div className="category-image">
                        <img 
                          src={getCategoryImage(category.name)} 
                          alt={category.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3E📦%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <div className="category-overlay">
                        <h3 className="category-title">{category.name}</h3>
                        <p className="category-link">Shop Now →</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Dots Indicator */}
              {totalSlides > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
