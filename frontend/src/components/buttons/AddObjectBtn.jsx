import React, {useState, useEffect, useCallback} from 'react';
import toast from 'react-hot-toast';


const AddObjectBtn = ({ setLockingFile, setObjectId, setIncBuckets, addFileQuery, setAddFileQuery, addClientQuery, setAddClientQuery, allFiles, newFiles, setAllFiles, setNewFiles, PAGE_SIZE, setPage, setLoading}) => {
    const [results, setResults] = useState([]);

    const addFileToList = useCallback((filename, buckets_met) => {
        if (!filename || typeof filename !== "string") {
          return;
        }
        
        // Check if filename already exists
        const alreadyExists = allFiles.some(f => f.name === filename) || 
                             newFiles.some(f => f.name === filename);
      
        if (alreadyExists) {
          return;
        }
      
        const newFile = {
          name: filename,
          temporary_hold: false,
          expiration_date: null,
          metadata: {},
          buckets: buckets_met || []
        };
      
        const updatedAllFiles = [...allFiles, newFile];
        const updatedNewFiles = [...newFiles, newFile];
        
        setAllFiles(updatedAllFiles);
        setNewFiles(updatedNewFiles);
      
        // Navigate to last page to show new file
        const newLastPage = Math.ceil(updatedAllFiles.length / PAGE_SIZE);
        setPage(newLastPage);
      }, [allFiles, newFiles, setPage]);

    const handleAddAll = () => {
        if (results.length === 0) return;
        setIncBuckets(results);
        setLockingFile(addFileQuery);
        addFileToList(addFileQuery, results[addFileQuery]);
        setAddFileQuery("");
        setResults([]);
        setObjectId(addFileQuery);
        };
    const handleSearch = async () => {
    if (!addFileQuery.trim()) {
      toast.error((t) => ( 
        <span className="flex items-center justify-between w-full"> 
          <span className="text-gray-800 font-medium">
            Please enter a search term.
          </span>
          <button 
            className="ml-4 text-red-500 hover:text-red-500/80 font-medium transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-red-50" 
            onClick={() => toast.dismiss(t.id)} 
          > 
            Close 
          </button> 
        </span> 
      ), { 
        duration: 5000,
        className: 'bg-white rounded-2xl shadow-2xl border border-gray-100 p-4',
      });
        return;
    }
        
    setLoading(true);
    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/search-objects?query=${addFileQuery}`)
        const data = await res.json();
        const allResults = data[0]
        const objectCount = data[1];
        const bucketCount = Object.values(allResults).reduce(
        (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
        0
        );
        if (objectCount > 0) {
          toast.success((t) => ( 
            <span className="flex items-center justify-between w-full"> 
              <span className="text-gray-800 font-medium">
                Found <span className="text-[#009432] font-semibold">{objectCount}</span> object(s) across <span className="text-[#009432] font-semibold">{bucketCount}</span> bucket(s). 
              </span>
              <button 
                className="ml-4 text-[#009432] hover:text-[#009432]/80 font-medium transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-[#009432]/10" 
                onClick={() => toast.dismiss(t.id)} 
              > 
                Close 
              </button> 
            </span> 
          ), { 
            duration: 5000,
            className: 'bg-white rounded-2xl shadow-2xl border border-gray-100 p-4',
          });
          
        setResults(allResults);
        } else {
        toast.error("No matching objects found.");
        setResults([]);
        }
    } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to search objects.");
    } finally{
        setLoading(false);
    }
    };
    
    useEffect(()=> {
    handleAddAll()
    }, [results])
  return (
    <div className="ml-2">
      <button
        className="font-accent text-white text-sm px-6 h-10 rounded-lg w-fit font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 hover:bg-[#007a29] bg-[#009432]"
        onClick={handleSearch}
      >
        🔒 Lock
      </button>
  </div>
   
  )
}

export default AddObjectBtn;