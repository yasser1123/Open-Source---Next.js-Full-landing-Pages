"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";
import Image from "next/image";

// Font setup
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Types
interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  category: string;
  rating: number;
  reviewCount: number;
  summary: string;
  description: string;
  publicationDate: string;
  publisher: string;
  pages: number;
  isbn: string;
}

interface Review {
  id: string;
  bookId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
}

// Sample data
const categoriesData: Category[] = [
  {
    id: "fiction",
    name: "Fiction",
    description: "Imaginative storytelling in various genres",
    count: 12
  },
  {
    id: "non-fiction",
    name: "Non-Fiction",
    description: "Factual and informative content",
    count: 8
  },
  {
    id: "mystery",
    name: "Mystery",
    description: "Suspenseful tales of intrigue and detection",
    count: 7
  },
  {
    id: "science-fiction",
    name: "Science Fiction",
    description: "Speculative fiction based on scientific concepts",
    count: 6
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Stories set in magical or supernatural worlds",
    count: 5
  },
  {
    id: "biography",
    name: "Biography",
    description: "Accounts of individuals' lives and experiences",
    count: 4
  }
];

const booksData: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    coverImage: "https://source.unsplash.com/QyhrCooZdMI/400x600",
    category: "fiction",
    rating: 4.5,
    reviewCount: 24,
    summary: "Between life and death there is a library, and within that library, the shelves go on forever.",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
    publicationDate: "2020-08-13",
    publisher: "Canongate Books",
    pages: 304,
    isbn: "9781786892720"
  },
  {
    id: "2",
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverImage: "https://source.unsplash.com/1tcgbYvUGvU/400x600",
    category: "science-fiction",
    rating: 4.8,
    reviewCount: 32,
    summary: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it.",
    publicationDate: "2021-05-04",
    publisher: "Ballantine Books",
    pages: 496,
    isbn: "9780593135204"
  },
  {
    id: "3",
    title: "Educated",
    author: "Tara Westover",
    coverImage: "https://source.unsplash.com/hHWxAJ63sQI/400x600",
    category: "biography",
    rating: 4.7,
    reviewCount: 41,
    summary: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    description: "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education, and no one to intervene when one of Tara's older brothers became violent.",
    publicationDate: "2018-02-20",
    publisher: "Random House",
    pages: 334,
    isbn: "9780399590504"
  },
  {
    id: "4",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    coverImage: "https://source.unsplash.com/VRj9QhOWrWY/400x600",
    category: "mystery",
    rating: 4.2,
    reviewCount: 36,
    summary: "A woman shoots her husband five times and then never speaks another word.",
    description: "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
    publicationDate: "2019-02-05",
    publisher: "Celadon Books",
    pages: 325,
    isbn: "9781250301697"
  },
  {
    id: "5",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    coverImage: "https://source.unsplash.com/lUO-BjCiZEA/400x600",
    category: "science-fiction",
    rating: 4.1,
    reviewCount: 28,
    summary: "From the Nobel Prize-winning author, a novel about an Artificial Friend who observes humans from her place in the store.",
    description: "Klara and the Sun, the first novel by Kazuo Ishiguro since he was awarded the Nobel Prize in Literature, tells the story of Klara, an Artificial Friend with outstanding observational qualities, who, from her place in the store, watches carefully the behavior of those who come in to browse, and of those who pass on the street outside.",
    publicationDate: "2021-03-02",
    publisher: "Knopf",
    pages: 320,
    isbn: "9780593318171"
  },
  {
    id: "6",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    coverImage: "https://source.unsplash.com/uE2T1tCFsn8/400x600",
    category: "fiction",
    rating: 4.6,
    reviewCount: 45,
    summary: "A woman who survived alone in the marsh becomes a murder suspect.",
    description: "For years, rumors of the \"Marsh Girl\" haunted Barkley Cove, a quiet fishing village. Kya Clark is barefoot and wild; unfit for polite society. So in late 1969, when the popular Chase Andrews is found dead, locals immediately suspect her.",
    publicationDate: "2018-08-14",
    publisher: "G.P. Putnam's Sons",
    pages: 379,
    isbn: "9780735219090"
  },
  {
    id: "7",
    title: "The House in the Cerulean Sea",
    author: "TJ Klune",
    coverImage: "https://source.unsplash.com/vHTCiGiONfs/400x600",
    category: "fantasy",
    rating: 4.7,
    reviewCount: 31,
    summary: "A magical island. A dangerous task. A burning secret.",
    description: "Linus Baker leads a quiet, solitary life. At forty, he lives in a tiny house with a devious cat and his old records. As a Case Worker at the Department in Charge Of Magical Youth, he spends his days overseeing the well-being of children in government-sanctioned orphanages.",
    publicationDate: "2020-03-17",
    publisher: "Tor Books",
    pages: 396,
    isbn: "9781250217288"
  },
  {
    id: "8",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    coverImage: "https://source.unsplash.com/o4c2zoVhjSw/400x600",
    category: "non-fiction",
    rating: 4.6,
    reviewCount: 52,
    summary: "How Homo sapiens became Earth's dominant species.",
    description: "A groundbreaking narrative of humanity's creation and evolution that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be human.",
    publicationDate: "2014-02-10",
    publisher: "Harper",
    pages: 443,
    isbn: "9780062316097"
  },
  {
    id: "9",
    title: "The Invisible Life of Addie LaRue",
    author: "V.E. Schwab",
    coverImage: "https://source.unsplash.com/L2cxSuKWbpo/400x600",
    category: "fantasy",
    rating: 4.4,
    reviewCount: 39,
    summary: "A girl makes a Faustian bargain to live forever and is cursed to be forgotten by everyone she meets.",
    description: "France, 1714: in a moment of desperation, a young woman makes a Faustian bargain to live forever and is cursed to be forgotten by everyone she meets. Thus begins the extraordinary life of Addie LaRue, and a dazzling adventure that will play out across centuries and continents, across history and art, as a young woman learns how far she will go to leave her mark on the world.",
    publicationDate: "2020-10-06",
    publisher: "Tor Books",
    pages: 448,
    isbn: "9780765387561"
  },
  {
    id: "10",
    title: "The Thursday Murder Club",
    author: "Richard Osman",
    coverImage: "https://source.unsplash.com/8Vt2haqll5A/400x600",
    category: "mystery",
    rating: 4.2,
    reviewCount: 25,
    summary: "Four septuagenarians meet weekly to solve cold cases, then a real murder occurs.",
    description: "In a peaceful retirement village, four unlikely friends meet weekly in the Jigsaw Room to discuss unsolved crimes; together they call themselves the Thursday Murder Club. When a local developer is found dead with a mysterious photograph left next to the body, the Thursday Murder Club suddenly find themselves in the middle of their first live case.",
    publicationDate: "2020-09-03",
    publisher: "Viking",
    pages: 382,
    isbn: "9780241425442"
  }
];

