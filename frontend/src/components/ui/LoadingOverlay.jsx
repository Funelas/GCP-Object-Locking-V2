import React from "react";

const LoadingOverlay = ({ message = "Processing..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md h-full">
      <div className="flex flex-col items-center bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#009432] rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-12 h-12 border-2 border-transparent border-t-[#009432]/60 rounded-full animate-spin animation-delay-150" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
        <p className="font-accent text-gray-800 mt-6 text-lg font-medium tracking-wide">{message}</p>
        <div className="flex space-x-1 mt-4">
          <div className="w-2 h-2 rounded-full bg-[#009432] animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-[#009432] animate-pulse animation-delay-300"></div>
          <div className="w-2 h-2 rounded-full bg-[#009432] animate-pulse animation-delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;