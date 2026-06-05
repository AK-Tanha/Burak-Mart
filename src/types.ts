/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For discount presentation
  image: string;
  category: string;
  rating: number;
  reviews: Review[];
  stock: number;
  sizes?: string[];
  colors?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  salesCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingDetails: ShippingDetails;
  shippingMethod: 'standard' | 'express';
  shippingCost: number;
  paymentMethod: 'cod'; // Cash on Delivery
  couponCode?: string;
  discountAmount: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  trackingNumber: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  isActive: boolean;
}

export type AppView = 'home' | 'catalog' | 'product' | 'cart' | 'checkout' | 'order-tracking' | 'admin';