const reviewsData: Review[] = [
  {
    id: "r1",
    bookId: "1",
    userName: "Emma Thompson",
    userImage: "https://source.unsplash.com/7YVZYZeITc8/100x100",
    rating: 5,
    comment: "This book changed my perspective on life choices. Beautifully written with characters that feel real and relatable.",
    date: "2023-03-15"
  },
  {
    id: "r2",
    bookId: "1",
    userName: "Michael Scott",
    userImage: "https://source.unsplash.com/d1UPkiFd04A/100x100",
    rating: 4,
    comment: "A thought-provoking read that makes you consider the roads not taken. Couldn't put it down!",
    date: "2023-02-28"
  },
  {
    id: "r3",
    bookId: "2",
    userName: "Sophia Chen",
    userImage: "https://source.unsplash.com/mEZ3PoFGs_k/100x100",
    rating: 5,
    comment: "As a science enthusiast, I loved the accurate portrayal of physics and astronomy. The story is gripping from start to finish.",
    date: "2023-03-20"
  },
  {
    id: "r4",
    bookId: "3",
    userName: "James Wilson",
    userImage: "https://source.unsplash.com/QXevDflbl8A/100x100",
    rating: 5,
    comment: "One of the most inspiring memoirs I've ever read. Tara's journey is nothing short of remarkable.",
    date: "2023-01-12"
  },
  {
    id: "r5",
    bookId: "4",
    userName: "Olivia Martinez",
    userImage: "https://source.unsplash.com/hRwrvvZHk70/100x100",
    rating: 4,
    comment: "The twist at the end completely caught me off guard! A masterclass in psychological thrillers.",
    date: "2023-02-05"
  },
  {
    id: "r6",
    bookId: "5",
    userName: "David Kim",
    userImage: "https://source.unsplash.com/6W4F62sN_yI/100x100",
    rating: 4,
    comment: "Ishiguro's exploration of AI consciousness is subtle yet profound. A beautiful, melancholic novel.",
    date: "2023-03-01"
  },
  {
    id: "r7",
    bookId: "6",
    userName: "Elizabeth Taylor",
    userImage: "https://source.unsplash.com/rDEOVtE7vOs/100x100",
    rating: 5,
    comment: "The descriptions of the marsh are so vivid you can almost feel the humidity. A stunning debut novel.",
    date: "2023-01-25"
  },
  {
    id: "r8",
    bookId: "7",
    userName: "Ryan Johnson",
    userImage: "https://source.unsplash.com/ifrYlqOjvQg/100x100",
    rating: 5,
    comment: "Heartwarming and magical. This book feels like a warm hug on a cold day.",
    date: "2023-02-17"
  },
  {
    id: "r9",
    bookId: "8",
    userName: "Sarah Adams",
    userImage: "https://source.unsplash.com/3TLl_97HNJo/100x100",
    rating: 4,
    comment: "A fascinating overview of human history that challenges many conventional narratives.",
    date: "2023-03-10"
  },
  {
    id: "r10",
    bookId: "9",
    userName: "Thomas Brown",
    userImage: "https://source.unsplash.com/ZHvM3XIOHoE/100x100",
    rating: 5,
    comment: "Addie's story spans centuries but remains intimate and personal. Schwab's writing is enchanting.",
    date: "2023-01-30"
  },
  {
    id: "r11",
    bookId: "10",
    userName: "Rachel Green",
    userImage: "https://source.unsplash.com/WNoLnJo7tS8/100x100",
    rating: 4,
    comment: "Charming, funny, and surprisingly poignant. The characters leap off the page.",
    date: "2023-02-22"
  }
];

