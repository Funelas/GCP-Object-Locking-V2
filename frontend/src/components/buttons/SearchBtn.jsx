import React from 'react'

function SearchBtn({handleSearchSubmit}) {
  return (
    <button
        onClick={handleSearchSubmit}
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-none hover:bg-[#007a29] bg-[#009432]"
    >
        <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
        </svg>
    </button>
  )
}

export default SearchBtn