"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plane, 
  MapPin, 
  Search, 
  ArrowLeft, 
  Compass,
  Cloud,
  Luggage,
  Ticket,
  Globe
} from "lucide-react";

// Animated cloud component
const FloatingCloud = ({ delay, duration, top, scale = 1 }) => (
  <div 
    className="absolute opacity-20 animate-pulse"
    style={{
      top: `${top}%`,
      left: '-10%',
      animation: `float ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      transform: `scale(${scale})`,
    }}
  >
    <Cloud className="w-24 h-24 text-[#00ADEF]" />
  </div>
);

// Animated plane component
const FlyingPlane = () => {
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => (prev + 0.5) % 120);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="absolute transition-all duration-75 ease-linear"
      style={{
        top: '30%',
        left: `${position - 20}%`,
        transform: `rotate(${Math.sin(position * 0.1) * 5}deg)`,
      }}
    >
      <Plane className="w-16 h-16 text-[#00ADEF] opacity-30" />
    </div>
  );
};

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const popularDestinations = [
    { name: "New York", code: "JFK" },
    { name: "London", code: "LHR" },
    { name: "Dubai", code: "DXB" },
    { name: "Tokyo", code: "NRT" },
    { name: "Paris", code: "CDG" },
  ];

  const quickLinks = [
    { icon: Ticket, label: "Book Flight", href: "/book" },
    { icon: Luggage, label: "Check-in", href: "/checkin" },
    { icon: Globe, label: "Destinations", href: "/destinations" },
    { icon: Compass, label: "Track Flight", href: "/track" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white relative overflow-hidden">
      {/* Background Animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateX(-100%) translateY(0px); }
          50% { transform: translateX(50vw) translateY(-20px); }
          100% { transform: translateX(100vw) translateY(0px); }
        }
        @keyframes plane-fly {
          0% { transform: translateX(-100px) translateY(0px) rotate(0deg); }
          25% { transform: translateX(25vw) translateY(-30px) rotate(-5deg); }
          50% { transform: translateX(50vw) translateY(-10px) rotate(0deg); }
          75% { transform: translateX(75vw) translateY(-40px) rotate(5deg); }
          100% { transform: translateX(calc(100vw + 100px)) translateY(0px) rotate(0deg); }
        }
      `}</style>

      {/* Floating Clouds */}
      <FloatingCloud delay={0} duration={20} top={10} scale={1.2} />
      <FloatingCloud delay={5} duration={25} top={25} scale={0.8} />
      <FloatingCloud delay={10} duration={22} top={60} scale={1.5} />
      <FloatingCloud delay={15} duration={28} top={80} scale={0.6} />

      {/* Flying Plane Animation */}
      <FlyingPlane />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center">
        
        {/* 404 Display */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Large 404 with Plane */}
          <div className="relative inline-block mb-8">
            <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ADEF] to-blue-600 tracking-tighter">
              404
            </h1>
            <Plane className="absolute -top-4 -right-8 w-16 h-16 text-[#00ADEF] transform rotate-45 animate-bounce" />
            <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#00ADEF] to-transparent opacity-30 rounded-full" />
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Flight Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              It seems your requested destination is not on our route map. 
              The page you are looking for may have been moved, deleted, or never existed.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#00ADEF] transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for flights, destinations..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00ADEF] focus:ring-4 focus:ring-[#00ADEF]/10 transition-all shadow-lg hover:shadow-xl"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-[#00ADEF] text-white rounded-full font-semibold hover:bg-blue-600 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00ADEF] text-white rounded-full font-bold text-lg hover:bg-blue-600 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Home
            </Link>
            <Link
              href="/directoryAirlines"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#00ADEF] border-2 border-[#00ADEF] rounded-full font-bold text-lg hover:bg-[#00ADEF] hover:text-white transform hover:scale-105 transition-all"
            >
              <MapPin className="w-5 h-5" />
              View All Airlines
            </Link>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#00ADEF]/30 transition-all group"
              >
                <link.icon className="w-8 h-8 text-gray-400 group-hover:text-[#00ADEF] transition-colors mb-2" />
                <span className="text-sm font-semibold text-gray-600 group-hover:text-[#00ADEF]">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Popular Destinations */}
          <div className="max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Popular Destinations
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularDestinations.map((dest, index) => (
                <Link
                  key={index}
                  href={`/directoryAirlines?destination=${dest.code}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#00ADEF] hover:text-white rounded-full text-sm font-medium text-gray-700 transition-all group"
                >
                  <MapPin className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  <span>{dest.name}</span>
                  <span className="text-xs opacity-50 group-hover:opacity-100">({dest.code})</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need assistance? Contact our{" "}
              <Link href="/support" className="text-[#00ADEF] hover:underline font-semibold">
                24/7 Support Team
              </Link>
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Plane className="w-4 h-4" />
              <span>Error Code: 404 | Page Not Found</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}