// Utility Components
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating) ? "text-amber-500" : "text-gray-300"
          } ${i < rating && i >= Math.floor(rating) ? "text-amber-400" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-gray-600 text-sm">{rating.toFixed(1)}</span>
    </div>
  );
};

const CategoryBadge = ({ category }: { category: string }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      fiction: "bg-blue-100 text-blue-800",
      "non-fiction": "bg-green-100 text-green-800",
      mystery: "bg-purple-100 text-purple-800",
      "science-fiction": "bg-indigo-100 text-indigo-800",
      fantasy: "bg-pink-100 text-pink-800",
      biography: "bg-yellow-100 text-yellow-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getCategoryName = (categoryId: string) => {
    const category = categoriesData.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>
      {getCategoryName(category)}
    </span>
  );
};

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const BookImage = ({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [imgError, setImgError] = useState<boolean>(false);

  // Fallback if image fails to load
  const handleError = () => {
    if (!imgError) {
      // Set a fallback color block with first letter of book title
      setImgError(true);
      setImgSrc("");
    }
  };

  return (
    <>
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority={priority}
          onError={handleError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-indigo-700 text-white text-4xl font-bold">
          {alt.charAt(0)}
        </div>
      )}
    </>
  );
};

const UserAvatar = ({ src, alt }: { src: string; alt: string }) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [imgError, setImgError] = useState<boolean>(false);

  const handleError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc("");
    }
  };

  return (
    <>
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="40px"
          className="object-cover"
          onError={handleError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700 text-sm font-bold">
          {alt.charAt(0)}
        </div>
      )}
    </>
  );
};

const BookCard = ({ book, onClick }: BookCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <div className="relative h-64 overflow-hidden">
        <BookImage 
          src={book.coverImage} 
          alt={book.title} 
          priority={book.id === "1"} 
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
            {book.title}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        <div className="flex items-center justify-between">
          <StarRating rating={book.rating} />
          <CategoryBadge category={book.category} />
        </div>
        <p className="mt-2 text-sm text-gray-700 line-clamp-2">
          {book.summary}
        </p>
      </div>
    </motion.div>
  );
};

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center mb-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
          <UserAvatar src={review.userImage} alt={review.userName} />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{review.userName}</h4>
          <div className="flex items-center">
            <StarRating rating={review.rating} />
            <span className="ml-2 text-xs text-gray-500">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 text-sm">{review.comment}</p>
    </div>
  );
};

