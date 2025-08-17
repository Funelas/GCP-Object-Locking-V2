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
            className="font-accent bg-gray-300 hover:bg-gray-400 text-gray-700 border-2 border-gray-500 px-3.5 py-2 rounded-xl transition-all duration-200 text-[0.7875rem] flex items-center space-x-2 hover:shadow-md font-semibold hover:border-gray-700 active:scale-95"
            onClick={() => handleEditMetadata(filename, incBuckets)}
          >
            <span className="font-accent text-base">✏️</span>
            <span>Edit</span>
    </button>
  )
}

export default EditMetadataBtn;