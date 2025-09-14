"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, MapPin, Camera, Clock, ChefHat, Utensils, X } from "lucide-react"

interface Review {
id: string
restaurant: string
location: string
rating: number
review: string
dishes: string[]
date: string
image: string
priceRange: string
cuisineType: string
openingHours: string
}

interface NewReview extends Omit<Review, "id" | "date"> {
date: Date
}

interface Location {
name: string
image: string
reviewCount: number
}

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-500 p-4 rounded-t-2xl flex justify-between items-center z-10">
            <h2 className="text-xl font-bold text-white">Add Your Review</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close modal"
              title="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ReviewForm = ({ onSubmit, locations }: { 
  onSubmit: (review: NewReview) => void; 
  locations: Location[];
}) => {
  const [formData, setFormData] = useState<NewReview>({
restaurant: "",
location: "",
rating: 0,
review: "",
dishes: [],
date: new Date(),
image: "",
priceRange: "",
cuisineType: "",
openingHours: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.restaurant.trim()) {
      errors.restaurant = "Restaurant name is required";
    }
    
    if (!formData.location) {
      errors.location = "Location is required";
    }
    
    if (formData.rating === 0) {
      errors.rating = "Please select a rating";
  }
  
    if (!formData.review.trim()) {
      errors.review = "Review text is required";
  }
  
    if (!formData.priceRange) {
      errors.priceRange = "Price range is required";
  }
  
    if (!formData.cuisineType) {
      errors.cuisineType = "Cuisine type is required";
  }
  
    if (!formData.openingHours) {
      errors.openingHours = "Opening hours are required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        restaurant: "",
        location: "",
        rating: 0,
        review: "",
        dishes: [],
        date: new Date(),
        image: "",
        priceRange: "",
        cuisineType: "",
        openingHours: "",
      });
      setPreviewImage("");
      setValidationErrors({});
    } catch (err) {
      setError("Failed to submit review. Please try again.");
      console.error("Error submitting review:", err);
    } finally {
      setIsSubmitting(false);
  }
  };

const handleAddDish = (dish: string) => {
    if (dish && !formData.dishes.includes(dish)) {
      setFormData(prev => ({ ...prev, dishes: [...prev.dishes, dish] }));
}
  };

