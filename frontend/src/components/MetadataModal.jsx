import React, { useState } from "react";

const MetadataModal = ({ filename, metadata, objectId, incBuckets, setEditingMetadata, setEditingFile, setMetadataChanges, setObjectIdToBuckets, setObjectId, setIncBuckets, setLockingFile}) => {

  
  const initialRows = Object.entries(metadata || {});
  const [rows, setRows] = useState([...initialRows, ["", ""]]);

  const handleAddRow = () => {
    setRows([...rows, ["", ""]]);
  };

  const onClose = (filename, update = null) => {
    // Handle modal cancellation
    if (filename === null) {
      setEditingMetadata(null);
      setEditingFile(null);
      return;
    }
    
    setMetadataChanges(prev => ({
      ...prev,
      [filename]: update,
    }));
 
    // Update bucket mapping
    setObjectIdToBuckets(prev => ({
      ...prev, 
      [filename]: incBuckets
    }));

    setEditingFile(null);
    setObjectId(null);

    // Reset modal states
    setEditingMetadata(null);
    setLockingFile(null);
    setIncBuckets([]);
  };
  
  const handleRemoveRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  const handleInputChange = (index, col, value) => {
    const updated = [...rows];
    updated[index][col] = value;
    setRows(updated);
  };

  const handleSave = () => {
    const metadataObj = {};
    rows.forEach(([key, value]) => {
      if (key.trim() !== "") {
        metadataObj[key.trim()] = value.trim();
      }
    });
  
    onClose(filename, metadataObj, incBuckets); 
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out bg-black/50 h-[100vh]">
      <div className="bg-white rounded-2xl p-8 w-[600px] max-w-[95vw] shadow-2xl relative border border-gray-100 max-h-[80vh] max-h-[90%]">
        <h2 className="font-primary text-2xl font-bold mb-6 text-gray-800">
          📝 Edit Metadata
        </h2>
        <div className="mb-4 px-4 py-3 bg-[#009432]/5 rounded-xl border border-[#009432]/20">
          <span className="font-secondary text-[#009432] font-semibold text-lg">{objectId ?? filename}</span>
        </div>
  
        {/* Headers */}
        <div className="grid grid-cols-3 gap-3 font-semibold text-gray-600 mb-3 px-1">
          <div className="font-primary">Key</div>
          <div className="font-primary">Value</div>
        </div>
  
        {/* Input Rows */}
        <div className="h-[150px] overflow-y-auto mb-6 space-y-3">
          {rows.map(([key, value], idx) => (
            <div className="grid grid-cols-3 gap-3 items-center" key={idx}>
              <input
                type="text"
                value={key}
                onChange={(e) => handleInputChange(idx, 0, e.target.value)}
                className="font-primary bg-gray-50 text-gray-800 p-3 rounded-xl border-2 border-gray-200 focus:border-[#009432] focus:outline-none transition-colors duration-200"
                placeholder="Enter key"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(idx, 1, e.target.value)}
                className="font-primary bg-gray-50 text-gray-800 p-3 rounded-xl border-2 border-gray-200 focus:border-[#009432] focus:outline-none transition-colors duration-200"
                placeholder="Enter value"
              />
              <button
                className="font-accent text-red-500 hover:text-red-400 hover:bg-red-50 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-200"
                onClick={() => handleRemoveRow(idx)}
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
  
        {/* Add Row Button */}
        <button
          onClick={handleAddRow}
          className="font-accent w-full mb-6 bg-[#009432]/10 hover:bg-[#009432]/20 text-[#009432] py-3 rounded-xl font-medium transition-all duration-200 border-2 border-dashed border-[#009432]/30 hover:border-[#009432]/50"
        >
          ➕ Add New Row
        </button>
  
        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => onClose(null, null, null)}
            className="font-accent bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="font-secondary bg-[#009432] hover:bg-[#009432]/90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetadataModal;
