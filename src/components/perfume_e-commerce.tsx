"use client";

import { useState, useEffect, type MouseEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
ShoppingBag,
Heart,
Star,
Truck,
Shield,
RefreshCw,
X,
Plus,
Minus,
type LucideIcon,
} from "lucide-react";
import { Inter, Playfair_Display } from "next/font/google";
import type { JSX } from "react/jsx-runtime";

const inter = Inter({
subsets: ["latin"],
display: "swap",
variable: "--font-inter",
});

const playfair = Playfair_Display({
subsets: ["latin"],
display: "swap",
variable: "--font-playfair",
});

interface Perfume {
id: number;
name: string;
brand: string;
price: number;
concentration: string;
size: string;
notes: string[];
description: string;
image: string;
}

interface CartItem {
perfume: Perfume;
quantity: number;
}

interface ToastProps {
message: string;
onClose: () => void;
}

const perfumes: Perfume[] = [
{
id: 1,
name: "Euphoria",
brand: "Calvin Klein",
price: 69.99,
concentration: "Eau de Parfum",
size: "50ml",
notes: ["Black Amber", "Labdanum", "Narcissus"],
description:
"A sophisticated blend of rich, sensual scents that captivates the senses and exudes confidence.",
image: "https://placehold.co/200x300",
},
{
id: 2,
name: "Light Blue",
brand: "Dolce & Gabbana",
price: 59.99,
concentration: "Eau de Toilette",
size: "50ml",
notes: ["Citrus", "Jasmine", "White Woods"],
description:
"A refreshing, aquatic fragrance that embodies the carefree spirit of summer.",
image: "https://placehold.co/200x300",
},
{
id: 3,
name: "La Vie En Rose",
brand: "Guerlain",
price: 79.99,
concentration: "Eau de Parfum",
size: "50ml",
notes: ["Rose", "Jasmine", "Vanilla"],
description:
"A timeless, elegant fragrance that captures the essence of femininity and romance.",
image: "https://placehold.co/200x300",
},
{
id: 4,
name: "Bleu de Chanel",
brand: "Chanel",
price: 74.99,
concentration: "Eau de Parfum",
size: "50ml",
notes: ["Grapefruit", "Lavender", "Vetiver"],
description:
"A sophisticated, versatile scent for the modern man, exuding freedom and adventure.",
image: "https://placehold.co/200x300",
},
{
id: 5,
name: "J'adore",
brand: "Dior",
price: 89.99,
concentration: "Eau de Parfum",
size: "50ml",
notes: ["Jasmine", "Rose", "Vanilla"],
description:
"A luxurious, sensual fragrance that celebrates femininity in all its forms.",
image: "https://placehold.co/200x300",
},
{
id: 6,
name: "Acqua di Gio",
brand: "Giorgio Armani",
price: 64.99,
concentration: "Eau de Toilette",
size: "50ml",
notes: ["Lime", "Jasmine", "White Patchouli"],
description:
"A fresh, aquatic scent that embodies the essence of the Mediterranean Sea.",
image: "https://placehold.co/200x300",
},
{
id: 7,
name: "Black Opium",
brand: "Yves Saint Laurent",
price: 69.99,
concentration: "Eau de Parfum",
size: "50ml",
notes: ["Coffee", "Jasmine", "Vanilla"],
description:
"A seductive, modern fragrance that captures the essence of a midnight temptation.",
image: "https://placehold.co/200x300",
},
{
id: 8,
name: "Tom Ford Noir",
brand: "Tom Ford",
price: 94.99,
concentration: "Eau de Parfum",
size: "50ml",
notes: ["Oud", "Vanilla", "Amber"],
description:
"A sophisticated, alluring scent that exudes mystery and sensuality.",
image: "https://placehold.co/200x300",
},
];

const features: { icon: LucideIcon; text: string }[] = [
{ icon: Truck, text: "Free shipping on orders over $50" },
{ icon: Shield, text: "Authentic products guaranteed" },
{ icon: RefreshCw, text: "Easy returns within 30 days" },
];

const Toast = ({ message, onClose }: ToastProps): JSX.Element => {
return (
<motion.div
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 50 }}
className="fixed bottom-4 right-4 bg-black text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50"
>
<span>{message}</span>
<button onClick={onClose} className="ml-4 text-white hover:text-gray-300" type="button" aria-label="Close">
<X size={16} />
</button>
</motion.div>
);
};

