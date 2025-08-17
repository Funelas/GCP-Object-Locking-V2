import React, {useState} from 'react'
import SearchBtn from '../buttons/SearchBtn';
const SearchBar = ({setSearch, setPage }) => {
    const [searchInput, setSearchInput] = useState("");
    const handleSearchSubmit = () => {
      setPage(1);
      setSearch(searchInput);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchSubmit(); // 🔍 trigger only on Enter
        }
        };
  return (
    <div className="flex justify-center p-2 w-full">
            <div className="relative w-full max-w-2xl max-h-[90%] justify-center">
              <div className="relative group w-[90%] mx-auto">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by name or metadata..."
                  className="font-primary w-full px-6 py-4 pr-16 rounded-2xl border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-300 shadow-sm hover:shadow-xl bg-white font-medium text-md group-hover:border-gray-300"
                  style={{
                    focusRingColor: '#009432',
                    focusBorderColor: '#009432'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#009432';
                    e.target.style.boxShadow = `0 0 0 4px rgba(0, 148, 50, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                />
                
                {/* Search Icon */}
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                    <SearchBtn handleSearchSubmit= {handleSearchSubmit}/>
                  </div>

              
              </div>
            </div>
          </div>
  )
}

export default SearchBar