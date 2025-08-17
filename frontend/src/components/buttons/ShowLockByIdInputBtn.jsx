import React from 'react'

const ShowLockByIdInputBtn = ({setShowLockByIdInput, showLockByIdInput}) => {
    return (
      <div className="w-[20%]">
          <button
        className="bg-white border-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
        style={{
          borderColor: '#009432',
          color: '#009432'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#009432';
          e.target.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.color = '#009432';
        }}
        onClick={() => setShowLockByIdInput(!showLockByIdInput)}    
      >
        Lock Item {showLockByIdInput ? "▼" : "▲"}
      </button>
      </div>
      
    )
  }
  
  export default ShowLockByIdInputBtn