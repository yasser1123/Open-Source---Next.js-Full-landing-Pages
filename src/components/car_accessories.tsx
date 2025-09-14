"use client"
import React, { useState, useEffect, useRef, MouseEvent, ChangeEvent, ReactNode } from 'react';
import {
ShoppingCart,
Search,
Menu,
X,
ChevronDown,
ChevronUp,
  Star, 
  Check,
Plus,
Minus,
  Eye,
  Heart,
  ArrowRight
} from 'lucide-react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ----- Basic UI Components -----
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
}

const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'default',
  className = '', 
  disabled = false,
  ...props 
}: ButtonProps) => {
  const getVariantClasses = () => {
    switch(variant) {
      case 'outline':
        return 'border border-gray-300 bg-transparent hover:bg-gray-100';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700 text-white';
    }
  };
  
  const getSizeClasses = () => {
    switch(size) {
      case 'sm':
        return 'py-1 px-4 text-sm';
      case 'lg':
        return 'py-3 px-6 text-lg';
      case 'icon':
        return 'p-3';
      default:
        return 'py-3 px-5';
    }
  };
  
  return (
    <button
      className={`rounded-md flex items-center font-medium transition-all duration-300 ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '', ...props }: CardProps & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardComponentProps {
  children: ReactNode;
  className?: string;
}

const CardHeader = ({ children, className = '', ...props }: CardComponentProps & React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={`p-4 ${className}`} {...props}>{children}</div>;
};

const CardContent = ({ children, className = '', ...props }: CardComponentProps & React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={`p-4 pt-0 ${className}`} {...props}>{children}</div>;
};

const CardFooter = ({ children, className = '', ...props }: CardComponentProps & React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={`p-4 pt-0 ${className}`} {...props}>{children}</div>;
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className = '', ...props }: InputProps) => {
  return (
    <input
      className={`px-3 py-2 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      {...props}
    />
  );
};

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden z-10">
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-20"
          onClick={onClose}
          aria-label="Close modal"
          title="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="overflow-auto max-h-[90vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Helper function to combine class names
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

// ----- Types and Interfaces -----
interface Product {
id: number;
name: string;
price: number;
image: string;
  category: 'interior' | 'exterior' | 'performance' | 'comfort' | 'electronics' | 'cleaning';
rating: number;
reviews: number;
description: string;
specifications: string[];
compatibility: string[];
}

interface CartItem {
product: Product;
quantity: number;
}

// ----- Main Component -----
const CarAccessories = () => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
  
  // Refs
  const productsRef = useRef<HTMLDivElement>(null);
  
  // Sample products data
  useEffect(() => {
    // Mock products data with updated car-related images from Unsplash
    const mockProducts: Product[] = [
{
id: 1,
name: 'Premium Leather Steering Wheel Cover',
price: 29.99,
        image: 'https://images.unsplash.com/photo-1588127333419-b9d7de223dcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
category: 'interior',
rating: 4.8,
        reviews: 25,
        description: 'Upgrade your car\'s interior with our premium leather steering wheel cover. Made from genuine leather with meticulous stitching, this cover provides a comfortable grip while adding a touch of luxury to your driving experience. The ergonomic design prevents hand fatigue during long drives, and its universal fit makes it compatible with most standard steering wheels.',
        specifications: ['Material: Genuine Leather', 'Color: Black/Brown', 'Size: Universal', 'Thickness: 4mm', 'Weight: 180g'],
        compatibility: ['Compatible with most cars', 'Easy to install', 'Fits wheels 14.5-15.5" in diameter']
},
{
id: 2,
        name: 'LED Underglow Lighting Kit',
price: 49.99,
        image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
category: 'exterior',
        rating: 4.5,
        reviews: 18,
        description: 'Add a vibrant look to your car with our LED underglow lighting kit. This advanced lighting system includes multiple color options and patterns controlled via a smartphone app. The weatherproof design ensures durability in all conditions, while the easy installation process requires minimal technical knowledge. Transform your vehicle\'s appearance and stand out on the road with this customizable lighting solution.',
        specifications: ['LED Type: SMD 5050', 'Waterproof: IP68', 'Length: 6 meters', 'Power: 12V DC', 'Remote Control: Yes', 'App Control: Compatible with iOS and Android'],
        compatibility: ['Universal fit for cars', '12V DC compatible', 'Works with all vehicle makes and models']
},
{
id: 3,
name: 'Performance Air Intake System',
price: 199.99,
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
category: 'performance',
        rating: 4.9,
        reviews: 32,
        description: 'Boost your car\'s performance with our high-flow air intake system. Engineered for maximum airflow, this system replaces your restrictive factory air box with a design that allows your engine to breathe better. The result is increased horsepower, improved throttle response, and even better fuel efficiency. Made from high-quality aluminum with a washable, reusable filter, this intake system is built to last and designed to perform.',
        specifications: ['Material: High-quality aluminum', 'Filter: Washable and reusable', 'Gain: Up to 15 HP', 'Installation Time: ~1 hour', 'Includes: Complete hardware kit', 'Warranty: 2 years'],
        compatibility: ['Model specific', 'Year: 2015-2023', 'Check vehicle compatibility before purchase']
},
{
id: 4,
        name: 'Heated Car Seat Cover',
price: 79.99,
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
category: 'comfort',
rating: 4.7,
        reviews: 21,
        description: 'Experience ultimate comfort with our heated car seat covers. Featuring three temperature settings and a plush memory foam construction, these seat covers provide warmth and support during cold weather drives. The non-slip backing keeps the cover securely in place, while the universal design fits most car seats. Additionally, the durable PU leather surface is easy to clean and water-resistant, ensuring long-lasting performance and comfort.',
        specifications: ['Material: Microfiber PU Leather', 'Heating: 3-level adjustable', 'Massage: 3 modes', 'Power: 12V Car Adapter', 'Auto-Off: Yes (30 minutes)', 'Temperature Range: 30-60°C'],
        compatibility: ['Universal fit', 'Side airbag compatible', 'Works with bucket seats and bench seats']
},
{
id: 5,
        name: 'Dashboard Camera 4K Ultra HD',
price: 129.99,
        image: 'https://images.unsplash.com/photo-1588127333419-b9d7de223dcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category: 'electronics',
rating: 4.6,
        reviews: 42,
        description: 'Capture every moment of your journey with our 4K Ultra HD dashboard camera. With a wide-angle lens and night vision capability, this camera provides crystal-clear footage day and night. Features include GPS tracking, loop recording, and G-sensor technology that automatically saves footage in case of collision. Compact design mounts discreetly on your windshield without obstructing your view.',
        specifications: ['Resolution: 4K Ultra HD', 'Field of View: 170°', 'Storage: Up to 256GB', 'Night Vision: Yes', 'GPS: Built-in', 'Loop Recording: Yes'],
        compatibility: ['Universal mount', 'Works with 12V and 24V vehicles', 'SD card required (sold separately)']
},
{
id: 6,
        name: 'Car Phone Mount Wireless Charger',
price: 39.99,
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category: 'electronics',
rating: 4.5,
        reviews: 56,
        description: 'Keep your phone charged and visible with our wireless charging phone mount. This versatile mount features auto-clamping technology that securely holds your phone while providing fast wireless charging. Compatible with most smartphone models, the adjustable arm allows for the perfect viewing angle. The strong suction cup base ensures stability even on rough roads.',
        specifications: ['Charging: 15W Fast Wireless', 'Compatibility: iPhone & Android', 'Mounting: Dashboard/Windshield', 'Adjustable: 360° Rotation', 'Auto-Clamping: Yes'],
        compatibility: ['Compatible with all Qi-enabled smartphones', 'Fits phones 4.0-6.7 inches', 'Requires 12V car charger (included)']
      },
      {
        id: 7,
        name: 'Trunk Organizer with Cooler',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
category: 'interior',
        rating: 4.3,
        reviews: 38,
        description: 'Keep your trunk organized and your beverages cool with this 2-in-1 trunk organizer. Multiple compartments and dividers provide customizable storage space for groceries, emergency supplies, and other essentials. The built-in cooler compartment keeps food and drinks at the perfect temperature during long trips. When not in use, the organizer collapses flat for easy storage.',
        specifications: ['Material: 600D Oxford Fabric', 'Capacity: 50L storage + 15L cooler', 'Dimensions: 23" x 15" x 12"', 'Insulation: 8mm PE foam', 'Waterproof Bottom: Yes'],
        compatibility: ['Universal fit for all vehicle trunks', 'Non-slip bottom surface', 'Reinforced carrying handles']
      },
      {
        id: 8,
        name: 'Car Vacuum Cleaner Portable',
price: 59.99,
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category: 'cleaning',
        rating: 4.4,
        reviews: 64,
        description: 'Keep your car interior spotless with our powerful portable vacuum cleaner. This lightweight vacuum features strong suction to remove dirt, crumbs, pet hair, and dust from hard-to-reach areas. Multiple attachments allow for cleaning every nook and cranny of your vehicle. The long power cord connects to your car\'s 12V outlet for convenient cleaning anywhere.',
        specifications: ['Power: 120W', 'Suction: 8.5 kPa', 'Cord Length: 16.4 ft', 'Filter: HEPA', 'Noise Level: <75dB', 'Weight: 2.4 lbs'],
        compatibility: ['Works with all 12V car outlets', 'Includes carry bag for storage', 'Replaceable filter']
      }
    ];
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(mockProducts.map(p => p.category)));
    setCategories(uniqueCategories);
}, []);

  // Scroll event listener for back-to-top button
useEffect(() => {
const handleScroll = () => {
if (window.scrollY > 300) {
  setShowBackToTop(true);
} else {
  setShowBackToTop(false);
}
};

window.addEventListener('scroll', handleScroll);
return () => window.removeEventListener('scroll', handleScroll);
}, []);

  // Filter products based on search term and selected categories
useEffect(() => {
let filtered = products;
    
if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
  }
  
  if (selectedCategories.length > 0) {
    filtered = filtered.filter(product =>
      selectedCategories.includes(product.category)
    );
  }
  
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategories]);
  
  // Handlers
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

