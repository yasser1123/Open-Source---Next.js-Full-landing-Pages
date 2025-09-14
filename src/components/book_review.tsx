"use client";

import { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Star, ArrowRight, ChevronDown, ChevronUp, X } from "lucide-react";
import { Titillium_Web } from "next/font/google";

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "900"],
});

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  rating: number;
  description: string;
  review: string;
  image: string;
  price: string;
  publisher: string;
  publishedDate: string;
}

interface Review {
  id: number;
  bookId: number;
  review: string;
  rating: number;
  date: string;
  userName: string;
  userImage: string;
}

interface BookCardProps {
  book: Book;
  reviews: Review[];
  onAddReview: (bookId: number, review: string, rating: number) => void;
}

interface FilterOptionProps {
  filter: string;
  setFilter: (filter: string) => void;
  label: string;
  active: boolean;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: string, rating: number) => void;
}

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

interface ReviewCardProps {
  review: Review;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "unstyled";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit";
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

interface FilterSectionProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

interface BookFeedProps {
  books: Book[];
  reviews: Review[];
  activeCategory: string;
  onAddReview: (bookId: number, review: string, rating: number) => void;
}

interface HeroSectionProps {
  scrollToFeed: () => void;
}

interface HeaderProps {
  scrollToFeed: () => void;
}

interface LayoutProps {
  children: React.ReactNode;
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

interface MotionDivProps {
  children: React.ReactNode;
  className?: string;
}

interface AnimatePresenceProps {
  children: React.ReactNode;
}

interface BookDetailModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  onAddReview: (bookId: number, review: string, rating: number) => void;
}

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

interface SortOption {
  value: string;
  label: string;
}

interface SortingProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

interface PriceRange {
  min: number;
  max: number;
}

interface PriceSliderProps {
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
}

interface ClearFiltersProps {
  setActiveCategory: (category: string) => void;
  setSortOption: (option: string) => void;
  setPriceRange: (range: PriceRange) => void;
}

interface ActiveFiltersProps {
  activeCategory: string;
  sortOption: string;
  priceRange: PriceRange;
  setActiveCategory: (category: string) => void;
  setSortOption: (option: string) => void;
  setPriceRange: (range: PriceRange) => void;
}

interface FilterButtonProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  setShowMobileFilters: (show: boolean) => void;
  showMobileFilters: boolean;
}

interface MobileFilterPanelProps {
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
}

interface DesktopFilterPanelProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
}

interface BookGridProps {
  books: Book[];
  reviews: Review[];
  onAddReview: (bookId: number, review: string, rating: number) => void;
}

interface LoadMoreProps {
  hasMore: boolean;
  onLoadMore: () => void;
}

interface BackToTopProps {
  visible: boolean;
}

interface ScrollToTopButtonProps {
  onClick: () => void;
  visible: boolean;
}

