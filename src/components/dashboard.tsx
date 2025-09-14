"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FiChevronDown, FiCalendar, FiTrendingUp, FiTrendingDown, FiInfo, FiArrowRight } from "react-icons/fi";
import {
LineChart,
Line,
  PieChart,
  Pie,
  Cell,
  Sector,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
Legend,
ResponsiveContainer,
  TooltipProps
} from "recharts";

// Sample data for different time periods
const monthlyData = {
  "This Month": [
    { name: "Week 1", bookings: 5, revenue: 1000, occupancyRate: 45 },
    { name: "Week 2", bookings: 8, revenue: 1600, occupancyRate: 55 },
    { name: "Week 3", bookings: 12, revenue: 2400, occupancyRate: 65 },
    { name: "Week 4", bookings: 10, revenue: 2000, occupancyRate: 60 },
  ],
  "Last Month": [
    { name: "Week 1", bookings: 3, revenue: 600, occupancyRate: 35 },
    { name: "Week 2", bookings: 7, revenue: 1400, occupancyRate: 50 },
    { name: "Week 3", bookings: 9, revenue: 1800, occupancyRate: 58 },
    { name: "Week 4", bookings: 6, revenue: 1200, occupancyRate: 45 },
  ],
  "This Quarter": [
    { name: "Jan", bookings: 15, revenue: 3000, occupancyRate: 40 },
    { name: "Feb", bookings: 20, revenue: 4000, occupancyRate: 50 },
    { name: "Mar", bookings: 25, revenue: 5000, occupancyRate: 60 },
  ],
  "This Year": [
    { name: "Q1", bookings: 60, revenue: 12000, occupancyRate: 45 },
    { name: "Q2", bookings: 80, revenue: 16000, occupancyRate: 58 },
    { name: "Q3", bookings: 100, revenue: 20000, occupancyRate: 65 },
    { name: "Q4", bookings: 70, revenue: 14000, occupancyRate: 52 },
  ],
};

// Extended booking data
const extendedBookingData = [
  { id: 1, chalet: "Chalet A", guests: 4, date: "2024-07-15", status: "Confirmed", totalAmount: 850 },
  { id: 2, chalet: "Chalet B", guests: 6, date: "2024-07-20", status: "Confirmed", totalAmount: 1250 },
  { id: 3, chalet: "Chalet C", guests: 5, date: "2024-07-22", status: "Pending", totalAmount: 950 },
  { id: 4, chalet: "Chalet A", guests: 3, date: "2024-07-25", status: "Confirmed", totalAmount: 750 },
  { id: 5, chalet: "Chalet B", guests: 7, date: "2024-07-28", status: "Pending", totalAmount: 1400 },
  { id: 6, chalet: "Chalet C", guests: 2, date: "2024-08-02", status: "Confirmed", totalAmount: 550 },
  { id: 7, chalet: "Chalet A", guests: 5, date: "2024-08-05", status: "Confirmed", totalAmount: 950 },
  { id: 8, chalet: "Chalet B", guests: 4, date: "2024-08-10", status: "Cancelled", totalAmount: 0 },
  { id: 9, chalet: "Chalet C", guests: 6, date: "2024-08-12", status: "Confirmed", totalAmount: 1150 },
  { id: 10, chalet: "Chalet A", guests: 3, date: "2024-08-15", status: "Pending", totalAmount: 650 },
];

const chaletData = [
  { id: 1, name: "Chalet A", location: "Mountain View", maxGuests: 6, avgRating: 4.8, totalBookings: 24, totalRevenue: 18500 },
  { id: 2, name: "Chalet B", location: "Lake Side", maxGuests: 8, avgRating: 4.6, totalBookings: 19, totalRevenue: 22400 },
  { id: 3, name: "Chalet C", location: "Forest Hideaway", maxGuests: 7, avgRating: 4.9, totalBookings: 22, totalRevenue: 24600 },
];

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Insights generator
const generateInsights = (period: string) => {
  const insights = [
    {
      title: "Booking Trend",
      description: period === "This Month" || period === "This Quarter" 
        ? "Bookings are up 12% compared to the previous period." 
        : "Bookings have decreased by 5% compared to the same period last year.",
      type: period === "This Month" || period === "This Quarter" ? "positive" : "negative",
      icon: period === "This Month" || period === "This Quarter" ? <FiTrendingUp /> : <FiTrendingDown />
    },
    {
      title: "Revenue Growth",
      description: "Average daily rate has increased by 8% leading to overall revenue growth.",
      type: "positive",
      icon: <FiTrendingUp />
    },
    {
      title: "Guest Satisfaction",
      description: "Chalet C has the highest guest satisfaction score at 4.9/5.",
      type: "info",
      icon: <FiInfo />
    },
    {
      title: "Booking Duration",
      description: period === "This Month" 
        ? "Average stay has increased to 3.8 days from 3.2 days last month." 
        : "Guests are booking longer stays compared to previous periods.",
      type: "positive",
      icon: <FiTrendingUp />
    }
  ];
  
  return insights;
};