// Update the ReviewFormProps interface to include onClose
interface ReviewFormProps {
  onSubmit: (name: string, rating: number, comment: string) => void;
  onClose: () => void;
}

// Update the ReviewForm component to use onClose
const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && rating && comment) {
      onSubmit(name, rating, comment);
    }
  };
  
  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Rating
        </label>
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <div 
              key={star}
              className="relative"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <button
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none p-1"
                aria-label={`Rate ${star} out of 5 stars`}
              >
                <svg
                  className={`w-12 h-12 transition-all duration-200 ${
                    (hoveredRating ? star <= hoveredRating : star <= rating)
                      ? "text-amber-500"
                      : "text-gray-300"
                  } ${
                    star === rating || star === hoveredRating ? "scale-110" : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {star}
                </span>
              </button>
              
              {/* Tooltips */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className={`px-2 py-1 bg-gray-800 text-white text-xs rounded transition-opacity ${
                  hoveredRating === star ? "opacity-100" : "opacity-0"
                }`}>
                  {ratingLabels[star as keyof typeof ratingLabels]}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {rating > 0 && (
          <div className="text-amber-500 font-medium text-sm ml-2">
            {ratingLabels[rating as keyof typeof ratingLabels]}
          </div>
        )}
        {rating === 0 && (
          <div className="text-gray-500 text-sm ml-2">
            Select a rating
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="comment">
          Your Review
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name || !rating || !comment}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-lg transition-colors ${
            !name || !rating || !comment 
              ? "opacity-60 cursor-not-allowed" 
              : "hover:bg-indigo-700"
          }`}
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

