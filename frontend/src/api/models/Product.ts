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
  alt_text: string;
  display_order: number;
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  is_active: boolean;
  images: ProductImage[];
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
  stock_quantity: number;
  is_active: boolean;
}