const handleAddToCart = (product: Product) => {
setCartItems(prevItems => {
    const existingItem = prevItems.find(item => item.product.id === product.id);
    if (existingItem) {
      return prevItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    return [...prevItems, { product, quantity: 1 }];
  });
};

const handleRemoveFromCart = (item: CartItem) => {
setCartItems(prevItems => prevItems.filter(i => i.product.id !== item.product.id));
};

  const handleUpdateQuantity = (item: CartItem, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(i => 
        i.product.id === item.product.id 
          ? { ...i, quantity } 
          : i
      )
    );
};

const handleCartToggle = () => {
setIsCartOpen(!isCartOpen);
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
  };
  
  const closeProductDetails = () => {
    setSelectedProduct(null);
  };
  
  // Get total cart items and subtotal
  const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Component: ProductCard
const ProductCard = ({ product }: { product: Product }) => {
return (
      <Card className="h-full group">
        <div className="aspect-square relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.rating >= 4.5 && (
            <div className="absolute top-2 left-2 bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <Star className="w-3 h-3 fill-current inline mr-1" />
            {product.rating}
          </div>
        )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button 
              variant="default" 
              size="sm"
              className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              onClick={() => openProductDetails(product)}
              aria-label="View details"
              title="View details"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
      </div>
        </div>
        <CardContent>
          <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {product.description.substring(0, 80)}...
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-indigo-600">${product.price}</span>
            <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
                className="border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white"
                onClick={() => openProductDetails(product)}
                aria-label="View details"
                title="View details"
              >
                <Eye className="w-4 h-4" />
          </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleAddToCart(product)}
                aria-label="Add to cart"
                title="Add to cart"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add
              </Button>
      </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Component: CategoryFilter
  const CategoryFilter = () => {
    return (
<div className="space-y-2">
        <h3 className="font-semibold text-gray-900">Categories</h3>
        {categories.map(category => (
<div key={category} className="flex items-center space-x-2">
<input
type="checkbox"
              id={`category-${category}`}
checked={selectedCategories.includes(category)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleCategoryChange(category, e.target.checked)}
              className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-300 rounded"
/>
<label
              htmlFor={`category-${category}`}
className="text-sm font-medium text-gray-700 capitalize"
>
{category}
</label>
</div>
))}
</div>
);
  };
  
  // Component: CartItem
  const CartItemComponent = ({ item }: { item: CartItem }) => {
  return (
      <div className="flex items-center justify-between py-4 border-b last:border-0">
<div className="flex items-center">
<div className="w-16 h-16 rounded-md overflow-hidden mr-4">
<img
src={item.product.image}
alt={item.product.name}
className="w-full h-full object-cover"
/>
</div>
<div>
            <h3 className="font-semibold text-gray-900 truncate max-w-[150px]">{item.product.name}</h3>
            <p className="text-indigo-600 font-medium">${item.product.price}</p>
</div>
</div>
<div className="flex items-center">
<div className="flex items-center mr-3 border rounded-md overflow-hidden">
<Button
variant="ghost"
size="icon"
              onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
className="h-8 w-8 rounded-r-none"
disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              title="Decrease quantity"
>
<Minus className="h-4 w-4" />
</Button>
<span className="w-8 text-center">{item.quantity}</span>
<Button
variant="ghost"
size="icon"
              onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
className="h-8 w-8 rounded-l-none"
              aria-label="Increase quantity"
              title="Increase quantity"
>
<Plus className="h-4 w-4" />
</Button>
</div>
<Button
variant="ghost"
size="icon"
            onClick={() => handleRemoveFromCart(item)}
className="text-red-500 hover:text-red-700 h-8 w-8"
            aria-label="Remove from cart"
            title="Remove from cart"
>
            <X className="h-4 w-4" />
</Button>
</div>
</div>
    );
  };

  // Product Detail Modal Content
  const ProductDetailContent = ({ product }: { product: Product }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <div className="aspect-square relative overflow-hidden rounded-lg">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
</div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
                {product.category}
              </span>
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-transparent'}`} 
                  />
                ))}
                <span className="text-gray-600 text-sm ml-1">({product.reviews})</span>