// Main Component
const BookReview2 = () => {
  // States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [books, setBooks] = useState<Book[]>(booksData);
  const [reviews, setReviews] = useState<Review[]>(reviewsData);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs
  const feedRef = useRef<HTMLDivElement>(null);

  // For client-side rendering check
  const [isClient, setIsClient] = useState(false);

  // Simulating loading
  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to feed
  const scrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter books by category and search query
  const filteredBooks = books.filter((book) => {
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get reviews for a book
  const getBookReviews = (bookId: string) => {
    return reviews.filter((review) => review.bookId === bookId);
  };

  // Add a new review
  const addReview = (bookId: string, name: string, rating: number, comment: string) => {
    // Default avatar for new reviews that will work in any environment
    const defaultAvatar = "https://source.unsplash.com/7YVZYZeITc8/100x100";
    
    const newReview: Review = {
      id: `r${reviews.length + 1}`,
      bookId,
      userName: name,
      userImage: defaultAvatar,
      rating,
      comment,
      date: new Date().toISOString(),
    };
    
    setReviews([...reviews, newReview]);
    
    // Update book rating - with safeguards against division by zero
    const bookReviews = [...getBookReviews(bookId), newReview];
    const reviewCount = bookReviews.length;
    const averageRating = reviewCount > 0 
      ? bookReviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
      : 0;
    
    setBooks(
      books.map((book) =>
        book.id === bookId
          ? { ...book, rating: averageRating, reviewCount }
          : book
      )
    );
  };

  // Loading skeleton
  if (!isClient || isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${inter.variable} ${playfair.variable} font-sans`}>
        <div className="animate-pulse">
          {/* Hero section skeleton */}
          <div className="h-[70vh] bg-gray-200 flex items-center justify-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <div className="h-12 bg-gray-300 rounded mb-4 w-3/4 mx-auto"></div>
                <div className="h-6 bg-gray-300 rounded mb-6 w-1/2 mx-auto"></div>
                <div className="h-12 bg-gray-300 rounded w-40 mx-auto"></div>
              </div>
            </div>
          </div>
          
          {/* Filter section skeleton */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap gap-2 mb-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-10 bg-gray-300 rounded-full w-24"></div>
              ))}
            </div>
            
            {/* Books grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 8].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg overflow-hidden shadow">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Return main component UI
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.variable} ${playfair.variable} font-sans`}>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-700 z-0">
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay"
          }}></div>
          
          {/* Animated floating elements */}
          <motion.div 
            className="absolute w-20 h-20 rounded-full bg-blue-500 opacity-20 blur-xl"
            animate={{ 
              x: [0, 40, 0], 
              y: [0, 20, 0],
              scale: [1, 1.1, 1]
            }} 
            transition={{ 
              repeat: Infinity, 
              duration: 12, 
              ease: "easeInOut" 
            }}
            style={{ top: '20%', left: '10%' }}
          />
          <motion.div 
            className="absolute w-32 h-32 rounded-full bg-indigo-600 opacity-10 blur-xl"
            animate={{ 
              x: [0, -30, 0], 
              y: [0, 30, 0],
              scale: [1, 1.2, 1]
            }} 
            transition={{ 
              repeat: Infinity, 
              duration: 15, 
              ease: "easeInOut" 
            }}
            style={{ top: '40%', right: '15%' }}
          />
          <motion.div 
            className="absolute w-24 h-24 rounded-full bg-amber-500 opacity-15 blur-xl"
            animate={{ 
              x: [0, 20, 0], 
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }} 
            transition={{ 
              repeat: Infinity, 
              duration: 10, 
              ease: "easeInOut" 
            }}
            style={{ bottom: '20%', left: '30%' }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`text-5xl md:text-6xl font-bold mb-6 font-playfair`}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover Your Next{" "}
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-amber-400 relative inline-block"
              >
                Great Read
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-1 bg-amber-400 opacity-70"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                />
              </motion.span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-xl md:text-2xl mb-8 text-blue-100"
            >
              Explore honest reviews and recommendations from fellow book lovers
            </motion.p>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
              whileHover={{ scale: 1.05, backgroundColor: "#d97706" }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToFeed}
              className="px-8 py-3 bg-amber-500 text-white rounded-full font-medium text-lg shadow-lg transition-colors"
            >
              Explore Books
            </motion.button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="flex flex-col items-center"
          >
            <p className="text-white text-sm mb-2">Scroll Down</p>
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </motion.div>
        </motion.div>
        
        <div className="absolute bottom-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-gray-50 w-full">
            <path fill="currentColor" fillOpacity="1" d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,117.3C672,117,768,171,864,181.3C960,192,1056,160,1152,133.3C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Filters and Books Section */}
      <section className="container mx-auto px-4 py-12" ref={feedRef}>
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-playfair">Explore Categories</h2>
          
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search books or authors..."
                className="w-full py-3 pl-10 pr-4 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Categories
            </button>
            {categoriesData.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
        
        {/* Books grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-playfair">
            {selectedCategory === "all" 
              ? "Featured Books" 
              : `${categoriesData.find(c => c.id === selectedCategory)?.name || ""} Books`}
          </h2>
          
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12 bg-gray-100 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No books found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter settings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onClick={() => setSelectedBook(book)} 
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedBook(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:flex">
                <div className="md:w-1/3 bg-indigo-50 p-6 flex justify-center">
                  <div className="relative w-48 h-72 shadow-lg rounded overflow-hidden">
                    <BookImage
                      src={selectedBook.coverImage}
                      alt={selectedBook.title}
                    />
                  </div>
                </div>
                
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 font-playfair">
                        {selectedBook.title}
                      </h2>
                      <p className="text-lg text-gray-600 mb-2">
                        by {selectedBook.author}
                      </p>
                    </div>
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setSelectedBook(null)}
                      aria-label="Close details"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <StarRating rating={selectedBook.rating} />
                    <span className="ml-2 text-gray-600">
                      ({selectedBook.reviewCount} reviews)
                    </span>
                    <CategoryBadge category={selectedBook.category} />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700">{selectedBook.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Publisher</h4>
                      <p className="text-gray-900">{selectedBook.publisher}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Publication Date</h4>
                      <p className="text-gray-900">
                        {new Date(selectedBook.publicationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Pages</h4>
                      <p className="text-gray-900">{selectedBook.pages}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">ISBN</h4>
                      <p className="text-gray-900">{selectedBook.isbn}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Write a Review
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-playfair">
                  Reviews
                </h3>
                
                {getBookReviews(selectedBook.id).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getBookReviews(selectedBook.id).map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Review Form Modal */}
      <AnimatePresence>
        {isReviewModalOpen && selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setIsReviewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-indigo-600 p-4 text-white">
                <h3 className="text-xl font-bold">Write a Review</h3>
                <p className="text-indigo-100">for {selectedBook.title}</p>
              </div>
              
              <ReviewForm 
                onSubmit={(name, rating, comment) => {
                  addReview(selectedBook.id, name, rating, comment);
                  setIsReviewModalOpen(false);
                }}
                onClose={() => setIsReviewModalOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookReview2;
