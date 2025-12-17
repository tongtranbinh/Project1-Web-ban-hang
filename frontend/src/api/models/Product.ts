export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  image: string;
  alt_text?: string;
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  description: string;
  price: string;
  stock: number;
  sold?: number;
  is_active: boolean;
  cover_image: ProductImage;
  images: ProductImage[]; // Only available on product detail API
  created_at: string;
}

export interface CreateProductImage {
  product_id: string;
  image: File;
  alt_text: string;
  display_order: number;
}

export interface CreateProduct {
  category_id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  is_active: boolean;
}
