
import http from './http';
import type { Product, Category, CreateProduct, CreateProductImage } from './models/Product';

export const productsService = {
  // Products
  getAllProducts: async (params?: { category_id?: string; search?: string; min_price?: number; max_price?: number }) => {
    const qs = new URLSearchParams();
    if (params) {
      if (params.category_id) {
        qs.append('category_id', params.category_id);
      }
      if (params.search) {
        qs.append('search', params.search);
      }
      if (params.min_price !== undefined) {
        qs.append('min_price', params.min_price.toString());
      }
      if (params.max_price !== undefined) {
        qs.append('max_price', params.max_price.toString());
      }
    }
    const response = await http.get<Product[]>('/products/products/' + (qs.toString() ? `?${qs.toString()}` : ''));
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await http.get<Product>(`/products/products/${id}/`);
    return response.data;
  },

  createProduct: async (data: CreateProduct) => {
    const response = await http.post<Product>('/products/products/', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<CreateProduct>) => {
    const response = await http.patch<Product>(`/products/products/${id}/`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    await http.delete(`/products/products/${id}/`);
  },

  // Categories
  getAllCategories: async () => {
    const response = await http.get<Category[]>('/products/categories/');
    return response.data;
  },

  getCategoryById: async (id: string) => {
    const response = await http.get<Category>(`/products/categories/${id}/`);
    return response.data;
  },

  createCategory: async (data: { name: string; description: string }) => {
    const response = await http.post<Category>('/products/categories/', data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<{ name: string; description: string }>) => {
    const response = await http.patch<Category>(`/products/categories/${id}/`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    await http.delete(`/products/categories/${id}/`);
  },
  // Product Images
  getProductImages: async (productId: string) => {
    const response = await http.get(`/products/products/${productId}/images/`);
    return response.data;
  },

  createProductImage: async (data: CreateProductImage) => {
    const formData = new FormData();
    formData.append('product', data.product);
    formData.append('image', data.image);
    const response = await http.post('/products/product-images/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
};
