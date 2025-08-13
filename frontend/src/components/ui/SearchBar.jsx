import React, {useState} from 'react'

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
    <div className="flex justify-center p-2">
            <div className="relative w-full max-w-2xl">
              <div className="relative group">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by name or metadata..."
                  className="w-full px-6 py-4 pr-16 rounded-2xl border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-300 shadow-lg hover:shadow-xl bg-white font-medium text-lg group-hover:border-gray-300"
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
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200" style={{background: 'linear-gradient(135deg, #009432 0%, #007428 100%)'}}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Search Hint */}
                <div className="absolute -bottom-8 left-0 right-0 text-center">
                  <p className="text-gray-500 text-sm font-medium">
                    <span className="inline-flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs font-mono">Enter</kbd>
                      <span>to search</span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
  )
}

export default SearchBar