interface HeroBackgroundProps {
  className?: string;
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

interface BookMetaProps {
  author: string;
  publisher: string;
  publishedDate: string;
  className?: string;
}

interface BookActionsProps {
  onViewDetails: () => void;
  onAddToCart: () => void;
}

interface DetailsButtonProps {
  onClick: () => void;
}

interface AddToCartButtonProps {
  onClick: () => void;
}

interface BookImageProps {
  src: string;
  alt: string;
}

interface BookInfoProps {
  title: string;
  author: string;
  rating: number;
  price: string;
}

interface BookDescriptionProps {
  description: string;
}

interface ViewReviewsButtonProps {
  reviewCount: number;
  onClick: () => void;
}

interface ReviewFormProps {
  onSubmit: (review: string, rating: number) => void;
  bookId: number;
}

interface ReviewTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

interface ReviewRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

interface ReviewSubmitButtonProps {
  disabled: boolean;
}

interface ReviewListProps {
  reviews: Review[];
}

interface ReviewPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface ReviewPageButtonProps {
  page: number;
  active: boolean;
  onClick: (page: number) => void;
}

interface ReviewsSectionProps {
  bookId: number;
  initialReviews: Review[];
}

interface BookDetailsSectionProps {
  book: Book;
}

interface BookReviewsSectionProps {
  bookId: number;
  initialReviews: Review[];
}

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

interface ModalBodyProps {
  children: React.ReactNode;
}

interface ModalFooterProps {
  children: React.ReactNode;
}

interface BookModalDetailsProps {
  book: Book;
}

interface BookModalReviewsProps {
  bookId: number;
  initialReviews: Review[];
}

interface BookModalReviewFormProps {
  onSubmit: (review: string, rating: number) => void;
}

interface UserAvatarProps {
  name: string;
  image?: string;
}

interface ReviewDateProps {
  date: string;
}

interface ReviewTextProps {
  text: string;
}

interface NoReviewsProps {
  message: string;
}

interface LoadMoreReviewsProps {
  hasMore: boolean;
  onLoadMore: () => void;
}

interface ReviewSectionHeadingProps {
  title: string;
  reviewCount: number;
}

interface SortReviewsProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

interface ReviewSortOptionProps {
  value: string;
  label: string;
  selected: boolean;
  onChange: (value: string) => void;
}

interface ReviewsListProps {
  reviews: Review[];
}

interface ReviewItemProps {
  review: Review;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface PageButtonProps {
  page: number;
  active: boolean;
  onClick: (page: number) => void;
}

interface EllipsisProps {
  className?: string;
}

interface ActivePageProps {
  page: number;
  className?: string;
}

interface InactivePageProps {
  page: number;
  className?: string;
}

interface FirstPageProps {
  className?: string;
}

interface LastPageProps {
  className?: string;
  totalPages: number;
}

interface PrevButtonProps {
  onClick: () => void;
  disabled: boolean;
}

interface NextButtonProps {
  onClick: () => void;
  disabled: boolean;
}

interface PageNumberProps {
  page: number;
  active: boolean;
  onClick: (page: number) => void;
}

interface FilterIconProps {
  className?: string;
}

interface StarIconProps {
  filled?: boolean;
  className?: string;
}

interface ChevronDownIconProps {
  className?: string;
}

interface ChevronUpIconProps {
  className?: string;
}

interface CloseIconProps {
  className?: string;
}

interface ArrowRightIconProps {
  className?: string;
}

interface FilterButtonIconProps {
  className?: string;
}

interface MobileFilterPanelCloseIconProps {
  className?: string;
}

interface ClearFiltersButtonIconProps {
  className?: string;
}

interface ActiveFilterRemoveIconProps {
  className?: string;
}

interface PriceSliderHandleIconProps {
  className?: string;
}

interface PriceSliderTrackIconProps {
  className?: string;
}

interface PriceSliderRangeIconProps {
  className?: string;
}

interface BookCardImagePlaceholderProps {
  className?: string;
}

interface BookCardContentPlaceholderProps {
  className?: string;
}

interface BookCardActionsPlaceholderProps {
  className?: string;
}

interface BookGridPlaceholderProps {
  className?: string;
}

interface ReviewModalSkeletonProps {
  className?: string;
}

interface ReviewCardSkeletonProps {
  className?: string;
}

interface ReviewListSkeletonProps {
  className?: string;
}

interface BookDetailModalSkeletonProps {
  className?: string;
}

interface BookCardSkeletonProps {
  className?: string;
}

interface BookGridSkeletonProps {
  className?: string;
}

interface FilterSectionSkeletonProps {
  className?: string;
}

interface PageSkeletonProps {
  className?: string;
}

interface FilterIconSkeletonProps {
  className?: string;
}

interface StarIconSkeletonProps {
  className?: string;
}

interface ChevronDownIconSkeletonProps {
  className?: string;
}

interface ChevronUpIconSkeletonProps {
  className?: string;
}

interface CloseIconSkeletonProps {
  className?: string;
}

interface ArrowRightIconSkeletonProps {
  className?: string;
}

interface FilterButtonIconSkeletonProps {
  className?: string;
}

interface MobileFilterPanelCloseIconSkeletonProps {
  className?: string;
}

interface ClearFiltersButtonIconSkeletonProps {
  className?: string;
}

interface ActiveFilterRemoveIconSkeletonProps {
  className?: string;
}

interface PriceSliderHandleIconSkeletonProps {
  className?: string;
}

interface PriceSliderTrackIconSkeletonProps {
  className?: string;
}

interface PriceSliderRangeIconSkeletonProps {
  className?: string;
}

interface BookCardImagePlaceholderSkeletonProps {
  className?: string;
}

interface BookCardContentPlaceholderSkeletonProps {
  className?: string;
}

interface BookCardActionsPlaceholderSkeletonProps {
  className?: string;
}

interface BookGridPlaceholderSkeletonProps {
  className?: string;
}

interface ReviewModalSkeletonSkeletonProps {
  className?: string;
}

interface ReviewCardSkeletonSkeletonProps {
  className?: string;
}

interface ReviewListSkeletonSkeletonProps {
  className?: string;
}

interface BookDetailModalSkeletonSkeletonProps {
  className?: string;
}

interface BookCardSkeletonSkeletonProps {
  className?: string;
}

interface BookGridSkeletonSkeletonProps {
  className?: string;
}

interface FilterSectionSkeletonSkeletonProps {
  className?: string;
}

interface PageSkeletonSkeletonProps {
  className?: string;
}

interface ChevronLeftIconProps {
  className?: string;
}

interface ChevronRightIconProps {
  className?: string;
}

const StarIcon: React.FC<StarIconProps> = ({ filled, className }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 15.27L16.18 18 14.54 11.97 20 7.24 13.81 6.63 10 0 6.19 6.63 0 7.24 5.46 11.97 3.82 18 10 15.27Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({ className }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ChevronUpIcon: React.FC<ChevronUpIconProps> = ({ className }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m14 9-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const CloseIcon: React.FC<CloseIconProps> = ({ className }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m6 6 12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ArrowRightIcon: React.FC<ArrowRightIconProps> = ({ className }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 6 15 12 9 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const FilterButtonIcon: React.FC<FilterButtonIconProps> = ({ className }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.167 10h11.666" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.667 4.375v11.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const MobileFilterPanelCloseIcon: React.FC<MobileFilterPanelCloseIconProps> = ({
  className,
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m6 6 12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ClearFiltersButtonIcon: React.FC<ClearFiltersButtonIconProps> = ({
  className,
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m6 6 12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ActiveFilterRemoveIcon: React.FC<ActiveFilterRemoveIconProps> = ({
  className,
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m6 6 12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const PriceSliderHandleIcon: React.FC<PriceSliderHandleIconProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const PriceSliderTrackIcon: React.FC<PriceSliderTrackIconProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const PriceSliderRangeIcon: React.FC<PriceSliderRangeIconProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const BookCardImagePlaceholderIcon: React.FC<BookCardImagePlaceholderProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const BookCardContentPlaceholderIcon: React.FC<BookCardContentPlaceholderProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const BookCardActionsPlaceholderIcon: React.FC<BookCardActionsPlaceholderProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const BookGridPlaceholderIcon: React.FC<BookGridPlaceholderProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const ReviewModalSkeletonIcon: React.FC<ReviewModalSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const ReviewCardSkeletonIcon: React.FC<ReviewCardSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const ReviewListSkeletonIcon: React.FC<ReviewListSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const BookDetailModalSkeletonIcon: React.FC<BookDetailModalSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const BookCardSkeletonIcon: React.FC<BookCardSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const BookGridSkeletonIcon: React.FC<BookGridSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const FilterSectionSkeletonIcon: React.FC<FilterSectionSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const PageSkeletonIcon: React.FC<PageSkeletonProps> = ({ className }) => {
  return <div className={className}></div>;
};

const FilterIconSkeletonIcon: React.FC<FilterIconSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const StarIconSkeletonIcon: React.FC<StarIconSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const ChevronDownIconSkeletonIcon: React.FC<ChevronDownIconSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const ChevronUpIconSkeletonIcon: React.FC<ChevronUpIconSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const CloseIconSkeletonIcon: React.FC<CloseIconSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const ArrowRightIconSkeletonIcon: React.FC<ArrowRightIconSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const FilterButtonIconSkeletonIcon: React.FC<FilterButtonIconSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const MobileFilterPanelCloseIconSkeletonIcon: React.FC<MobileFilterPanelCloseIconSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const ClearFiltersButtonIconSkeletonIcon: React.FC<ClearFiltersButtonIconSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const ActiveFilterRemoveIconSkeletonIcon: React.FC<ActiveFilterRemoveIconSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const PriceSliderHandleIconSkeletonIcon: React.FC<PriceSliderHandleIconSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const PriceSliderTrackIconSkeletonIcon: React.FC<PriceSliderTrackIconSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const PriceSliderRangeIconSkeletonIcon: React.FC<PriceSliderRangeIconSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const BookCardImagePlaceholderIconSkeletonIcon: React.FC<BookCardImagePlaceholderSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const BookCardContentPlaceholderIconSkeletonIcon: React.FC<BookCardContentPlaceholderSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const BookCardActionsPlaceholderIconSkeletonIcon: React.FC<BookCardActionsPlaceholderSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const BookGridPlaceholderIconSkeletonIcon: React.FC<BookGridPlaceholderSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const ReviewModalSkeletonIconSkeletonIcon: React.FC<ReviewModalSkeletonSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const ReviewCardSkeletonIconSkeletonIcon: React.FC<ReviewCardSkeletonSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const ReviewListSkeletonIconSkeletonIcon: React.FC<ReviewListSkeletonSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const BookDetailModalSkeletonIconSkeletonIcon: React.FC<BookDetailModalSkeletonSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const BookCardSkeletonIconSkeletonIcon: React.FC<BookCardSkeletonSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const BookGridSkeletonIconSkeletonIcon: React.FC<BookGridSkeletonSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const FilterSectionSkeletonIconSkeletonIcon: React.FC<FilterSectionSkeletonSkeletonProps> =
  ({ className }) => {
    return <div className={className}></div>;
  };

const PageSkeletonIconSkeletonIcon: React.FC<PageSkeletonSkeletonProps> = ({
  className,
}) => {
  return <div className={className}></div>;
};

const ChevronLeftIcon: React.FC<ChevronLeftIconProps> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Ellipsis: React.FC<EllipsisProps> = ({ className }) => (
  <span className={`text-gray-500 px-3 py-1 ${className || ""}`}>...</span>
);

const ActivePage: React.FC<ActivePageProps> = ({ page, className }) => (
  <span
    className={`px-3 py-1 rounded-lg font-medium bg-blue-500 text-white ${className || ""}`}
  >
    {page}
  </span>
);

const InactivePage: React.FC<InactivePageProps> = ({ page, className }) => (
  <button
    className={`px-3 py-1 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
  >
    {page}
  </button>
);

const FirstPage: React.FC<FirstPageProps> = ({ className }) => (
  <button
    className={`px-3 py-1 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
  >
    1
  </button>
);

const LastPage: React.FC<LastPageProps> = ({ className, totalPages }) => (
  <button
    className={`px-3 py-1 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
  >
    {totalPages}
  </button>
);

const PageNumber: React.FC<PageNumberProps> = ({ page, active, onClick }) => {
  const handleClick = () => {
    onClick(page);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1 rounded-lg font-medium transition-all ${
        active
          ? "bg-blue-500 text-white"
          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      }`}
    >
      {page}
    </button>
  );
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center mt-6 space-x-2">
      <PrevButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
      <PageNumber page={1} active={currentPage === 1} onClick={onPageChange} />
      {currentPage > 3 && <Ellipsis />}
      {pages.map((page) => {
        if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
          return (
            <PageNumber
              key={page}
              page={page}
              active={page === currentPage}
              onClick={onPageChange}
            />
          );
        }
        return null;
      })}
      {currentPage < totalPages - 2 && <Ellipsis />}
      <LastPage
        totalPages={totalPages}
        className={currentPage === totalPages ? "bg-blue-500 text-white" : ""}
      />
      <NextButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </div>
  );
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ bookId, initialReviews }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const sortedReviews = [...initialReviews].sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOption === "highest") {
        return b.rating - a.rating;
      } else if (sortOption === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    const reviewsPerPage = 5;
    const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

    setReviews(sortedReviews.slice(0, reviewsPerPage));
    setTotalPages(totalPages);
    setCurrentPage(1);
  }, [initialReviews, sortOption]);

  const handlePageChange = (page: number) => {
    const sortedReviews = [...initialReviews].sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOption === "highest") {
        return b.rating - a.rating;
      } else if (sortOption === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    const reviewsPerPage = 5;
    const startIndex = (page - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;

    setReviews(sortedReviews.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

  return (
    <div>
      <ReviewSectionHeading title="Reviews" reviewCount={initialReviews.length} />
      <SortReviews sortOption={sortOption} setSortOption={setSortOption} />
      {reviews.length > 0 ? (
        <ReviewsList reviews={reviews} />
      ) : (
        <NoReviews message="No reviews available." />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
  reviews,
  onAddReview,
}) => {
  const [localReviews, setLocalReviews] = useState(reviews);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);

  const reviewsPerPage = 5;

  useEffect(() => {
    const sortedReviews = [...reviews].sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOption === "highest") {
        return b.rating - a.rating;
      } else if (sortOption === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
    const hasMore = totalPages > 1;

    setLocalReviews(sortedReviews.slice(0, reviewsPerPage));
    setHasMore(hasMore);
    setCurrentPage(1);
  }, [reviews, sortOption]);

  const handleAddReview = (bookId: number, review: string, rating: number) => {
    const newReview = {
      id: localReviews.length + 1,
      bookId,
      review,
      rating,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      userName: "You",
      userImage: "",
    };

    const sortedReviews = [...localReviews, newReview].sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOption === "highest") {
        return b.rating - a.rating;
      } else if (sortOption === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
    const hasMore = totalPages > 1;

    setLocalReviews(sortedReviews.slice(0, reviewsPerPage));
    setHasMore(hasMore);
    setCurrentPage(1);

    onAddReview(bookId, review, rating);
  };

  const handleLoadMore = () => {
    if (isLoading) return;

    setIsLoading(true);

    const sortedReviews = [...reviews].sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOption === "highest") {
        return b.rating - a.rating;
      } else if (sortOption === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;

    const additionalReviews = sortedReviews.slice(startIndex, endIndex);

    const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
    const hasMore = nextPage < totalPages;

    setTimeout(() => {
      setLocalReviews((prevReviews) => [...prevReviews, ...additionalReviews]);
      setHasMore(hasMore);
      setCurrentPage(nextPage);
      setIsLoading(false);
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={book.title}>
      <ModalHeader title={book.title} onClose={onClose} />
      <ModalBody>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <BookModalDetails book={book} />
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Add your review</h3>
              <BookModalReviewForm
                onSubmit={(review, rating) => handleAddReview(book.id, review, rating)}
              />
            </div>
            <div className="mt-8">
              <ReviewsSection bookId={book.id} initialReviews={localReviews} />
              <LoadMoreReviews hasMore={hasMore} onLoadMore={handleLoadMore} />
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="unstyled" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        {children}
      </motion.div>
    </div>
  );
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex justify-between items-center p-6 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

const ModalBody: React.FC<ModalBodyProps> = ({ children }) => {
  return <div className="p-6">{children}</div>;
};

const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => {
  return <div className="p-6 border-t border-gray-200">{children}</div>;
};

const BookModalDetails: React.FC<BookModalDetailsProps> = ({ book }) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="relative w-full max-w-[240px] h-[360px] group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-102"
            />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h2>
          <BookMeta author={book.author} publisher={book.publisher} publishedDate={book.publishedDate} />
          <div className="mt-4 flex items-center">
            <StarRating rating={book.rating} />
            <span className="ml-2 text-gray-600">{book.rating.toFixed(1)} / 5</span>
          </div>
          <BookDescription description={book.description} />
          <div className="mt-6 flex flex-col gap-3">
            <DetailsButton onClick={() => window.open(`/books/${book.id}`, '_blank')}>
              View Book Page
            </DetailsButton>
            <AddToCartButton onClick={() => console.log(`Added ${book.title} to cart`)}>
              Add to Cart (${book.price})
            </AddToCartButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailsButton: React.FC<DetailsButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
    >
      View Details
    </button>
  );
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md"
    >
      Add to Cart
    </button>
  );
};

const BookMeta: React.FC<BookMetaProps> = ({ author, publisher, publishedDate }) => {
  return (
    <div className="text-sm text-gray-500 mb-4">
      <p>By {author}</p>
      <p>Published by {publisher} on {publishedDate}</p>
    </div>
  );
};

const BookDescription: React.FC<BookDescriptionProps> = ({ description }) => {
  return <p className="text-gray-700 leading-relaxed mb-6">{description}</p>;
};

const BookModalReviewForm: React.FC<BookModalReviewFormProps> = ({ onSubmit }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (review.trim() && rating > 0) {
      onSubmit(review, rating);
      setReview("");
      setRating(0);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <ReviewTextarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your thoughts about this book..."
        />
      </div>
      <div className="mb-4">
        <ReviewRating rating={rating} setRating={setRating} />
      </div>
      <ReviewSubmitButton disabled={!review.trim() || rating === 0}>
        <span className="sr-only">Submit review</span>
        Submit Review
      </ReviewSubmitButton>
    </form>
  );
};

const ReviewTextarea: React.FC<ReviewTextareaProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      rows={4}
      placeholder="Write your review here..."
    />
  );
};

const ReviewRating: React.FC<ReviewRatingProps> = ({ rating, setRating }) => {
  return (
    <div className="flex items-center">
      <span className="mr-2 text-gray-700">Rating:</span>
      <StarRating rating={rating} onRatingChange={setRating} />
    </div>
  );
};

const ReviewSubmitButton: React.FC<ReviewSubmitButtonProps> = ({ children, disabled }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium transition-colors ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-700"
      }`}
      aria-label="Submit review"
      title="Submit review"
    >
      <span className="sr-only">Submit review</span>
      {children}
    </button>
  );
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, setActiveCategory }) => {
  const categories = ["All", "Fiction", "Science Fiction", "Fantasy", "Romance", "Thriller", "Mystery", "Historical Fiction", "Non-Fiction"];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeCategory === category
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

const SortOption: React.FC<ReviewSortOptionProps> = ({ value, label }) => {
  return (
    <option value={value} aria-label={`Sort by ${label}`}>
      {label}
    </option>
  );
};

const Sorting: React.FC<SortingProps> = ({ sortOption, setSortOption }) => {
  return (
    <div className="mb-4" role="group" aria-labelledby="sort-label">
      <label id="sort-label" className="block text-sm font-medium text-gray-700 mb-2">
        Sort reviews by:
      </label>
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        aria-label="Sort reviews"
        title="Sort reviews"
        aria-describedby="sort-description"
      >
        <SortOption value="default" label="Default" />
        <SortOption value="price-asc" label="Price: Low to High" />
        <SortOption value="price-desc" label="Price: High to Low" />
        <SortOption value="rating" label="Rating" />
        <SortOption value="title" label="Title" />
      </select>
      <span id="sort-description" className="sr-only">
        Choose how to sort the reviews
      </span>
    </div>
  );
};

const PriceSlider: React.FC<PriceSliderProps> = ({ priceRange, setPriceRange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceRange({
      ...priceRange,
      [name]: Number(value),
    });
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range:</label>
      <div className="flex gap-4 mb-2">
        <input
          type="number"
          name="min"
          value={priceRange.min}
          onChange={handleChange}
          className="w-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Min"
          aria-label="Minimum price"
        />
        <input
          type="number"
          name="max"
          value={priceRange.max}
          onChange={handleChange}
          className="w-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Max"
          aria-label="Maximum price"
        />
      </div>
      <div className="relative pt-1">
        <input
          type="range"
          min="0"
          max="100"
          value={priceRange.min}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          aria-label="Price slider"
        />
      </div>
    </div>
  );
};

const ClearFilters: React.FC<ClearFiltersProps> = ({
  setActiveCategory,
  setSortOption,
  setPriceRange,
}) => {
  const handleClearFilters = () => {
    setActiveCategory("All");
    setSortOption("default");
    setPriceRange({ min: 0, max: 100 });
  };

  return (
    <button
      onClick={handleClearFilters}
      className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      aria-label="Clear filters"
    >
      Clear Filters
    </button>
  );
};

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  activeCategory,
  sortOption,
  priceRange,
  setActiveCategory,
  setSortOption,
  setPriceRange,
}) => {
  const handleRemoveCategory = () => {
    setActiveCategory("All");
  };

  const handleRemoveSort = () => {
    setSortOption("default");
  };

  const handleRemovePrice = () => {
    setPriceRange({ min: 0, max: 100 });
  };

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {activeCategory !== "All" && (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm flex items-center">
          Category: {activeCategory}
          <button onClick={handleRemoveCategory} className="ml-2 text-blue-600 hover:text-blue-800" aria-label="Remove category filter">
            <ActiveFilterRemoveIcon className="w-4 h-4" />
          </button>
        </span>
      )}
      {sortOption !== "default" && (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm flex items-center">
          Sort:{" "}
          {sortOption === "price-asc"
            ? "Price: Low to High"
            : sortOption === "price-desc"
            ? "Price: High to Low"
            : sortOption === "rating"
            ? "Rating"
            : sortOption === "title"
            ? "Title"
            : ""}
          <button onClick={handleRemoveSort} className="ml-2 text-blue-600 hover:text-blue-800" aria-label="Remove sort filter">
            <ActiveFilterRemoveIcon className="w-4 h-4" />
          </button>
        </span>
      )}
      {(priceRange.min > 0 || priceRange.max < 100) && (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm flex items-center">
          Price: ${priceRange.min} - ${priceRange.max}
          <button onClick={handleRemovePrice} className="ml-2 text-blue-600 hover:text-blue-800" aria-label="Remove price filter">
            <ActiveFilterRemoveIcon className="w-4 h-4" />
          </button>
        </span>
      )}
    </div>
  );
};

const FilterButton: React.FC<FilterButtonProps> = ({
  activeCategory,
  setActiveCategory,
  setShowMobileFilters,
  showMobileFilters,
}) => {
  return (
    <button
      onClick={() => setShowMobileFilters(!showMobileFilters)}
      className="md:hidden mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
      aria-label={showMobileFilters ? "Hide filters" : "Show filters"}
    >
      <FilterButtonIcon className="w-5 h-5 mr-2" />
      {showMobileFilters ? "Hide Filters" : "Show Filters"}
    </button>
  );
};

const MobileFilterPanel: React.FC<MobileFilterPanelProps> = ({
  showMobileFilters,
  setShowMobileFilters,
  activeCategory,
  setActiveCategory,
  sortOption,
  setSortOption,
  priceRange,
  setPriceRange,
}) => {
  if (!showMobileFilters) return null;

  return (
    <div className="md:hidden bg-white p-4 border-t border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        <button
          onClick={() => setShowMobileFilters(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close mobile filters"
        >
          <MobileFilterPanelCloseIcon className="w-5 h-5" />
        </button>
      </div>
      <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <Sorting sortOption={sortOption} setSortOption={setSortOption} />
      <PriceSlider priceRange={priceRange} setPriceRange={setPriceRange} />
      <ClearFilters
        setActiveCategory={setActiveCategory}
        setSortOption={setSortOption}
        setPriceRange={setPriceRange}
      />
    </div>
  );
};

const DesktopFilterPanel: React.FC<DesktopFilterPanelProps> = ({
  activeCategory,
  setActiveCategory,
  sortOption,
  setSortOption,
  priceRange,
  setPriceRange,
}) => {
  return (
    <div className="hidden md:block w-1/3 lg:w-1/4 bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
      <h3 className="text-lg font-medium mb-4">Filters</h3>
      <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <Sorting sortOption={sortOption} setSortOption={setSortOption} />
      <PriceSlider priceRange={priceRange} setPriceRange={setPriceRange} />
      <ClearFilters
        setActiveCategory={setActiveCategory}
        setSortOption={setSortOption}
        setPriceRange={setPriceRange}
      />
    </div>
  );
};

const BookGrid: React.FC<BookGridProps> = ({ books, reviews, onAddReview }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} reviews={reviews} onAddReview={onAddReview} />
      ))}
    </div>
  );
};

const LoadMore: React.FC<LoadMoreProps> = ({ hasMore, onLoadMore }) => {
  if (!hasMore) return null;

  return (
    <div className="text-center mt-6">
      <Button onClick={onLoadMore} variant="outline">
        Load More
      </Button>
    </div>
  );
};

const BackToTop: React.FC<BackToTopProps> = ({ visible }) => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 z-50 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  icon,
  type = "button",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:ring-blue-500",
    unstyled: "",
  };

  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button type={type} className={styles} onClick={onClick}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className || ""}`}>
      {children}
    </div>
  );
};

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <input
        className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          error ? "border-red-500 focus:ring-red-500" : ""
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const Textarea: React.FC<TextareaProps> = ({ label, error, className, ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <textarea
        className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          error ? "border-red-500 focus:ring-red-500" : ""
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const FilterSection: React.FC<FilterSectionProps> = ({
  activeCategory,
  setActiveCategory,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
      <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
    </div>
  );
};

const BookFeed: React.FC<BookFeedProps> = ({
  books,
  reviews,
  activeCategory,
  onAddReview,
}) => {
  const [visibleBooks, setVisibleBooks] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  const filteredBooks = activeCategory === "All" ? books : books.filter(book => book.category === activeCategory);

  const handleLoadMore = () => {
    if (isLoading) return;

    setIsLoading(true);

    setTimeout(() => {
      setVisibleBooks((prev) => prev + 12);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div>
      <SectionHeading
        title="Book Feed"
        subtitle="Explore our curated collection of books"
      />
      <BookGrid
        books={filteredBooks.slice(0, visibleBooks)}
        reviews={reviews}
        onAddReview={onAddReview}
      />
      <LoadMore hasMore={visibleBooks < filteredBooks.length} onLoadMore={handleLoadMore} />
    </div>
  );
};

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToFeed }) => {
  return (
    <Section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <HeroBackground className="absolute inset-0 z-0" />
      <div className="relative z-10 max-w-4xl w-full px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1
            className={`text-5xl font-bold mb-6 leading-tight ${titillium.className}`}
          >
            Welcome to <span className="text-blue-600">BookNest</span>!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your home for book lovers. Discover, review, and share your favorite stories.
          </p>
          <Button
            onClick={scrollToFeed}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            icon={<ArrowRight className="w-5 h-5" />}
            aria-label="Start exploring"
          >
            Start Exploring
          </Button>
        </motion.div>
      </div>
    </Section>
  );
};

const Header: React.FC<HeaderProps> = ({ scrollToFeed }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={`text-2xl font-bold text-blue-600 ${titillium.className}`}>BookNest</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              onClick={scrollToFeed}
              variant="secondary"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              aria-label="Explore books"
            >
              Explore Books
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${titillium.className}`}>
      <Header />
      <main>{children}</main>
      <footer className="bg-gray-100 text-gray-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className={`text-xl font-bold text-blue-600 ${titillium.className}`}>BookNest</h2>
              <p className="mt-2 text-sm">Your home for book lovers</p>
            </div>
            <div>
              <p className="text-sm">© {new Date().getFullYear()} BookNest. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Section: React.FC<SectionProps> = ({ children, className }) => {
  return (
    <section className={`py-12 ${className || ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
};

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, className }) => {
  return (
    <div className={`mb-8 ${className || ""}`}>
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
    </div>
  );
};

const MotionDiv: React.FC<MotionDivProps> = ({ children, className }) => {
  return <motion.div className={className}>{children}</motion.div>;
};

const AnimatePresenceDiv: React.FC<AnimatePresenceProps> = ({ children }) => {
  return <AnimatePresence>{children}</AnimatePresence>;
};

const BookCard: React.FC<BookCardProps> = ({ book, reviews, onAddReview }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookReviews, setBookReviews] = useState(reviews.filter((review) => review.bookId === book.id));
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);

  const reviewsPerPage = 5;

  useEffect(() => {
    const sortedReviews = [...bookReviews].sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOption === "highest") {
        return b.rating - a.rating;
      } else if (sortOption === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
    const hasMore = totalPages > 1;

    setBookReviews(sortedReviews.slice(0, reviewsPerPage));
    setHasMore(hasMore);
    setCurrentPage(1);
  }, [reviews, book.id, sortOption]);

  const handleAddReview = (bookId: number, review: string, rating: number) => {
    const newReview = {
      id: bookReviews.length + 1,
      bookId,
      review,
      rating,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      userName: "You",
      userImage: "",
    };

    const sortedReviews = [...bookReviews, newReview].sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOption === "highest") {
        return b.rating - a.rating;
      } else if (sortOption === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
    const hasMore = totalPages > 1;

    setBookReviews(sortedReviews.slice(0, reviewsPerPage));
    setHasMore(hasMore);
    setCurrentPage(1);

    onAddReview(bookId, review, rating);
  };

  const handleLoadMore = () => {
    if (isLoading) return;

    setIsLoading(true);

    const sortedReviews = [...reviews].sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOption === "highest") {
        return b.rating - a.rating;
      } else if (sortOption === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;

    const additionalReviews = sortedReviews.slice(startIndex, endIndex);

    const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
    const hasMore = nextPage < totalPages;

    setTimeout(() => {
      setBookReviews((prevReviews) => [...prevReviews, ...additionalReviews]);
      setHasMore(hasMore);
      setCurrentPage(nextPage);
      setIsLoading(false);
    }, 500);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-72 overflow-hidden">
        <BookCardImagePlaceholder className="absolute inset-0 bg-gradient-to-b from-gray-100 to-blue-50" />
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium text-gray-700 flex items-center">
          <StarIcon filled={true} className="w-4 h-4 text-amber-500 mr-1" />
          {book.rating.toFixed(1)}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
          <p className="text-sm mb-2 line-clamp-2">{book.description}</p>
          <Button
            variant="unstyled"
            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm"
            onClick={() => setIsModalOpen(true)}
            aria-label="View details"
          >
            View Details
          </Button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{book.author}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-gray-900">{book.price}</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center"
            aria-label="View reviews"
          >
            <StarIcon filled={false} className="w-3 h-3 mr-1" />
            {bookReviews.length > 0 ? bookReviews.length : "No"} Reviews
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <BookDetailModal
          book={book}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reviews={bookReviews}
          onAddReview={handleAddReview}
        />
      )}
    </Card>
  );
};

const BookGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <div className="relative h-72 bg-gray-200">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-blue-50"></div>
          </div>
          <div className="p-5">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const FilterSectionSkeleton: React.FC = () => {
  return (
    <div className="mb-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 bg-gray-200 rounded w-24"></div>
        ))}
      </div>
    </div>
  );
};

const PageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <header className="bg-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            <div className="h-10 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </header>
      <main>
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gray-200"></div>
          <div className="relative z-10 max-w-4xl w-full px-6 text-center">
            <div className="h-12 bg-gray-300 rounded w-3/4 mx-auto mb-6"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-10 bg-gray-300 rounded w-32 mx-auto"></div>
          </div>
        </section>
        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FilterSectionSkeleton />
            <BookGridSkeleton />
          </div>
        </section>
      </main>
      <footer className="bg-gray-200 text-gray-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-48"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-64"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [visibleBooks, setVisibleBooks] = useState(12);
  const [filteredBooks, setFilteredBooks] = useState(initialBooks);
  const [activeFilters, setActiveFilters] = useState({
    category: "All",
    sort: "default",
    price: { min: 0, max: 100 },
  });
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [books, setBooks] = useState(initialBooks);
  const [reviews, setReviews] = useState(initialReviews);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookReviews, setBookReviews] = useState(initialReviews);
  const [hasMoreBookReviews, setHasMoreBookReviews] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBookReviews, setSortBookReviews] = useState("newest");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleResize = () => {
      if (typeof window !== 'undefined') {
      setIsDesktop(window.innerWidth >= 768);
      setIsFilterButtonVisible(window.innerWidth < 768);
      }
    };

    handleResize();

    if (typeof window !== 'undefined') {
    window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
      window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
      setIsBackToTopVisible(window.scrollY > 300);
      }
    };

    if (typeof window !== 'undefined') {
    window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (typeof window !== 'undefined') {
      window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const filtered = initialBooks.filter((book) => {
      if (activeCategory !== "All" && book.category !== activeCategory) return false;

      const price = Number(book.price.replace("$", ""));
      if (price < priceRange.min || price > priceRange.max) return false;

      return true;
    });

    setFilteredBooks(filtered);
    setHasMore(filtered.length > visibleBooks);
  }, [activeCategory, priceRange, visibleBooks]);

  const handleAddReview = (bookId: number, review: string, rating: number) => {
    const newReview = {
      id: reviews.length + 1,
      bookId,
      review,
      rating,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      userName: "You",
      userImage: "",
    };

    const updatedReviews = [...reviews, newReview];

    setReviews(updatedReviews);

    setBookReviews((prevReviews) => {
      const bookIndex = prevReviews.findIndex((review) => review.bookId === bookId);

      if (bookIndex !== -1) {
        const updatedBookReviews = [...prevReviews];
        updatedBookReviews[bookIndex] = newReview;
        return updatedBookReviews;
      }

      return [...prevReviews, newReview];
    });
  };

  const handleLoadMore = () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);

    const sortedReviews = [...bookReviews].sort((a, b) => {
      if (sortBookReviews === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBookReviews === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBookReviews === "highest") {
        return b.rating - a.rating;
      } else if (sortBookReviews === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * 5;
    const endIndex = startIndex + 5;

    const additionalReviews = sortedReviews.slice(startIndex, endIndex);

    const totalPages = Math.ceil(sortedReviews.length / 5);
    const hasMore = nextPage < totalPages;

    setTimeout(() => {
      setBookReviews((prevReviews) => [...prevReviews, ...additionalReviews]);
      setHasMoreBookReviews(hasMore);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 500);
  };

  const handleSortChange = (newSort: string) => {
    setSortBookReviews(newSort);

    const sortedReviews = [...bookReviews].sort((a, b) => {
      if (newSort === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (newSort === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (newSort === "highest") {
        return b.rating - a.rating;
      } else if (newSort === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    setBookReviews(sortedReviews);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);

    const reviewsForBook = reviews.filter((review) => review.bookId === book.id);

    const sortedReviews = [...reviewsForBook].sort((a, b) => {
      if (sortBookReviews === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBookReviews === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBookReviews === "highest") {
        return b.rating - a.rating;
      } else if (sortBookReviews === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    const hasMore = sortedReviews.length > 5;

    setBookReviews(sortedReviews);
    setHasMoreBookReviews(hasMore);
    setCurrentPage(1);

    setIsBookModalOpen(true);
  };

  const handleReviewModalOpen = (book: Book) => {
    setSelectedBook(book);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (review: string, rating: number) => {
    if (selectedBook) {
      handleAddReview(selectedBook.id, review, rating);
    }
  };

  const scrollToFeed = () => {
    if (typeof window !== 'undefined') {
    const feedElement = document.getElementById("feed");

    if (feedElement) {
      feedElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return <PageSkeleton />;
  }

  return (
    <Layout>
      <HeroSection scrollToFeed={scrollToFeed} />
      <Section id="feed" className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FilterButton
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            setShowMobileFilters={setShowMobileFilters}
            showMobileFilters={showMobileFilters}
          />
          <MobileFilterPanel
            showMobileFilters={showMobileFilters}
            setShowMobileFilters={setShowMobileFilters}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            sortOption={sortOption}
            setSortOption={setSortOption}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
          <div className="flex flex-col md:flex-row gap-6">
            <DesktopFilterPanel
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              sortOption={sortOption}
              setSortOption={setSortOption}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
            <div className="flex-1">
              <ActiveFilters
                activeCategory={activeCategory}
                sortOption={sortOption}
                priceRange={priceRange}
                setActiveCategory={setActiveCategory}
                setSortOption={setSortOption}
                setPriceRange={setPriceRange}
              />
              {isLoading ? (
                <BookGridSkeleton />
              ) : (
                <BookFeed
                  books={filteredBooks.slice(0, visibleBooks)}
                  reviews={reviews}
                  activeCategory={activeCategory}
                  onAddReview={handleAddReview}
                />
              )}
              <LoadMore
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
              />
            </div>
          </div>
        </div>
      </Section>
      <BackToTop visible={isBackToTopVisible} />
    </Layout>
  );
}