</div>
</div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-3xl font-bold text-indigo-600 mt-2">${product.price}</p>
</div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
              <ul className="space-y-1">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{spec}</span>
                  </li>
                ))}
              </ul>
</div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Compatibility</h3>
              <ul className="space-y-1">
                {product.compatibility.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
</div>
</div>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Button
              variant="default"
              size="lg"
              className="flex-1 flex items-center justify-center w-full min-w-[180px]"
              onClick={() => {
                handleAddToCart(product);
                closeProductDetails();
              }}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white w-full min-w-[180px]"
              onClick={closeProductDetails}
            >
              Continue Shopping
            </Button>
</div>
</div>
</div>
);
  };

  // Update the handleCheckout function
  const handleCheckout = () => {
    setCartItems([]);
    setIsCartOpen(false);
    setIsCheckoutComplete(true);
    
    // Auto-close the checkout confirmation after 3 seconds
    setTimeout(() => {
      setIsCheckoutComplete(false);
    }, 3000);
  };

  // Main render
return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur shadow-sm">
<div className="container mx-auto px-4 py-3 flex justify-between items-center">
<div className="flex items-center space-x-8">
<a href="#" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
</div>
              <span className="text-xl font-bold text-gray-900">Car<span className="text-indigo-600">Connect</span></span>
            </a>
