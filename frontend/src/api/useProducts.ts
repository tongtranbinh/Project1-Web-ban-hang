import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { productsService } from './productsApiService';
import type { Product, Category } from './models/Product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const fetchProducts = async (params?: { category?: string; search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching products with params:', params);
      const data = await productsService.searchProducts(params);
      setProducts(data);
        
      for (const product of data) {
        const images = await productsService.getProductImages(product.id);
        //console.log('Fetched images for product', images);
        product.images = images;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Không thể tải danh sách sản phẩm';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return { products, loading, error, fetchProducts };
};

export const useProductDetail = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsService.getProductById(id);
        setProduct(data);
      } catch (err: any) {
        const message = err.response?.data?.message || 'Không thể tải thông tin sản phẩm';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsService.getAllCategories();
      setCategories(data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Không thể tải danh mục';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
};
