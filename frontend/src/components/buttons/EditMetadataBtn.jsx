import React from 'react';


const EditMetadataBtn = ({setIncBuckets, incBuckets, metadataChanges, setEditingFile, setEditingMetadata, allFiles, filename}) => {
    const handleEditMetadata = (filename) => {
        const existing = metadataChanges[filename];
        const fileObject = allFiles.find(f => f.name === filename);
        const original = fileObject?.metadata || {};
        setEditingFile(filename);
        setEditingMetadata(existing || original);
        setIncBuckets(incBuckets);
        }; 
  return (
    <button
            className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm flex items-center space-x-2 hover:shadow-md font-semibold hover:border-gray-300 active:scale-95"
            onClick={() => handleEditMetadata(filename, incBuckets)}
          >
            <span className="text-base">✏️</span>
            <span>Edit</span>
    </button>
  )
}

export default EditMetadataBtn;