</div>
<div className="flex items-center space-x-4">
            <div className="relative">
<Input
type="search"
placeholder="Search products..."
className="pr-8 pl-10 h-9 w-[200px] md:w-[300px]"
value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
/>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              {searchTerm && (
<button
                  onClick={() => setSearchTerm('')}
className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                  title="Clear search"
>
<X className="h-4 w-4" />
</button>
              )}
</div>
<Button
variant="ghost"
size="icon"
              className="relative hover:text-indigo-600"
              onClick={handleCartToggle}
              aria-label="Shopping cart"
              title="Shopping cart"
>
<ShoppingCart className="h-5 w-5" />
{totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
{totalItems}
</span>
)}
</Button>
</div>
</div>
</header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Improved Hero Banner */}
        <div className="mb-12 relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 mix-blend-multiply"></div>
          <img 
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1260&h=750&q=80" 
            alt="Car accessories" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-12">
              <div className="max-w-lg">
                <span className="inline-block px-3 py-1 bg-indigo-600 bg-opacity-80 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-4">
Premium Quality Guaranteed
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">Upgrade Your Driving Experience</h1>
                <p className="text-lg text-white text-opacity-90 mb-8 max-w-md">
                  Discover premium car accessories designed for comfort, performance, and style at unbeatable prices.
                </p>
                <div className="flex flex-wrap gap-4">
