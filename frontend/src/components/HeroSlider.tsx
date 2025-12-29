import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

export default function HeroSlider() {
  const slides: SlideItem[] = useMemo(
    () => [
      {
        id: 1,
        title: 'Khám phá bộ sưu tập laptop mới',
        subtitle: 'Chọn mẫu máy hiệu năng cao, giá tốt và nhiều ưu đãi sẵn có.',
        image:
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80',
      },
      {
        id: 2,
        title: 'Tai nghe chuẩn hi-end, âm thanh sống động',
        subtitle: 'Đắm chìm trong từng giai điệu với độ chi tiết và độ êm ái cao.',
        image:
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1600&q=80',
      },
      {
        id: 3,
        title: 'Phong cách và tiện ích mỗi ngày',
        subtitle: 'Phối đồ cùng phụ kiện thời trang và công nghệ hiện đại.',

        image:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
      },
    ],
    [],
  );

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goTo = (index: number) => {
    setCurrent((index + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[420px] sm:h-[520px] bg-gray-900 overflow-hidden rounded-2xl shadow-xl">
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.6) 100%), url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="relative h-full max-w-6xl mx-auto px-6 sm:px-10 flex flex-col justify-center text-white z-20">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg text-white/85">
                {slide.subtitle}
              </p>
              <div className="flex items-center space-x-3">
                <Link
                  to='/products'
                  className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Mua hàng ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 z-10 pointer-events-none">
        <button
          type="button"
          aria-label="Slide prev"
          onClick={() => goTo(current - 1)}
          className="p-2 sm:p-3 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors pointer-events-auto"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          type="button"
          aria-label="Slide next"
          onClick={() => goTo(current + 1)}
          className="p-2 sm:p-3 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors pointer-events-auto"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => goTo(idx)}
            className={`h-2.5 rounded-full transition-all ${
              current === idx ? 'w-7 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
