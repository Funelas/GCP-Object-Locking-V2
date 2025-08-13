import React from "react";

const LockByIdInput = ({addFileQuery, setAddFileQuery, addClientQuery, setAddClientQuery}) => {
  return (
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client ID
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-gray-800 placeholder-gray-400"
            style={{
              focusRingColor: '#009432',
              borderColor: '#e5e7eb'
            }}
            onFocus={(e) => e.target.style.borderColor = '#009432'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            placeholder="Enter Client ID"
            value={addClientQuery}
            onChange={(e) => setAddClientQuery(e.target.value)}
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File ID
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-gray-800 placeholder-gray-400"
            style={{
              focusRingColor: '#009432',
              borderColor: '#e5e7eb'
            }}
            onFocus={(e) => e.target.style.borderColor = '#009432'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            placeholder="Enter File ID"
            value={addFileQuery}
            onChange={(e) => setAddFileQuery(e.target.value)}
          />
        </div>
      </div>
  );
};

export default LockByIdInput;