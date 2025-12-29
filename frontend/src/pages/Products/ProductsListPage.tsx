import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts, useCategories } from '../../api/useProducts';
import { useCart } from '../../api/useOrders';
import type { Product } from '../../api/models/Product';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../../components/Layout';

export default function ProductsListPage() {
  const { products, loading, fetchProducts } = useProducts();
  const { categories } = useCategories();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tempMinPrice, setTempMinPrice] = useState<number>(0);
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(5000000);
  const [showCategories, setShowCategories] = useState<boolean>(true);
  const [showPriceRange, setShowPriceRange] = useState<boolean>(true);

  
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get("category") ?? "");
  const [minPrice, setMinPrice] = useState(() => Number(searchParams.get("min_price") ?? 0));
  const [maxPrice, setMaxPrice] = useState(() => Number(searchParams.get("max_price") ?? 5000000));



  useEffect(() => {
    // Khi URL thay đổi -> cập nhật state filter tương ứng
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const min_price = parseInt(searchParams.get("min_price") || "0", 10);
    const max_price = parseInt(searchParams.get("max_price") || "5000000", 10);
    setSelectedCategory(category);
    setSearchQuery(search);
    setMinPrice(min_price);
    setMaxPrice(max_price);
    setTempMinPrice(min_price);
    setTempMaxPrice(max_price);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts({
      category_id: selectedCategory || "",
      search: searchQuery || "",
      min_price: minPrice > 0 ? minPrice : undefined,
      max_price: maxPrice < 5000000 ? maxPrice : undefined,
    });
  }, [selectedCategory, searchQuery, minPrice, maxPrice]);

  // Khi user thao tác UI -> update URL (không set state filter nữa)
  const updateFilters = (patch: Partial<{search: string; category: string; min_price: number; max_price: number;}>) => {
    const p = new URLSearchParams(searchParams);
    if (patch.search !== undefined) patch.search ? p.set("search", patch.search) : p.delete("search");
    if (patch.category !== undefined) patch.category ? p.set("category", patch.category) : p.delete("category");
    if (patch.min_price !== undefined) patch.min_price > 0 ? p.set("min_price", String(patch.min_price)) : p.delete("min_price");
    if (patch.max_price !== undefined) patch.max_price < 5000000 ? p.set("max_price", String(patch.max_price)) : p.delete("max_price");
    setSearchParams(p, { replace: true });
  };

  useEffect(() => {
    updateFilters({ search: searchQuery, category: selectedCategory, min_price: minPrice, max_price: maxPrice });
  }, [searchQuery, selectedCategory, minPrice, maxPrice]);

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };

  const handleClearAll = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(5000000);
    setTempMinPrice(0);
    setTempMaxPrice(5000000);
  };

  const handleApplyPrice = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <p className="text-gray-600 mt-1">{products.length} products available</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                {/* Filters Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <span className="font-semibold text-gray-900">Categories</span>
                    {showCategories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showCategories && (
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategory === ''}
                          onChange={() => setSelectedCategory('')}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">All Categories</span>
                      </label>
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategory === category.id}
                            onChange={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <button
                    onClick={() => setShowPriceRange(!showPriceRange)}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <span className="font-semibold text-gray-900">Price Range</span>
                    {showPriceRange ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showPriceRange && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div>Minimum Price</div>
                        <input
                          
                          type="range"
                          min="0"
                          max="5000000"
                          step="100000"
                          value={tempMinPrice}  
                          onChange={(e) => setTempMinPrice(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div>Maximum Price</div>

                        <input
                          
                          type="range"
                          min="0"
                          max="5000000"
                          step="100000"
                          value={tempMaxPrice}
                          onChange={(e) => setTempMaxPrice(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{formatPrice(tempMinPrice)}</span>
                        <span className="text-gray-600">{formatPrice(tempMaxPrice)}</span>
                      </div>
                      <button
                        onClick={handleApplyPrice}
                        className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Apply Price
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Search Bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product: Product) => (
                    <div 
                      key={product.id} 
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
                    >
                      {/* Product Image */}
                      <Link to={`/products/${product.id}`}>
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                          {product.cover_image.image ? (
                            <img
                              src={product.cover_image.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              No Image
                            </div>
                          )}
                          {!product.is_active && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                              Out of Stock
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="p-4">
                        <Link to={`/products/${product.id}`}>
                          <h3 className="font-semibold text-sm text-gray-900 hover:text-blue-600 line-clamp-2 mb-2 h-10">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500 mb-3">{product.category.name}</p>
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="px-1 text-lg font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(product.id)}
                            disabled={!product.is_active || product.stock === 0}
                            className="w-8 h-8 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}