<Button
                    variant="default"
size="lg"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white min-w-[180px]"
                    onClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span className="flex items-center justify-center w-full">
                      Shop Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </span>
</Button>

</div>
</div>
</div>
</div>
</div>
        
        {/* Products Section - No Filter */}
        <div id="products" ref={productsRef} className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Shop Car Accessories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
))}
</div>
</div>
      </main>
      
      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleCartToggle}>
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-hidden"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
<Button
                  variant="ghost" 
                  size="icon"
                  onClick={handleCartToggle}
                  aria-label="Close cart"
                  title="Close cart"
                >
                  <X className="h-5 w-5" />
</Button>
</div>
              
              <div className="flex-1 overflow-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ShoppingCart className="w-12 h-12 mb-4 text-indigo-500" />
                    <p>Your cart is empty</p>
</div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <CartItemComponent key={item.product.id} item={item} />
))}
</div>
                )}
</div>
              
              {cartItems.length > 0 && (
                <div className="p-6 border-t bg-white/90 backdrop-blur-sm">
                  <div className="flex justify-between text-lg font-semibold mb-4">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
</div>
                  <Button 
                    className="w-full min-w-[180px]" 
                    aria-label="Checkout" 
                    title="Checkout"
                    onClick={handleCheckout}
                  >
Checkout
                  </Button>
</div>
)}
</div>
</div>
</div>
      )}
      
      {/* Product Detail Modal */}
      <Modal 
        isOpen={!!selectedProduct} 
        onClose={closeProductDetails}
      >
        {selectedProduct && <ProductDetailContent product={selectedProduct} />}
      </Modal>
      
      {/* Back to Top Button */}
      {showBackToTop && (
<Button
variant="outline"
          className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-indigo-600 text-white shadow-lg border-none"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
        >
          <ChevronUp className="w-6 h-6" />
</Button>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
<div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
</div>
                <span className="text-xl font-bold">Car<span className="text-indigo-400">Connect</span></span>
</div>
              <p className="text-gray-400 mb-4">Providing quality car accessories for your driving comfort and style since 2010.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
</div>
</div>
            
<div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">All Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Interior Accessories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Exterior Accessories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Electronics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Cleaning Supplies</a></li>
</ul>
</div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Track Order</a></li>
</ul>
    </div>
            
<div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-2 w-full text-gray-900 bg-gray-100 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md transition-colors">
                  Subscribe
                </button>
</div>
</div>
</div>
          
          <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2023 CarConnect. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">Sitemap</a>
    </div>
      </div>
    </div>
      </footer>

      {/* Checkout Success Modal */}
      <CheckoutSuccessModal 
        isOpen={isCheckoutComplete} 
        onClose={() => setIsCheckoutComplete(false)} 
      />
  </div>
  );
};

// Checkout Success Modal
const CheckoutSuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center z-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout Complete!</h2>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been received.</p>
<Button
          variant="default"
          className="w-full min-w-[180px]"
          onClick={onClose}
>
Continue Shopping
</Button>
</div>
</div>
);
};

export default CarAccessories; 