// Data for bar chart
const generateChaletBarData = (chalets: {name: string, totalBookings: number, totalRevenue: number}[]) => {
  return chalets.map(chalet => ({
    name: chalet.name,
    bookings: chalet.totalBookings,
    revenue: chalet.totalRevenue / 1000, // Convert to thousands for better display
  }));
};

// Type for monthly data
type _TimeData = {
  [key: string]: Array<{
    name: string;
    bookings: number;
    revenue: number;
    occupancyRate: number;
  }>
};

// Sample notification data
const notificationData = [
  {
    id: 1,
    title: "New Booking",
    message: "Chalet A has been booked for July 15-18",
    time: "10 minutes ago",
    isRead: false,
    type: "booking"
  },
  {
    id: 2,
    title: "Payment Received",
    message: "Payment of $1,250 received for Chalet B booking",
    time: "2 hours ago",
    isRead: false,
    type: "payment"
  },
  {
    id: 3,
    title: "Cancellation Request",
    message: "Guest requested cancellation for Chalet C booking on Aug 10",
    time: "Yesterday",
    isRead: true,
    type: "cancellation"
  },
  {
    id: 4,
    title: "Review Received",
    message: "New 5-star review for Chalet A from John Smith",
    time: "2 days ago",
    isRead: true,
    type: "review"
  },
  {
    id: 5,
    title: "System Update",
    message: "Dashboard has been updated with new features",
    time: "3 days ago",
    isRead: true,
    type: "system"
  }
];

// Generate pie chart data
const generatePieChartData = (chalets: {name: string, totalBookings: number}[]) => {
  const totalBookings = chalets.reduce((sum, chalet) => sum + chalet.totalBookings, 0);
  
  return chalets.map(chalet => ({
    name: chalet.name,
    value: chalet.totalBookings,
    percentage: ((chalet.totalBookings / totalBookings) * 100).toFixed(1),
    color: chalet.name === "Chalet A" ? "#3B82F6" : 
           chalet.name === "Chalet B" ? "#10B981" : 
           "#F59E0B"
  }));
};

