'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Coupon, AppView, ShippingDetails, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data/initialProducts';

export type AppPortal = 'store' | 'admin' | 'customer' | 'login';

interface AppContextType {
  products: Product[];
  coupons: Coupon[];
  cart: CartItem[];
  orders: Order[];
  currentView: AppView;
  currentPortal: AppPortal;
  selectedProductId: string | null;
  activeOrderTrackingId: string | null;
  adminPasswordVerified: boolean;
  
  // Navigation
  setView: (view: AppView) => void;
  setPortal: (portal: AppPortal) => void;
  setSelectedProductId: (id: string | null) => void;
  setActiveOrderTrackingId: (id: string | null) => void;
  setAdminPasswordVerified: (verified: boolean) => void;

  // Shopping Actions
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  
  // Checkout & Ordering
  applyCoupon: (code: string) => { success: boolean; message: string; discount?: number };
  activeCoupon: Coupon | null;
  placeOrder: (shippingDetails: ShippingDetails, shippingMethod: 'standard' | 'express') => Order | null;

  // Review Actions
  addProductReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;

  // Admin Actions
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews' | 'salesCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to pre-seed some initial mock orders so the admin dashboard looks professional immediately
const getInitialOrders = (): Order[] => {
  // Pre-seed 3 past orders
  const sampleOrders: Order[] = [
    {
      id: 'BM-84920',
      trackingNumber: 'TRK-STAND-84920',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      items: [
        {
          product: INITIAL_PRODUCTS[0], // Hoodie
          quantity: 1,
          selectedSize: 'L',
          selectedColor: 'Midnight Black'
        },
        {
          product: INITIAL_PRODUCTS[3], // Backpack
          quantity: 1,
          selectedSize: 'One Size',
          selectedColor: 'Charcoal Black'
        }
      ],
      shippingDetails: {
        fullName: 'Burak Erdogan',
        email: 'burak@example.com',
        phone: '+90 555 123 4567',
        address: 'Harbiye Mah. Vali Konagi Cad. No:12',
        city: 'Istanbul',
        postalCode: '34367',
        notes: 'Leave with complex concierge if not home.'
      },
      shippingMethod: 'standard',
      shippingCost: 0, // Above $50 is free
      subtotal: 124.00,
      discountAmount: 10, // BURAK10 used
      couponCode: 'BURAK10',
      total: 114.00,
      status: 'delivered',
      paymentMethod: 'cod'
    },
    {
      id: 'BM-29381',
      trackingNumber: 'TRK-EXP-29381',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // yesterday
      items: [
        {
          product: INITIAL_PRODUCTS[1], // Watch
          quantity: 1,
          selectedSize: 'One Size',
          selectedColor: 'Royal Silver'
        }
      ],
      shippingDetails: {
        fullName: 'Zeynep Ay',
        email: 'zeynep.ay@gmail.com',
        phone: '+90 532 987 6543',
        address: 'Bebek Jojos Cad. No: 45 Daire: 3',
        city: 'Istanbul',
        postalCode: '34342'
      },
      shippingMethod: 'express',
      shippingCost: 9.99,
      subtotal: 89.00,
      discountAmount: 0,
      total: 98.99,
      status: 'shipped',
      paymentMethod: 'cod'
    },
    {
      id: 'BM-10398',
      trackingNumber: 'TRK-STAND-10398',
      createdAt: new Date().toISOString(), // today
      items: [
        {
          product: INITIAL_PRODUCTS[4], // Sneakers
          quantity: 2,
          selectedSize: '10',
          selectedColor: 'Cloud White'
        }
      ],
      shippingDetails: {
        fullName: 'Can Yaman',
        email: 'can.yaman@outlook.com',
        phone: '+90 505 444 3322',
        address: 'Cankaya Mah. Ataturk Bulvari No: 180',
        city: 'Ankara',
        postalCode: '06680'
      },
      shippingMethod: 'standard',
      shippingCost: 0,
      subtotal: 118.00,
      discountAmount: 11.80, // BURAK10 coupon (10%)
      couponCode: 'BURAK10',
      total: 106.20,
      status: 'confirmed',
      paymentMethod: 'cod'
    }
  ];

  return sampleOrders;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Loading states from local storage with defaults
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentView, setView] = useState<AppView>('home');
  const [currentPortal, setPortal] = useState<AppPortal>('store');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeOrderTrackingId, setActiveOrderTrackingId] = useState<string | null>(null);
  const [adminPasswordVerified, setAdminPasswordVerified] = useState<boolean>(false);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // Load state on mount (Client-only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedProducts = localStorage.getItem('burak_mart_products');
        if (storedProducts) setProducts(JSON.parse(storedProducts));

        const storedCoupons = localStorage.getItem('burak_mart_coupons');
        if (storedCoupons) setCoupons(JSON.parse(storedCoupons));

        const storedCart = localStorage.getItem('burak_mart_cart');
        if (storedCart) setCart(JSON.parse(storedCart));

        const storedOrders = localStorage.getItem('burak_mart_orders');
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        } else {
          const sampleOrders = getInitialOrders();
          setOrders(sampleOrders);
          localStorage.setItem('burak_mart_orders', JSON.stringify(sampleOrders));
        }
      } catch (e) {
        console.error("Error loading localStorage context:", e);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Synchronizers (only run after state is successfully loaded from localStorage)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('burak_mart_products', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('burak_mart_coupons', JSON.stringify(coupons));
    }
  }, [coupons, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('burak_mart_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('burak_mart_orders', JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  // Cart operations
  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  // Checkout operations
  const applyCoupon = (code: string) => {
    const formattedCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === formattedCode && c.isActive);

    if (!coupon) {
      return { success: false, message: 'Invalid or inactive promo code.' };
    }

    const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Min spend of $${coupon.minSpend.toFixed(2)} required for this code.`
      };
    }

    setActiveCoupon(coupon);

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    return {
      success: true,
      message: `Coupon "${coupon.code}" successfully applied!`,
      discount
    };
  };

  const placeOrder = (shippingDetails: ShippingDetails, shippingMethod: 'standard' | 'express') => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const hasDiscount = activeCoupon;
    
    let discountAmount = 0;
    if (activeCoupon) {
      if (activeCoupon.discountType === 'percentage') {
        discountAmount = (subtotal * activeCoupon.value) / 100;
      } else {
        discountAmount = activeCoupon.value;
      }
    }

    // Free delivery on standard shipping if subtotal is over $50
    const shippingCost = shippingMethod === 'express' ? 9.99 : subtotal >= 50.00 ? 0.00 : 5.99;
    const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

    const suffix = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: `BM-${suffix}`,
      trackingNumber: `TRK-${shippingMethod === 'express' ? 'EXP' : 'STAND'}-${suffix}`,
      items: [...cart],
      shippingDetails,
      shippingMethod,
      shippingCost,
      paymentMethod: 'cod',
      couponCode: activeCoupon?.code,
      discountAmount,
      subtotal,
      total: Number(finalTotal.toFixed(2)),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Update Product Stock Levels & Sales Count
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartMatch = cart.find((c) => c.product.id === p.id);
        if (cartMatch) {
          const updatedStock = Math.max(0, p.stock - cartMatch.quantity);
          return {
            ...p,
            stock: updatedStock,
            salesCount: p.salesCount + cartMatch.quantity
          };
        }
        return p;
      })
    );

    // Save Order state
    setOrders((prev) => [newOrder, ...prev]);
    
    // Clear cart and tracking view context
    clearCart();
    setActiveOrderTrackingId(newOrder.id);
    setView('order-tracking');

    return newOrder;
  };

  // Review Submissions
  const addProductReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const freshReview: Review = {
            id: `rev-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            ...reviewData
          };
          const nextReviews = [freshReview, ...p.reviews];
          // Recalculate average rating
          const avgRating = Number(
            (nextReviews.reduce((sum, r) => sum + r.rating, 0) / nextReviews.length).toFixed(1)
          );
          return {
            ...p,
            reviews: nextReviews,
            rating: avgRating
          };
        }
        return p;
      })
    );
  };

  // Admin Actions
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviews' | 'salesCount'>) => {
    const rawId = `prod-${Date.now()}`;
    const newProd: Product = {
      ...productData,
      id: rawId,
      rating: 5.0,
      reviews: [],
      salesCount: 0
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    // If we're viewing this modified item details page, refresh references
    if (selectedProductId === updated.id) {
      setSelectedProductId(null);
      setTimeout(() => setSelectedProductId(updated.id), 50);
    }
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProductId === productId) {
      setSelectedProductId(null);
      setView('catalog');
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const index = prev.findIndex((c) => c.code === coupon.code);
      if (index > -1) {
        const next = [...prev];
        next[index] = coupon;
        return next;
      }
      return [coupon, ...prev];
    });
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        coupons,
        cart,
        orders,
        currentView,
        currentPortal,
        selectedProductId,
        activeOrderTrackingId,
        adminPasswordVerified,
        setView,
        setPortal,
        setSelectedProductId,
        setActiveOrderTrackingId,
        setAdminPasswordVerified,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        activeCoupon,
        placeOrder,
        addProductReview,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        addCoupon,
        deleteCoupon
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
};
