import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { productsService } from './productsApiService';
import type { Product, Category } from './models/Product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const fetchProducts = async (params?: { category_id?: string; search?: string; min_price?: number; max_price?: number }) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching products with params:', params);
      // Gọi 1 lần API - đã bao gồm cover_image từ backend
      const data = await productsService.getAllProducts(params);
      setProducts(data);
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
