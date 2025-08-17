import React from "react";

const LockByIdInput = ({addFileQuery, setAddFileQuery, addClientQuery, setAddClientQuery}) => {
  return (
      <div className="flex gap-4 w-[80%]">
        <div className="flex-1 max-w-[35%]">
          <label className="font-primary block text-[0.7875rem] font-medium text-gray-700 mb-2">
            Client ID
          </label>
          <input
            type="text"
            className="font-primary w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm"
            style={{
              focusRingColor: '#009432',
              borderColor: '#e5e7eb'
            }}
            onFocus={(e) => e.target.style.borderColor = '#009432'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            placeholder="(eg. dragonhtml)"
            value={addClientQuery}
            onChange={(e) => setAddClientQuery(e.target.value)}
          />
        </div>
        
        <div className="flex-1 max-w-[65%]">
          <label className="font-primary block text-[0.7875rem] font-medium text-gray-700 mb-2">
            File ID
          </label>
          <input
            type="text"
            className="font-primary w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm"
            style={{
              focusRingColor: '#009432',
              borderColor: '#e5e7eb'
            }}
            onFocus={(e) => e.target.style.borderColor = '#009432'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            placeholder="(eg. 1200212025052201010101025)"
            value={addFileQuery}
            onChange={(e) => setAddFileQuery(e.target.value)}
          />
        </div>
      </div>
  );
};

export default LockByIdInput;