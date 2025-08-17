import React from "react";

const Header = () => {
 

  return (
    <header className="bg-white h-[80px] z-50 flex justify-between items-center px-8 border-1 border-gray-300">
          {/* Logo and Title Section */}
          <div>
            <img 
              src="https://mediatrack.org/wp-content/uploads/2022/10/mediatrack-logo-web.png" 
              alt="MediaTrack Logo" 
              className="h-9 w-auto"
            />
          </div>
          <div>
            <h1 className="font-primary text-[1.35rem] font-bold tracking-tight text-gray-900 flex justify-end">
              GCS File Browser
            </h1>
            <p className="font-secondary text-gray-600 font-medium text-[0.7875rem] mt-1 tracking-wide">
              Manage and organize your cloud storage files
            </p>
          </div>


    </header>
  );
};

export default Header;