const Dashboard: React.FC = () => {
const [bookings, setBookings] = useState(0);
const [revenue, setRevenue] = useState(0);
const [chalets, setChalets] = useState(0);
const [guests, setGuests] = useState(0);
const [avgStay, setAvgStay] = useState(0);
const [occupancy, setOccupancy] = useState(0);

  const [recentBookings, _setRecentBookings] = useState(extendedBookingData.slice(0, 5));
  const [_showAllBookings, _setShowAllBookings] = useState(false);
  const [chartData, setChartData] = useState(monthlyData["This Month"]);
const [chaletsData] = useState(chaletData);
  const [_chaletBarData] = useState(generateChaletBarData(chaletData));
  const [insights, setInsights] = useState(generateInsights("This Month"));
  
  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(notificationData);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Bookings modal state
  const [showBookingsModal, setShowBookingsModal] = useState(false);

const [selectedPeriod, setSelectedPeriod] = useState("This Month");
const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);

  const [pieChartData] = useState(generatePieChartData(chaletData));
  const [activePieIndex, setActivePieIndex] = useState(0);

  // Function to calculate metrics based on selected period
  const calculateMetrics = useCallback(() => {
    const totalBookings = selectedPeriod === "This Month" ? extendedBookingData.length : 
                        selectedPeriod === "Last Month" ? extendedBookingData.length - 2 :
                        selectedPeriod === "This Quarter" ? extendedBookingData.length + 5 :
                        extendedBookingData.length + 15;
                        
    const totalRevenue = selectedPeriod === "This Month" ? extendedBookingData.reduce((acc, curr) => acc + curr.totalAmount, 0) : 
                       selectedPeriod === "Last Month" ? extendedBookingData.reduce((acc, curr) => acc + curr.totalAmount, 0) * 0.85 :
                       selectedPeriod === "This Quarter" ? extendedBookingData.reduce((acc, curr) => acc + curr.totalAmount, 0) * 3 :
                       extendedBookingData.reduce((acc, curr) => acc + curr.totalAmount, 0) * 12;
                       
    const totalChalets = chaletData.length;
    
    const totalGuests = selectedPeriod === "This Month" ? extendedBookingData.reduce((acc, curr) => acc + curr.guests, 0) : 
                      selectedPeriod === "Last Month" ? extendedBookingData.reduce((acc, curr) => acc + curr.guests, 0) * 0.9 :
                      selectedPeriod === "This Quarter" ? extendedBookingData.reduce((acc, curr) => acc + curr.guests, 0) * 3 :
                      extendedBookingData.reduce((acc, curr) => acc + curr.guests, 0) * 12;
                      
    const averageStay = selectedPeriod === "This Month" ? 3.5 : 
                      selectedPeriod === "Last Month" ? 3.2 :
                      selectedPeriod === "This Quarter" ? 3.7 :
                      3.8;
                      
    const occupancyRate = selectedPeriod === "This Month" ? 68 : 
                        selectedPeriod === "Last Month" ? 62 :
                        selectedPeriod === "This Quarter" ? 72 :
                        65;

    setBookings(Math.round(totalBookings));
    setRevenue(Math.round(totalRevenue));
    setChalets(totalChalets);
    setGuests(Math.round(totalGuests));
    setAvgStay(averageStay);
    setOccupancy(occupancyRate);
  }, [selectedPeriod]);

  // Function to toggle notification read status
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showNotifications && !target.closest('#notifications-modal') && !target.closest('#notifications-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

useEffect(() => {
const timer = setTimeout(() => {
setIsLoading(false);
}, 1000);
return () => clearTimeout(timer);
}, []);

useEffect(() => {
calculateMetrics();
  }, [calculateMetrics, selectedPeriod]);

  const handlePeriodChange = (period: string) => {
    setIsChartLoading(true);
setSelectedPeriod(period);
    
// Update chart data based on selected period
    setTimeout(() => {
      setChartData(monthlyData[period as keyof typeof monthlyData]);
      setInsights(generateInsights(period));
      setIsChartLoading(false);
    }, 600);
  };

  const toggleBookingsModal = () => {
    setShowBookingsModal(true);
  };

  // Close bookings modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showBookingsModal && !target.closest('#bookings-modal-content') && !target.closest('#view-bookings-button')) {
        setShowBookingsModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBookingsModal]);

  // Get change values for metrics based on period
  const getMetricChange = (metric: string) => {
    switch(metric) {
      case 'bookings':
        return selectedPeriod === "This Month" ? 12 : 
               selectedPeriod === "Last Month" ? -5 : 
               selectedPeriod === "This Quarter" ? 18 : 8;
      case 'revenue':
        return selectedPeriod === "This Month" ? 15 : 
               selectedPeriod === "Last Month" ? 8 : 
               selectedPeriod === "This Quarter" ? 22 : 12;
      case 'chalets':
        return selectedPeriod === "This Month" ? 0 : 
               selectedPeriod === "Last Month" ? 0 : 
               selectedPeriod === "This Quarter" ? 33 : 50;
      case 'guests':
        return selectedPeriod === "This Month" ? 8 : 
               selectedPeriod === "Last Month" ? -3 : 
               selectedPeriod === "This Quarter" ? 12 : 6;
      case 'avgStay':
        return selectedPeriod === "This Month" ? 9 : 
               selectedPeriod === "Last Month" ? 3 : 
               selectedPeriod === "This Quarter" ? 15 : 11;
      case 'occupancy':
        return selectedPeriod === "This Month" ? 5 : 
               selectedPeriod === "Last Month" ? -2 : 
               selectedPeriod === "This Quarter" ? 10 : 7;
      default:
        return 0;
}
};

  interface StatCardProps {
    title: string;
    value: string | number;
    change: number;
    icon?: React.ReactNode;
  }

  const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
<h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">{icon}</div>}
      </div>
