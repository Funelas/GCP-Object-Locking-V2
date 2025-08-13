import React from "react";

const Header = () => {
 

  return (
    <header className="bg-white shadow-xl border-b-2 border-[#009432] h-[80px] z-50 flex justify-between items-center px-8">
          {/* Logo and Title Section */}
          <div>
            <img 
              src="https://mediatrack.org/wp-content/uploads/2022/10/mediatrack-logo-web.png" 
              alt="MediaTrack Logo" 
              className="h-10 w-auto"
            />
          </div>
          <div>
            <h1 className="font-sans text-2xl font-bold tracking-tight text-gray-900 flex justify-end">
              GCS File Browser
            </h1>
            <p className="text-gray-600 font-medium text-sm mt-1 tracking-wide">
              Manage and organize your cloud storage files
            </p>
          </div>


    </header>
  );
};

export default Header;