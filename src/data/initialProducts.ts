/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Unisex Urban Oversized Hoodie',
    description: 'Elevate your daily streetwear with this heavy-knit, relaxed-fit cotton blend hoodie. Features an adjustable double-lined hood, a front kangaroo pocket, and premium ribbed-knit accents on the cuffs and hem. Extremely cozy, 100% authentic, and pre-shrunk for the ultimate comfort fit.',
    price: 49.00,
    originalPrice: 65.00,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
    category: "Men's Apparel",
    rating: 4.8,
    stock: 24,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Midnight Black', 'Slate Gray', 'Sand Beige', 'Sage Green'],
    isFeatured: true,
    isNew: true,
    salesCount: 142,
    reviews: [
      {
        id: 'rev-1',
        userName: 'Zayn Malik',
        rating: 5,
        comment: 'This is the comfiest hoodie I own! The material is heavy and feels super high-end.',
        date: '2026-05-20'
      },
      {
        id: 'rev-2',
        userName: 'Sarah Connor',
        rating: 4,
        comment: 'Really cozy, fits nicely oversized. Took standard delivery and it got here in 2 days.',
        date: '2026-05-18'
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Classic Minimalist Watch',
    description: 'A timeless timepiece perfect for any wardrobe. Featuring an ultra-thin 40mm stainless steel case, anti-scratch sapphire mineral crystal cover, precision Japanese quartz movement, and an interchangeable hand-stitched vegan leather strap. Water-resistant up to 30 meters.',
    price: 89.00,
    originalPrice: 120.00,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    category: 'Accessories',
    rating: 4.7,
    stock: 12,
    sizes: ['One Size'],
    colors: ['Classic Tan', 'Matte Black', 'Royal Silver'],
    isFeatured: true,
    isNew: false,
    salesCount: 89,
    reviews: [
      {
        id: 'rev-3',
        userName: 'Alex Carter',
        rating: 5,
        comment: 'Absolutely stunning. Very clean design. Pairs perfectly with formal and casual wear.',
        date: '2026-05-25'
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Relaxed Fit Utility Cargo Pants',
    description: 'Engineered from heavy-duty cotton ripstop fabric, these cargo pants offer both rugged durability and modern style. Features deep side cargo pockets with snap flap closures, secure zippered rear pockets, and articulated knees for unrestricted movement. Equipped with an adjustable ankle drawstring.',
    price: 39.00,
    originalPrice: 55.00,
    image: 'https://images.unsplash.com/photo-1542272604-787c38355322?auto=format&fit=crop&q=80&w=600',
    category: "Men's Apparel",
    rating: 4.6,
    stock: 35,
    sizes: ['M', 'L', 'XL'],
    colors: ['Army Olive', 'Combat Khaki', 'Shadow Black'],
    isFeatured: false,
    isNew: true,
    salesCount: 64,
    reviews: [
      {
        id: 'rev-4',
        userName: 'Marcus Aurelius',
        rating: 4,
        comment: 'Pockets are very roomy and the waist fits true to size. Great utility pants.',
        date: '2026-05-15'
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Vegan Leather Everyday Backpack',
    description: 'Sleek, splash-resistant, and structured backpack designed to carry your laptop and daily essentials. Crafted with premium, cruelty-free synthetic leather. Features a tech sleeve that fits up to a 15-inch laptop, visual internal organizer meshes, hidden outer anti-theft compartments, and ergonomic padded shoulder straps.',
    price: 75.00,
    originalPrice: 95.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    category: 'Accessories',
    rating: 4.9,
    stock: 8,
    sizes: ['One Size'],
    colors: ['Tan Amber', 'Charcoal Black', 'Forest Green'],
    isFeatured: true,
    isNew: false,
    salesCount: 110,
    reviews: [
      {
        id: 'rev-5',
        userName: 'Jessica Miller',
        rating: 5,
        comment: 'Beautiful texture! Fits my MacBook securely. Looks much more expensive than it is.',
        date: '2026-05-29'
      },
      {
        id: 'rev-6',
        userName: 'Tom Bradley',
        rating: 5,
        comment: 'Solid waterproofing, tested it in light rain. Strap buckles feel incredibly robust.',
        date: '2026-05-21'
      }
    ]
  },
  {
    id: 'prod-5',
    name: 'Classic White Athletic Sneakers',
    description: 'The definitive daily footwear. Made with full-grain leather uppers, breathable mesh details, cushioned Ortholite sockliners, and dynamic vulcanized rubber traction outsoles. Clean retro look, extreme arch support, and lightweight comfort designed for all-day commutes.',
    price: 59.00,
    originalPrice: 85.00,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600',
    category: 'Footwear',
    rating: 4.5,
    stock: 18,
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Cloud White', 'Nostalgia Cream'],
    isFeatured: false,
    isNew: false,
    salesCount: 94,
    reviews: [
      {
        id: 'rev-7',
        userName: 'Ryan Reynolds',
        rating: 4,
        comment: 'Very easy to clean, comfortable right out of the box. Extremely happy with the purchase.',
        date: '2026-05-11'
      }
    ]
  },
  {
    id: 'prod-6',
    name: 'Cozy Knit Linen Summer Dress',
    description: 'Breathe free in this airy linen-blend dress. Styled with an elegant square neckline, custom waist-defining ties, and side seam pockets. Lightweight, moisture-wicking fabric that ensures elegance and continuous cool breezes on warm summer beach outings.',
    price: 65.00,
    originalPrice: 89.00,
    image: 'https://images.unsplash.com/photo-1572426652809-2185ff79111d?auto=format&fit=crop&q=80&w=600',
    category: "Women's Apparel",
    rating: 4.7,
    stock: 15,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Oatmeal', 'Powder Blue', 'Coral Pink'],
    isFeatured: false,
    isNew: true,
    salesCount: 45,
    reviews: [
      {
        id: 'rev-8',
        userName: 'Emma Watson',
        rating: 5,
        comment: 'Absolutely delightful. Very lightweight and feels wonderfully high quality. Love the pockets!',
        date: '2026-05-24'
      }
    ]
  },
  {
    id: 'prod-7',
    name: 'Polarized Retro Aviator Sunglasses',
    description: 'Protect your eyes with style. Engineered with lightweight, corrosion-resistant metallic titanium frames and high-optical TAC polarized lenses that filter out 100% of UVA and UVB rays. Includes premium leather travel protective sleeve and microfibre cleaning clothes.',
    price: 34.00,
    originalPrice: 48.00,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
    category: 'Accessories',
    rating: 4.4,
    stock: 45,
    sizes: ['Standard'],
    colors: ['Gloss Gold', 'Gunmetal Gray'],
    isFeatured: false,
    isNew: false,
    salesCount: 156,
    reviews: [
      {
        id: 'rev-9',
        userName: 'Clint Eastwood',
        rating: 5,
        comment: 'The polarized lenses work perfectly under harsh morning road glare. Excellent frames.',
        date: '2026-05-02'
      }
    ]
  },
  {
    id: 'prod-8',
    name: 'Vintage Suede Loafers',
    description: 'A masterpiece of classic shoemaking. Crafted using double-stitched Italian water-repellent suede leather upper with an elegant moc-toe design. Styled with responsive leather insoles that mould perfectly to your feet. Perfect slip-on wear for smart-casual events and modern offices.',
    price: 95.00,
    originalPrice: 135.00,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600',
    category: 'Footwear',
    rating: 4.8,
    stock: 7,
    sizes: ['8', '9', '10', '11'],
    colors: ['Chocolate Brown', 'Midnight Navy', 'Honey Tan'],
    isFeatured: true,
    isNew: true,
    salesCount: 38,
    reviews: [
      {
        id: 'rev-10',
        userName: 'David Beckham',
        rating: 5,
        comment: 'Exquisite touch and build. Fits extremely comfortably. Premium packaging.',
        date: '2026-05-30'
      }
    ]
  }
];

export const INITIAL_COUPONS = [
  { code: 'BURAK10', discountType: 'percentage' as const, value: 10, isActive: true },
  { code: 'FREESHIP', discountType: 'fixed' as const, value: 15, minSpend: 50, isActive: true },
  { code: 'WELCOME5', discountType: 'fixed' as const, value: 5, isActive: true }
];
