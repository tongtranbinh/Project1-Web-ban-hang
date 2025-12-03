
import http from './http';
import type { Product, Category, CreateProduct } from './models/Product';

export const productsService = {
  // Products
  getAllProducts: async (params?: { category?: string; search?: string }) => {
    const response = await http.get<Product[]>('/products/products/', { params });
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
  searchProducts: async (params?: { search?: string; category?: string }) => {
    const response = await http.get<Product[]>('/products/products/search/', {
      params: {
        q : params?.search,
        category_id: params?.category
      },
    });
    return response.data;
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
  }
};