export default function Home(): JSX.Element {
const [cartItems, setCartItems] = useState<CartItem[]>([]);
const [wishlistItems, setWishlistItems] = useState<Perfume[]>([]);
const [totalAmount, setTotalAmount] = useState<number>(0);
const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
const [toast, setToast] = useState<string | null>(null);
const [showWishlistToast, setShowWishlistToast] = useState<boolean>(false);
const [activeFilter, setActiveFilter] = useState<string>("all");
const productSectionRef = useRef<HTMLElement>(null);

useEffect(() => {
const newTotal = cartItems.reduce(
(sum, item) => sum + item.perfume.price * item.quantity,
0
);
setTotalAmount(Number.parseFloat(newTotal.toFixed(2)));
}, [cartItems]);

const scrollToProducts = () => {
  productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
};

const handleAddToCart = (perfume: Perfume): void => {
setCartItems((prevItems) => {
const existingItem = prevItems.find(
(item) => item.perfume.id === perfume.id
);
if (existingItem) {
return prevItems.map((item) =>
item.perfume.id === perfume.id
? { ...item, quantity: item.quantity + 1 }
: item
);
}
return [...prevItems, { perfume, quantity: 1 }];
});
setToast(`Added ${perfume.name} to cart`);
setTimeout(() => {
setToast(null);
}, 3000);
};

const updateQuantity = (index: number, newQuantity: number): void => {
if (newQuantity < 1) return;
setCartItems((prevItems) =>
prevItems.map((item, i) => (i === index ? { ...item, quantity: newQuantity } : item))
);
};

const removeFromCart = (index: number): void => {
setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
};

const toggleWishlist = (perfume: Perfume): void => {
setWishlistItems((prevItems) => {
const isInWishlist = prevItems.some((item) => item.id === perfume.id);
if (isInWishlist) {
setShowWishlistToast(true);
setTimeout(() => {
setShowWishlistToast(false);
}, 3000);
return prevItems.filter((item) => item.id !== perfume.id);
}
return [...prevItems, perfume];
});
};

const CartItemComponent = ({
item,
index,
}: {
item: CartItem;
index: number;
}): JSX.Element => (
<div className="flex items-center justify-between py-4 border-b border-gray-200">
<div className="flex items-center">
<img
src={item.perfume.image}
alt={item.perfume.name}
className="w-16 h-16 object-cover rounded mr-4"
/>
<div>
<h3 className="font-bold">{item.perfume.name}</h3>
<p className="text-sm text-gray-500">{item.perfume.brand}</p>
<p className="font-bold">${item.perfume.price}</p>
</div>
</div>
<div className="flex items-center">
<button
onClick={() => updateQuantity(index, item.quantity - 1)}
className="bg-gray-200 p-1 rounded-l"
type="button"
aria-label="Decrease quantity"
>
<Minus size={16} />
</button>
<span className="px-3 py-1 bg-gray-100 border-t border-b border-gray-200">
{item.quantity}
</span>
<button
onClick={() => updateQuantity(index, item.quantity + 1)}
className="bg-gray-200 p-1 rounded-r"
type="button"
aria-label="Increase quantity"
>
<Plus size={16} />
</button>
<button
onClick={(e: MouseEvent) => {
e.stopPropagation();
removeFromCart(index);
}}
className="ml-2 text-red-500 hover:text-red-700"
type="button"
aria-label="Remove from cart"
>
<X size={16} />
</button>
</div>
</div>
);

const filteredPerfumes = activeFilter === "all" 
  ? perfumes 
  : perfumes.filter((perfume) => perfume.brand === activeFilter);

return (
<div
className={`min-h-screen bg-white text-black ${inter.variable} ${playfair.variable}`}
>
<header className="border-b border-gray-200 sticky top-0 z-50 bg-white">
<div className="container mx-auto px-4 py-4">
<div className="flex justify-between items-center">
<h1
className={`text-3xl font-bold ${playfair.className}`}
style={{ fontFamily: "var(--font-playfair)" }}
>
Perfume House
</h1>
<div className="flex items-center space-x-4">
<button
  onClick={() => setIsWishlistOpen(true)}
  className="relative bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors"
  aria-label="Wishlist"
  type="button"
>
  <Heart size={20} />
  {wishlistItems.length > 0 && (
    <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
      {wishlistItems.length}
    </span>
  )}
</button>
<button
onClick={() => setIsCartOpen(!isCartOpen)}
className="relative bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
aria-label="Shopping cart"
type="button"
>
<ShoppingBag size={20} />
{cartItems.length > 0 && (
<span className="absolute -top-1 -right-1 bg-white text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
{cartItems.reduce(
(sum, item) => sum + item.quantity,
0
)}
</span>
)}
</button>
</div>
</div>
</div>
</header>

<main>
  <section className="relative overflow-hidden h-screen flex items-center">
    <div className="mt-[100px] md:mt-0 container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h2
          className={`text-5xl font-bold mb-4 ${playfair.className}`}
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Luxury Fragrances
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Discover our exclusive collection of premium perfumes from around
          the world. Each fragrance is carefully crafted to evoke emotion
          and leave a lasting impression.
        </p>
        <button 
          onClick={scrollToProducts}
          className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors font-bold uppercase tracking-wide"
          type="button"
        >
          Explore Collection
        </button>
      </div>
      <div className="md:w-1/2 relative">
        <div className="relative md:absolute md:inset-0 flex items-center justify-center">
          <div className="relative bg-pink-50 rounded-full w-96 h-96 flex items-center justify-center">
            <img
              src="https://placehold.co/300x400"
              alt="Luxury Perfume Bottle"
              className="w-64 h-80 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg w-44">
              <p className="text-sm font-bold">New Arrival</p>
              <p className="text-xs text-gray-500">Euphoria</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:justify-evenly md:items-center mb-8 space-y-4 md:space-y-0">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="bg-black text-white p-3 rounded-full">
              <feature.icon size={20} />
            </div>
            <p className="text-gray-600">{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <section ref={productSectionRef} className="py-16">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 space-y-8 md:space-y-0">
        <h2
          className={`text-3xl font-bold ${playfair.className}`}
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Featured Fragrances
        </h2>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wide ${
              activeFilter === "all"
                ? "bg-black text-white"
                : "bg-gray-100 text-black hover:bg-gray-200"
            }`}
            type="button"
          >
            All
          </button>
          {Array.from(new Set(perfumes.map((p) => p.brand))).map(
            (brand) => (
              <button
                key={brand}
                onClick={() => setActiveFilter(brand)}
                className={`px-4 py-2 rounded-full font-bold uppercase tracking-wide ${
                  activeFilter === brand
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
                type="button"
              >
                {brand}
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {filteredPerfumes.map((perfume) => (
          <motion.div
            key={perfume.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -10 }}
            layout
            onClick={() => setSelectedPerfume(perfume)}
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
          >
            <div className="relative">
              <img
                src={perfume.image}
                alt={perfume.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  toggleWishlist(perfume);
                }}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  wishlistItems.some((item) => item.id === perfume.id)
                    ? "bg-pink-500 text-white"
                    : "bg-white/80 text-gray-400 hover:text-pink-500"
                }`}
                type="button"
                aria-label={wishlistItems.some((item) => item.id === perfume.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  size={20}
                  className={
                    wishlistItems.some((item) => item.id === perfume.id)
                      ? "fill-current"
                      : ""
                  }
                />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{perfume.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{perfume.brand}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">${perfume.price}</span>
                <button
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    handleAddToCart(perfume);
                  }}
                  className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors font-bold uppercase tracking-wide"
                  type="button"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>

  <section className="py-16 bg-pink-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2
          className={`text-3xl font-bold mb-4 ${playfair.className}`}
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Customer Reviews
        </h2>
        <p className="text-gray-600">
          Hear from our satisfied customers
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400" />
              ))}
          </div>
          <p className="text-gray-600 mb-4">
            "This perfume is absolutely stunning! The scent is so rich and
            long-lasting. I've received so many compliments already!"
          </p>
          <p className="font-bold">Sarah Johnson</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400" />
              ))}
          </div>
          <p className="text-gray-600 mb-4">
            "I was blown away by the quality of this perfume. The packaging
            is luxurious and the fragrance is divine. Highly recommend!"
          </p>
          <p className="font-bold">Michael Chen</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400" />
              ))}
          </div>
          <p className="text-gray-600 mb-4">
            "I've tried many perfumes in the past, but this one stands out.
            It's elegant, sophisticated, and perfect for any occasion."
          </p>
          <p className="font-bold">Emily Rodriguez</p>
        </div>
      </div>
    </div>
  </section>
</main>

<footer className="bg-black text-white py-12">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="mb-6 md:mb-0">
        <h2
          className={`text-2xl font-bold ${playfair.className}`}
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Perfume House
        </h2>
        <p className="text-gray-400 mt-2">
          Luxury fragrances for the modern you
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Perfume House. All rights
          reserved.
        </p>
      </div>
    </div>
  </div>
</footer>

<AnimatePresence>
  {isCartOpen && (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-lg z-50"
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            type="button"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center flex-col">
            <ShoppingBag size={48} className="text-gray-300 mb-4" />
            <p className="text-lg text-gray-500">Your cart is empty</p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-bold uppercase tracking-wide"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {cartItems.map((item, index) => (
                <CartItemComponent
                  key={index}
                  item={item}
                  index={index}
                />
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg">${totalAmount}</span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCartItems([]);
                  setToast("Checkout successful!");
                  setTimeout(() => {
                    setToast(null);
                  }, 3000);
                }}
                className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors font-bold uppercase tracking-wide"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>

<AnimatePresence>
  {toast && <Toast message={toast} onClose={() => setToast(null)} />}
</AnimatePresence>

<AnimatePresence>
  {isWishlistOpen && (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-lg z-50"
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Wishlist</h2>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close wishlist"
          >
            <X size={24} />
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center flex-col">
            <Heart size={48} className="text-gray-300 mb-4" />
            <p className="text-lg text-gray-500">Your wishlist is empty</p>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors font-bold uppercase tracking-wide"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {wishlistItems.map((perfume) => (
                <div key={perfume.id} className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div>
                      <h3 className="font-bold">{perfume.name}</h3>
                      <p className="text-sm text-gray-500">{perfume.brand}</p>
                      <p className="font-bold">${perfume.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleAddToCart(perfume)}
                      className="bg-black text-white px-3 py-1 rounded-full text-sm mr-2"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag size={16} />
                    </button>
                    <button
                      onClick={() => toggleWishlist(perfume)}
                      className="text-pink-500 hover:text-pink-700"
                      aria-label="Remove from wishlist"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>

<AnimatePresence>
  {showWishlistToast && (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 bg-pink-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50"
    >
      <Heart size={16} className="mr-2" />
      <span>Added to Wishlist</span>
      <button
        onClick={() => setShowWishlistToast(false)}
        className="ml-4 text-white hover:text-gray-300"
        type="button"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  )}
</AnimatePresence>

<AnimatePresence>
  {selectedPerfume && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={() => setSelectedPerfume(null)}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <img
              src={selectedPerfume.image}
              alt={selectedPerfume.name}
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className={`text-2xl font-bold ${playfair.className}`}>{selectedPerfume.name}</h2>
                <p className="text-gray-500">{selectedPerfume.brand}</p>
              </div>
              <button
                onClick={() => setSelectedPerfume(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close details"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">${selectedPerfume.price}</span>
                <span className="text-sm text-gray-500">{selectedPerfume.size} / {selectedPerfume.concentration}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold mb-2">Description</h3>
              <p className="text-gray-600">{selectedPerfume.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold mb-2">Notes</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPerfume.notes.map((note, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {note}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-auto flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(selectedPerfume);
                  setSelectedPerfume(null);
                }}
                className="flex-1 bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors font-bold uppercase tracking-wide"
              >
                Add to Cart
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(selectedPerfume);
                }}
                className={`w-12 h-12 flex items-center justify-center rounded-full ${
                  wishlistItems.some((item) => item.id === selectedPerfume.id)
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-400 hover:text-pink-500"
                }`}
                aria-label={wishlistItems.some((item) => item.id === selectedPerfume.id) 
                  ? "Remove from wishlist" 
                  : "Add to wishlist"}
              >
                <Heart 
                  size={20} 
                  className={wishlistItems.some((item) => item.id === selectedPerfume.id) 
                    ? "fill-current" 
                    : ""}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
</div>
);
}