<div className="mt-2 flex items-baseline">
<p className="text-3xl font-bold text-gray-900">{value}</p>
        <span className={`ml-2 text-sm font-medium ${change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
          {change >= 0 ? `+${change}%` : `${change}%`}
</span>
</div>
</div>
);

  interface CustomTooltipProps extends TooltipProps<number, string> {
    active?: boolean;
    payload?: Array<{
      value: number;
      name?: string;
      dataKey?: string;
      color?: string;
    }>;
    label?: string;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
return (
<div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md">
          <p className="font-medium text-gray-900">{label || ''}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{color: entry.color}}>
              {entry.name}: {entry.dataKey === 'revenue' ? `$${entry.value}` : entry.value}
            </p>
          ))}
</div>
);
}
return null;
};

  // Define interface for active shape props
  interface ActiveShapeProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
    payload: {
      name: string;
    };
    percent: number;
    value: number;
  }

  // Custom renderer for active pie sector
  const renderActiveShape = (props: ActiveShapeProps) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs">{`${value} bookings`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
};

return (
    <div className="min-h-screen bg-gray-50/50 overflow-hidden">
      <header className="bg-white shadow-md sticky top-0 z-20 border-b border-gray-100">
        <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex justify-between items-center py-4">
<div className="flex items-center">
              <div className="hidden sm:flex items-center space-x-1.5 mr-3">
                <div className="w-3 h-3 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gradient-to-tr from-rose-500 to-rose-600 rounded-full"></div>
</div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Chalet</span>
                <span className="ml-1">Dashboard</span>
              </h1>
<div className="hidden md:block ml-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5 animate-pulse"></span>
                  Live data
</span>
</div>
</div>
<div className="flex items-center space-x-4">
              <button 
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative group"
                title="Copy dashboard"
                aria-label="Copy dashboard"
              >
<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1H9a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H9" />
</svg>
                <span className="absolute -top-2 -right-2 w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
</button>
              <button 
                id="notifications-button"
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative"
                title="Notifications"
                aria-label="View notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
</svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-rose-500 text-white text-xs rounded-full font-medium">{unreadCount}</span>
                )}
              </button>
              
              {/* Notifications Modal */}
              {showNotifications && (
                <div 
                  id="notifications-modal"
                  className="absolute top-16 right-4 w-80 md:w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-30 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-[70vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-4 hover:bg-gray-50 transition-colors flex ${notification.isRead ? 'opacity-70' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="mr-3 mt-0.5">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                notification.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                                notification.type === 'payment' ? 'bg-emerald-100 text-emerald-600' :
                                notification.type === 'cancellation' ? 'bg-rose-100 text-rose-600' :
                                notification.type === 'review' ? 'bg-amber-100 text-amber-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {notification.type === 'booking' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                )}
                                {notification.type === 'payment' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {notification.type === 'cancellation' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                                {notification.type === 'review' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                )}
                                {notification.type === 'system' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                                {!notification.isRead && (
                                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <button 
                      className="w-full py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => setShowNotifications(false)}
                    >
                      Close
</button>
                  </div>
                </div>
              )}
              
              <span className="hidden md:block h-6 w-px bg-gray-200"></span>
<div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm ring-2 ring-blue-100">
                  <span className="text-white font-medium">JD</span>
</div>
                <div className="hidden md:block">
<p className="text-sm font-medium text-gray-700">John Doe</p>
<p className="text-xs text-gray-500">Administrator</p>
</div>
</div>
</div>
</div>
</div>
</header>
      <main className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
<div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
  <div>
    <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
    <p className="mt-1 text-sm text-gray-500">Here&apos;s what&apos;s happening with your chalet bookings</p>
  </div>
  <div className="mt-4 md:mt-0 flex space-x-4">
    <div className="relative">
      <button 
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                onClick={() => document.getElementById('period-select')?.focus()}
                aria-label="Select time period dropdown"
      >
                <FiCalendar className="text-gray-400" />
        <span>{selectedPeriod}</span>
        <FiChevronDown className="text-gray-400" />
      </button>
      <select
        id="period-select"
        value={selectedPeriod}
        onChange={(e) => handlePeriodChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Select time period"
      >
        <option value="This Month">This Month</option>
        <option value="Last Month">Last Month</option>
        <option value="This Quarter">This Quarter</option>
        <option value="This Year">This Year</option>
      </select>
    </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm">
      Download Report
    </button>
  </div>
</div>

{isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6 mb-8">
    {[1, 2, 3, 4, 5, 6].map((item, _index) => (
      <div key={item} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    ))}
  </div>
) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 mb-8">
            <StatCard 
              title="Total Bookings" 
              value={bookings} 
              change={getMetricChange('bookings')} 
              icon={<FiCalendar />} 
            />
            <StatCard 
              title="Total Revenue" 
              value={formatCurrency(revenue)} 
              change={getMetricChange('revenue')} 
              icon={<FiTrendingUp />} 
            />
            <StatCard 
              title="Active Chalets" 
              value={chalets} 
              change={getMetricChange('chalets')} 
            />
            <StatCard 
              title="Total Guests" 
              value={guests} 
              change={getMetricChange('guests')} 
            />
            <StatCard 
              title="Avg. Stay Duration" 
              value={`${avgStay} days`} 
              change={getMetricChange('avgStay')} 
            />
            <StatCard 
              title="Occupancy Rate" 
              value={`${occupancy.toFixed(1)}%`} 
              change={getMetricChange('occupancy')} 
            />
  </div>
)}


<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Bookings and Revenue</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedPeriod}
              </span>
            </div>
            {isChartLoading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: "#6B7280" }}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis 
            tick={{ fill: "#6B7280" }}
            axisLine={{ stroke: "#E5E7EB" }}
                      domain={[0, 'dataMax + 1000']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="bookings" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ stroke: "#3B82F6", strokeWidth: 2, r: 4, fill: "#fff" }}
            activeDot={{ r: 8, stroke: "#3B82F6", strokeWidth: 2, fill: "#fff" }}
            name="Bookings"
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ stroke: "#10B981", strokeWidth: 2, r: 4, fill: "#fff" }}
            name="Revenue ($)"
          />
                    <Line 
                      type="monotone" 
                      dataKey="occupancyRate" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      dot={{ stroke: "#F59E0B", strokeWidth: 2, r: 4, fill: "#fff" }}
                      name="Occupancy (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedPeriod}
              </span>
  </div>
    <div className="space-y-4">
      {recentBookings.map((booking) => (
        <div key={booking.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                    booking.status === "Confirmed" ? "bg-emerald-500" : 
                    booking.status === "Pending" ? "bg-amber-500" : 
                    "bg-red-500"
                  }`}></div>
          <div className="flex-1">
            <div className="flex justify-between">
              <h4 className="font-medium text-gray-900">{booking.chalet}</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                booking.status === "Confirmed" 
                  ? "bg-emerald-100 text-emerald-800" 
                          : booking.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
              }`}>
                {booking.status}
              </span>
            </div>
                    <div className="flex justify-between">
            <p className="text-sm text-gray-500 mt-1">{booking.guests} guests</p>
                      <p className="text-sm font-medium">{formatCurrency(booking.totalAmount)}</p>
                    </div>
            <p className="text-xs text-gray-400">{booking.date}</p>
          </div>
        </div>
      ))}
    </div>
            <button 
              id="view-bookings-button"
              className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              onClick={toggleBookingsModal}
            >
      View All Bookings
              <FiArrowRight className="ml-2" />
    </button>
  </div>
</div>

        {/* Bar Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Booking Distribution</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedPeriod}
              </span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activePieIndex}
                    activeShape={renderActiveShape}
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={(_, index) => setActivePieIndex(index)}
                  >
                    {pieChartData.map((entry, _index) => (
                      <Cell key={`cell-${_index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    formatter={(value, entry, _index) => {
                      const { color } = pieChartData[_index];
                      return (
                        <span style={{ color }}>
                          {value} - {pieChartData[_index].percentage}%
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Booking Status</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedPeriod}
              </span>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Confirmed Bookings</span>
                  <span className="text-sm font-medium text-gray-700">
                    {extendedBookingData.filter(b => b.status === "Confirmed").length} / {extendedBookingData.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full" 
                    style={{ 
                      width: `${(extendedBookingData.filter(b => b.status === "Confirmed").length / extendedBookingData.length * 100).toFixed(1)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Pending Bookings</span>
                  <span className="text-sm font-medium text-gray-700">
                    {extendedBookingData.filter(b => b.status === "Pending").length} / {extendedBookingData.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full" 
                    style={{ 
                      width: `${(extendedBookingData.filter(b => b.status === "Pending").length / extendedBookingData.length * 100).toFixed(1)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Cancelled Bookings</span>
                  <span className="text-sm font-medium text-gray-700">
                    {extendedBookingData.filter(b => b.status === "Cancelled").length} / {extendedBookingData.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-rose-400 to-rose-600 h-2 rounded-full" 
                    style={{ 
                      width: `${(extendedBookingData.filter(b => b.status === "Cancelled").length / extendedBookingData.length * 100).toFixed(1)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Revenue by Status</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <span className="text-sm text-gray-600">Confirmed</span>
                    <p className="text-lg font-medium text-emerald-600">
                      {formatCurrency(extendedBookingData.filter(b => b.status === "Confirmed").reduce((acc, curr) => acc + curr.totalAmount, 0))}
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <span className="text-sm text-gray-600">Pending</span>
                    <p className="text-lg font-medium text-amber-600">
                      {formatCurrency(extendedBookingData.filter(b => b.status === "Pending").reduce((acc, curr) => acc + curr.totalAmount, 0))}
                    </p>
                  </div>
                  <div className="bg-rose-50 rounded-lg p-3 text-center">
                    <span className="text-sm text-gray-600">Cancelled</span>
                    <p className="text-lg font-medium text-rose-600">
                      {formatCurrency(extendedBookingData.filter(b => b.status === "Cancelled").reduce((acc, curr) => acc + curr.totalAmount, 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        {/* Insights Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-5 rounded-xl border backdrop-blur-sm ${
                  insight.type === 'positive' ? 'bg-emerald-50/80 border-emerald-100' : 
                  insight.type === 'negative' ? 'bg-rose-50/80 border-rose-100' : 
                  'bg-blue-50/80 border-blue-100'
                } hover:shadow-md transition-all`}
              >
                <div className="flex items-center mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    insight.type === 'positive' ? 'bg-emerald-500 text-white' : 
                    insight.type === 'negative' ? 'bg-rose-500 text-white' : 
                    'bg-blue-500 text-white'
                  }`}>
                    {insight.icon}
                  </div>
                  <h4 className="font-medium">{insight.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all mb-8">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
    <div>
              <h3 className="text-lg font-medium text-gray-900">Detailed Performance</h3>
              <p className="text-sm text-gray-500 mt-1">Revenue and occupancy data by chalet</p>
    </div>
  </div>
          <div className="overflow-x-auto -mx-6 px-6">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Chalet
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Location
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Max Guests
          </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Rating
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Bookings
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Revenue
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Occupancy
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {chaletsData.map((chalet) => (
          <tr key={chalet.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{chalet.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{chalet.location}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{chalet.maxGuests}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">{chalet.avgRating}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(chalet.avgRating) ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
              </div>
            </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{chalet.totalBookings}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">
                        {formatCurrency(chalet.totalRevenue)}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full ${
                            chalet.name === "Chalet A" ? "bg-gradient-to-r from-blue-400 to-blue-600" : 
                            chalet.name === "Chalet B" ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : 
                            "bg-gradient-to-r from-amber-400 to-amber-600"
                          }`} 
                          style={{ width: `${((chalet.totalBookings / 30) * 100).toFixed(1)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {((chalet.totalBookings / 30) * 100).toFixed(1)}%
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
</main>

      <footer className="bg-white border-t border-gray-200">
        <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <div className="flex flex-col md:flex-row justify-between items-center">
    <p className="text-sm text-gray-500">© 2024 ChaletBooking. All rights reserved.</p>
    <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
    </div>
  </div>
</div>
</footer>

      {/* Bookings Modal */}
      {showBookingsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            id="bookings-modal-content"
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-medium text-gray-900">All Bookings</h3>
              <button 
                onClick={() => setShowBookingsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Close modal"
                aria-label="Close bookings modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {extendedBookingData.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between mb-3">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          booking.status === "Confirmed" ? "bg-emerald-500" : 
                          booking.status === "Pending" ? "bg-amber-500" : 
                          "bg-red-500"
                        }`}></div>
                        {booking.chalet}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === "Confirmed" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : booking.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500">Date</span>
                        <span className="font-medium">{booking.date}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Guests</span>
                        <span className="font-medium">{booking.guests}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Amount</span>
                        <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Booking ID</span>
                        <span className="font-medium">#{booking.id.toString().padStart(4, '0')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                      <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Showing {extendedBookingData.length} bookings</span>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  onClick={() => setShowBookingsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
</div>
);
};

export default Dashboard;