const handleRemoveDish = (dish: string) => {
    setFormData(prev => ({
      ...prev,
      dishes: prev.dishes.filter(d => d !== dish)
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // Create a local URL for immediate preview
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewImage(localPreviewUrl);
      
      // For demo purposes, we'll use a placeholder image URL instead of actual Cloudinary upload
      // In a real app, you would use the Cloudinary upload code below
      const placeholderImageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60";
      
      // Set the image URL in the form data
      setFormData(prev => ({ ...prev, image: placeholderImageUrl }));
      
      // Uncomment this code for actual Cloudinary upload
      /*
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setFormData(prev => ({ ...prev, image: data.secure_url }));
      */
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
</div>
      )}
      
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Restaurant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
            value={formData.restaurant}
                  onChange={(e) =>
              setFormData(prev => ({ ...prev, restaurant: e.target.value }))
                  }
            className={`w-full px-4 py-3 rounded-lg border ${
              validationErrors.restaurant 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all`}
                  required
            aria-label="Restaurant Name"
            title="Restaurant Name"
            placeholder="Enter restaurant name"
                />
          {validationErrors.restaurant && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.restaurant}</p>
          )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location <span className="text-red-500">*</span>
                </label>
                <select
            value={formData.location}
                  onChange={(e) =>
              setFormData(prev => ({ ...prev, location: e.target.value }))
                  }
            className={`w-full px-4 py-3 rounded-lg border ${
              validationErrors.location 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all`}
                  required
            aria-label="Location"
            title="Location"
                >
                  <option value="">Select a location</option>
                  {locations.map((location) => (
                    <option key={location.name} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
          {validationErrors.location && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.location}</p>
          )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating <span className="text-red-500">*</span>
                </label>
          <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                  setFormData(prev => ({ ...prev, rating: star }))
                      }
                      className="focus:outline-none transition-all"
                aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`w-8 h-8 ${
                    star <= formData.rating
                            ? "fill-orange-400 text-orange-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
          {validationErrors.rating && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.rating}</p>
          )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price Range <span className="text-red-500">*</span>
                </label>
                <select
            value={formData.priceRange}
                  onChange={(e) =>
              setFormData(prev => ({ ...prev, priceRange: e.target.value }))
                  }
            className={`w-full px-4 py-3 rounded-lg border ${
              validationErrors.priceRange 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all`}
            aria-label="Price Range"
            title="Price Range"
            required
                >
                  <option value="">Select price range</option>
                  <option value="€">€ (Budget)</option>
                  <option value="€€">€€ (Moderate)</option>
                  <option value="€€€">€€€ (Upscale)</option>
            <option value="€€€€">€€€€ (Luxury)</option>
                </select>
          {validationErrors.priceRange && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.priceRange}</p>
          )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cuisine Type <span className="text-red-500">*</span>
                </label>
                <select
            value={formData.cuisineType}
                  onChange={(e) =>
              setFormData(prev => ({ ...prev, cuisineType: e.target.value }))
                  }
            className={`w-full px-4 py-3 rounded-lg border ${
              validationErrors.cuisineType 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all`}
            aria-label="Cuisine Type"
            title="Cuisine Type"
            required
                >
                  <option value="">Select cuisine type</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
            <option value="Japanese Fusion">Japanese Fusion</option>
                  <option value="Korean">Korean</option>
            <option value="Korean Fusion">Korean Fusion</option>
                  <option value="Thai">Thai</option>
                  <option value="Vietnamese">Vietnamese</option>
            <option value="Malaysian">Malaysian</option>
            <option value="Indonesian">Indonesian</option>
            <option value="Singaporean">Singaporean</option>
                  <option value="Fusion">Fusion</option>
            <option value="Asian Street Food">Asian Street Food</option>
                </select>
          {validationErrors.cuisineType && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.cuisineType}</p>
          )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Opening Hours <span className="text-red-500">*</span>
                </label>
          <select
            value={formData.openingHours}
                  onChange={(e) =>
              setFormData(prev => ({ ...prev, openingHours: e.target.value }))
                  }
            className={`w-full px-4 py-3 rounded-lg border ${
              validationErrors.openingHours 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all`}
            aria-label="Opening Hours"
            title="Opening Hours"
            required
          >
            <option value="">Select opening hours</option>
            <option value="11:00 - 22:00">11:00 - 22:00</option>
            <option value="12:00 - 23:00">12:00 - 23:00</option>
            <option value="11:30 - 22:30">11:30 - 22:30</option>
            <option value="12:00 - 23:30">12:00 - 23:30</option>
            <option value="10:00 - 22:00">10:00 - 22:00</option>
            <option value="11:00 - 23:30">11:00 - 23:30</option>
          </select>
          {validationErrors.openingHours && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.openingHours}</p>
          )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
            value={formData.review}
                  onChange={(e) =>
              setFormData(prev => ({ ...prev, review: e.target.value }))
                  }
            className={`w-full px-4 py-3 rounded-lg border ${
              validationErrors.review 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all`}
                  rows={4}
                  required
            aria-label="Your Review"
            title="Your Review"
            placeholder="Write your review here..."
                />
          {validationErrors.review && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.review}</p>
          )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notable Dishes
                </label>
                <div className="flex flex-wrap gap-2">
            {formData.dishes.map((dish, index) => (
                    <span
                      key={index}
                className="bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/50 dark:to-pink-900/50 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {dish}
                      <button
                  type="button"
                        onClick={() => handleRemoveDish(dish)}
                        className="ml-2 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300"
                  aria-label={`Remove ${dish}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add a dish..."
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.currentTarget;
                  if (input.value.trim()) {
                    handleAddDish(input.value.trim());
                    input.value = "";
                  }
                      }
                    }}
              aria-label="Add dish"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Photos
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
              aria-label="Upload photo"
                  />
                  <label
                    htmlFor="photo-upload"
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium py-2 px-4 rounded-lg cursor-pointer flex items-center hover:shadow-lg transition-all"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Upload Photo
                  </label>
                  {previewImage && (
                    <div className="ml-4">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
          disabled={isSubmitting}
          className={`bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium py-2 px-6 rounded-lg flex items-center hover:shadow-lg transition-all ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Submit Review
            </>
          )}
              </motion.button>
            </div>
          </form>
  );
};

export default function Page() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      restaurant: "Sushi Fusion",
      location: "London",
      rating: 4.5,
      review: "Amazing fusion of Japanese and European cuisine! The salmon nigiri with truffle oil was a revelation. The atmosphere is modern and sophisticated, perfect for date nights.",
      dishes: ["Truffle Salmon Nigiri", "Wagyu Beef Gyoza", "Matcha Tiramisu"],
      date: "2024-03-15",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
      priceRange: "€€€",
      cuisineType: "Japanese Fusion",
      openingHours: "12:00 - 23:00"
    },
    {
      id: "2",
      restaurant: "Bangkok Street Kitchen",
      location: "Berlin",
      rating: 4.2,
      review: "Authentic Thai street food with a modern twist. The pad thai was perfectly balanced, and the green curry had just the right amount of heat. Great value for money!",
      dishes: ["Pad Thai", "Green Curry", "Mango Sticky Rice"],
      date: "2024-03-10",
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&auto=format&fit=crop&q=60",
      priceRange: "€€",
      cuisineType: "Thai",
      openingHours: "11:00 - 22:00"
    },
    {
      id: "3",
      restaurant: "Seoul Kitchen",
      location: "Paris",
      rating: 4.8,
      review: "Exceptional Korean fusion experience! The kimchi carbonara was a masterpiece, and the bulgogi tacos were incredibly flavorful. The service was impeccable.",
      dishes: ["Kimchi Carbonara", "Bulgogi Tacos", "Gochujang Ice Cream"],
      date: "2024-03-05",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
      priceRange: "€€€",
      cuisineType: "Korean Fusion",
      openingHours: "12:00 - 23:30"
    },
    {
      id: "4",
      restaurant: "Wok & Roll",
      location: "Amsterdam",
      rating: 4.0,
      review: "Great casual dining spot with creative Asian fusion dishes. The bao burgers are a must-try, and the cocktails are inventive. Perfect for a casual night out.",
      dishes: ["Bao Burgers", "Dragon Roll", "Lychee Mojito"],
      date: "2024-03-01",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=60",
      priceRange: "€€",
      cuisineType: "Fusion",
      openingHours: "11:30 - 22:30"
    },
    {
      id: "5",
      restaurant: "Dragon's Breath",
      location: "Rome",
      rating: 4.6,
      review: "Incredible Chinese-Italian fusion! The Peking duck pizza was a revelation, and the dim sum selection was outstanding. The wine pairing suggestions were perfect.",
      dishes: ["Peking Duck Pizza", "Truffle Xiao Long Bao", "Tiramisu with Red Bean"],
      date: "2024-02-28",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=60",
      priceRange: "€€€",
      cuisineType: "Chinese Fusion",
      openingHours: "12:00 - 23:00"
    },
    {
      id: "6",
      restaurant: "Pho Street",
      location: "Madrid",
      rating: 4.3,
      review: "Authentic Vietnamese flavors with a Spanish twist. The pho was rich and flavorful, and the tapas-style small plates were perfect for sharing.",
      dishes: ["Spanish Pho", "Iberian Pork Banh Mi", "Churros with Pandan"],
      date: "2024-02-25",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60",
      priceRange: "€€",
      cuisineType: "Vietnamese Fusion",
      openingHours: "11:00 - 22:00"
    }
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [locations] = useState<Location[]>([
    {
      name: "London",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
      reviewCount: 10
    },
    {
      name: "Berlin",
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&auto=format&fit=crop&q=60",
      reviewCount: 8
    },
    {
      name: "Paris",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
      reviewCount: 7
    },
    {
      name: "Amsterdam",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=60",
      reviewCount: 5
    },
    {
      name: "Rome",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=60",
      reviewCount: 4
    },
    {
      name: "Madrid",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60",
      reviewCount: 3
    }
  ]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [dishSearchTerm, setDishSearchTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);
  const [activeFilter, setActiveFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceFilter, setPriceFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/reviews")
        const data = await response.json()
        setReviews(data)
        setFilteredReviews(data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReviews()
  }, [])

  useEffect(() => {
    let filtered = [...reviews]
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.cuisineType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    
    if (selectedLocation) {
      filtered = filtered.filter((review) => review.location === selectedLocation)
    }
    
    if (activeFilter === "photos") {
      filtered = filtered.filter((review) => review.image)
    } else if (activeFilter === "high-rated") {
      filtered = filtered.filter((review) => review.rating >= 4)
    }
    
    if (ratingFilter > 0) {
      filtered = filtered.filter((review) => review.rating >= ratingFilter)
    }
    
    if (priceFilter) {
      filtered = filtered.filter((review) => review.priceRange === priceFilter)
    }
    
    if (timeFilter) {
      filtered = filtered.filter((review) => review.openingHours.includes(timeFilter))
    }
    
    if (dishSearchTerm) {
      filtered = filtered.filter((review) =>
        review.dishes.some((dish) =>
          dish.toLowerCase().includes(dishSearchTerm.toLowerCase()),
        ),
      )
    }
    
    setFilteredReviews(filtered)
  }, [
    searchTerm,
    selectedLocation,
    activeFilter,
    ratingFilter,
    priceFilter,
    timeFilter,
    dishSearchTerm,
    reviews,
  ])
    
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true)
      } else {
        setShowScrollButton(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleFormSubmit = async (formData: NewReview) => {
    try {
      // Create a properly formatted review object with all required fields
      const newReview: Review = {
        id: Date.now().toString(),
        restaurant: formData.restaurant,
        location: formData.location,
        rating: formData.rating,
        review: formData.review,
        dishes: formData.dishes || [], // Ensure dishes array is never undefined
        date: new Date().toISOString(),
        image: formData.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60", // Default image if none provided
        priceRange: formData.priceRange || "€€",
        cuisineType: formData.cuisineType || "Fusion",
        openingHours: formData.openingHours || "11:00 - 22:00"
      };

      console.log("New review being added:", newReview); // Debug log

      // Update the reviews state with the new review at the beginning of the array
      setReviews(prevReviews => [newReview, ...prevReviews]);
      
      // Update filtered reviews to include the new review
      setFilteredReviews(prevFilteredReviews => [newReview, ...prevFilteredReviews]);
      
      // Close the modal
      setIsFormOpen(false);

      // Show success message
      console.log("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
    setSearchTerm("")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const RatingStars = ({ rating }: { rating: number }) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />,
      )
    }
    return <div className="flex">{stars}</div>
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 dark:from-orange-500/10 dark:to-pink-500/10 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text">
                  Discover Asian Fusion
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Across Europe
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                Explore the best Asian fusion restaurants, read authentic reviews, and share your culinary experiences with fellow food enthusiasts.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFormOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium py-3 px-6 rounded-full flex items-center shadow-lg hover:shadow-xl transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Write a Review
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const restaurantsSection = document.getElementById('restaurants-section');
                    if (restaurantsSection instanceof HTMLElement) {
                      window.scrollTo({ top: restaurantsSection.offsetTop, behavior: 'smooth' });
                    }
                  }}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-full flex items-center shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore Restaurants
                </motion.button>
              </div>
              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=100&h=100&fit=crop`}
                      alt={`User ${i}`}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Join <span className="font-semibold text-gray-900 dark:text-white">2,000+</span> food enthusiasts
                  </p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">4.9/5 from 500+ reviews</span>
                  </div>
                </div>
              </div>
        </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur-lg opacity-20"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60"
                    alt="Featured Restaurant"
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Featured Review</h3>
                      <div className="flex items-center bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-white fill-current" />
                        <span className="ml-1 text-white font-bold">4.8</span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      &ldquo;An incredible fusion of Asian flavors with European techniques. The tasting menu was a culinary journey!&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                          alt="Reviewer"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Food Critic</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8" id="restaurants-section">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text">
                Asian Fusion Reviews
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Discover the best Asian fusion restaurants in Europe
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium py-3 px-6 rounded-full flex items-center shadow-lg hover:shadow-xl transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Review
            </motion.button>
          </div>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sticky top-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text mb-4">
          Filters
        </h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Search by restaurant, location, or cuisine..."
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => handleLocationSelect(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  aria-label="Location"
                  title="Location"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Filter by
            </label>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveFilter("all")
                  setRatingFilter(0)
                  setPriceFilter("")
                  setTimeFilter("")
                  setDishSearchTerm("")
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                  activeFilter === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                All Reviews
              </button>
              <button
                onClick={() => {
                  setActiveFilter("photos")
                  setRatingFilter(0)
                  setPriceFilter("")
                  setTimeFilter("")
                  setDishSearchTerm("")
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                  activeFilter === "photos"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                With Photos
              </button>
              <button
                onClick={() => {
                  setActiveFilter("high-rated")
                  setRatingFilter(0)
                  setPriceFilter("")
                  setTimeFilter("")
                  setDishSearchTerm("")
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                  activeFilter === "high-rated"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                High Rated (4+)
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Rating
            </h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingFilter(star)}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    ratingFilter === star
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {star}+
                </button>
              ))}
              {ratingFilter > 0 && (
                <button
                  onClick={() => setRatingFilter(0)}
                  className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Price Range
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPriceFilter("€")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  priceFilter === "€"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                €
              </button>
              <button
                onClick={() => setPriceFilter("€€")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  priceFilter === "€€"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                €€
              </button>
              <button
                onClick={() => setPriceFilter("€€€")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  priceFilter === "€€€"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                €€€
              </button>
              {priceFilter && (
                <button
                  onClick={() => setPriceFilter("")}
                  className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Opening Hours
            </h3>
            <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  aria-label="Filter by Opening Hours"
                  title="Filter by Opening Hours"
            >
                  <option value="">All Hours</option>
                  <option value="11:00 - 22:00">11:00 - 22:00</option>
                  <option value="12:00 - 23:00">12:00 - 23:00</option>
                  <option value="11:30 - 22:30">11:30 - 22:30</option>
                  <option value="12:00 - 23:30">12:00 - 23:30</option>
                  <option value="10:00 - 22:00">10:00 - 22:00</option>
                  <option value="11:00 - 23:30">11:00 - 23:30</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Specific Dish
            </h3>
            <input
              type="text"
              value={dishSearchTerm}
              onChange={(e) => setDishSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Search for a specific dish..."
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-3">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 animate-pulse"
              >
                <div className="flex justify-between mb-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReviews.map((review) => (
              <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all"
                  >
                    {review.image && (
                      <div className="relative h-48">
                        <img
                          src={review.image}
                          alt={review.restaurant}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {review.restaurant}
                </h3>
                          <div className="flex items-center text-white/90">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{review.location}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-1 rounded-full">
                          <RatingStars rating={review.rating} />
                          <span className="ml-2 font-bold text-white">
                            {review.rating}/5
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(review.date)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {review.openingHours}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Utensils className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {review.cuisineType}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <ChefHat className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {review.priceRange}
                          </span>
                        </div>
                      </div>
                      {review.dishes.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Notable Dishes:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {review.dishes.map((dish, index) => (
                              <span
                                key={index}
                                className="bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/50 dark:to-pink-900/50 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm"
                              >
                                {dish}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {review.review}
                      </p>
                    </div>
              </motion.div>
                ))}
              </div>
        )}
      </div>
    </div>
  </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <ReviewForm 
          onSubmit={handleFormSubmit} 
          locations={locations}
        />
      </Modal>

  {showScrollButton && (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
      aria-label="Scroll to top"
    >
      ↑
    </motion.button>
  )}
</div>
)
}
