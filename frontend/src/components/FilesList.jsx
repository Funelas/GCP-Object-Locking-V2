import React, { useState, useCallback, useMemo, useEffect} from "react";
import toast from "react-hot-toast";
import MetadataModal from "./MetadataModal.jsx";
import ObjectLockModal from "./ObjectLockModal.jsx";
import Pagination from "./Pagination.jsx";
import LockByIdInput from "./LockByIdInput.jsx";
import FileEntry from "./FileEntry.jsx"; 
import dayjs from "dayjs";
import SearchBar from "./ui/SearchBar.jsx";
import LoadingOverlay from "./ui/LoadingOverlay.jsx";
import AddObjectBtn from "./buttons/AddObjectBtn.jsx";
import SaveAllChangesBtn from "./buttons/SaveAllChangesBtn.jsx";
const FilesList = () => {
  
  // UI State - grouped by functionality
  const [editingFile, setEditingFile] = useState(null);
  const [editingMetadata, setEditingMetadata] = useState(null);
  const [lockingFile, setLockingFile] = useState(null);
  
  // Data State
  const [metadataChanges, setMetadataChanges] = useState({});
  const [lockChanges, setLockChanges] = useState({});
  const [objectId, setObjectId] = useState(null);
  const [objectIdToBuckets, setObjectIdToBuckets] = useState({});
  const [incBuckets, setIncBuckets] = useState([]);

  // Pagination State
  const PAGE_SIZE = 5;
  const [visibleFiles, setVisibleFiles] = useState([]);

  // Lock by ID State
  const [addFileQuery, setAddFileQuery] = useState("");
  const [addClientQuery, setAddClientQuery] = useState("");


  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [allFiles, setAllFiles] = useState([]);
  const [expiredFiles, setExpiredFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]); // Added to track new files at App level
  
  useEffect(() =>{
    console.log("Visible Files: ", visibleFiles)
  }, [visibleFiles])
  const mainBucket = "tempbucket24" // Where JSON is stored 
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/files`);
      if (search) url.searchParams.append("query", search);
      url.searchParams.append("bucket", mainBucket);
      const res = await fetch(url);
      const data = await res.json();
      
      const now = dayjs().add(30, "second");

      const filtered = data.files.filter((details) => {
        const expiry = details.expiration_date ? dayjs(details.expiration_date) : null;
        return !(expiry && expiry.isBefore(now) && !details.temporary_hold);
      });

      const expired = data.files.filter((details) => {
        const expiry = details.expiration_date ? dayjs(details.expiration_date) : null;
        return expiry && expiry.isBefore(now) && !details.temporary_hold;
      });

      // Filter out new files that already exist in the fetched files
      const filteredFilenames = new Set(filtered.map((file) => file.name));
      const uniqueNewFiles = newFiles.filter(f => !filteredFilenames.has(f.name));

      setAllFiles([...filtered, ...uniqueNewFiles]);
      setExpiredFiles(expired);
      const expiredMaps = expired.reduce((acc, file) => {
        acc[file.name] = [...(acc[file.name] || []), ...file.buckets];
        return acc;
      }, {});
      console.log("Expired Maps", expiredMaps);
      setObjectIdToBuckets(expiredMaps);
      
    } catch (err) {
      toast.error("Failed to fetch files:", err, " Please Reload.");
    } finally {
      setLoading(false);
    }
  }, [search])
  
  useEffect(() => {
    console.log("Expired Files : ", expiredFiles);
    console.log("Object Id To Buckets: ", objectIdToBuckets)
  }, [objectIdToBuckets]);

  useEffect(() => {
    fetchFiles();
  }, [search]); // Added bucketName as dependencies

  const hasChanges = useMemo(() => 
    Object.keys(lockChanges).length > 0 || Object.keys(metadataChanges).length > 0,
    [lockChanges, metadataChanges]
  );

  
  
  // Save all changes with better error handling and user feedback - Put in "Save All Button"
  

  
  // Error state
  if (!Array.isArray(allFiles)) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-4 bg-white rounded-2xl shadow-lg px-8 py-6 border-2 border-red-100">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          <p className="text-gray-800 font-semibold text-lg">Error loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Loading Overlay */}
      {loading && <LoadingOverlay message="Processing Files..." />}
      {/* Modals */}
      {editingFile && (
        <MetadataModal
          filename={editingFile}
          metadata={editingMetadata}
          objectId={objectId}
          incBuckets={incBuckets}
          setEditingMetadata={setEditingMetadata}
          setEditingFile = {setEditingFile}
          setMetadataChanges={setMetadataChanges}
          setObjectIdToBuckets = {setObjectIdToBuckets}
          setObjectId = {setObjectId}
          setIncBuckets={setIncBuckets}
          setLockingFile = {setLockingFile}
        />
      )}
      
      {lockingFile && (
        <ObjectLockModal 
          filename={lockingFile} 
          objectId={objectId} 
          incBuckets={incBuckets}
          setLockingFile = {setLockingFile}
          setLockChanges={setLockChanges}
          setObjectIdToBuckets={setObjectIdToBuckets}
          setEditingFile={setEditingFile}
          setObjectId={setObjectId}
          setIncBuckets={setIncBuckets}
          setEditingMetadata={setEditingMetadata}
        />
      )}
      
      <SearchBar setSearch={setSearch} setPage={setPage}/>

      {/* Files List Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#009432] overflow-hidden w-[90%] mx-auto">
        <div className="bg-white to-white p-6 border-b border-gray-100 w-full">
          <div className="flex justify-between m-2 w-full">
            <div className="flex items-center space-x-3 w-[40%] justify-center">
              <div className="w-10 h-10 flex items-center justify-center">
                <span className="text-white text-4xl">📋</span>
              </div>
              <h2 className="font-primary text-gray-1100 text-2xl font-bold tracking-tight">File List</h2>
            </div>

            <div className="flex items-end justify-end m-2 w-[60%]">
              <LockByIdInput 
                addFileQuery={addFileQuery}
                setAddFileQuery={setAddFileQuery}
                addClientQuery={addClientQuery}
                setAddClientQuery={setAddClientQuery}
              />
              <AddObjectBtn 
                setLockingFile={setLockingFile} 
                setObjectId={setObjectId} 
                setIncBuckets={setIncBuckets}
                addFileQuery={addFileQuery}
                setAddFileQuery={setAddClientQuery}
                allFiles={allFiles}
                newFiles={newFiles}
                setAllFiles={setAllFiles}
                setNewFiles={setNewFiles}
                PAGE_SIZE={PAGE_SIZE}
                setPage={setPage}
                setLoading = {setLoading}/>
            </div>
          </div>
          
        </div>

        {/* Updated Table Header - Left aligned to match content */}
        {visibleFiles.length > 0 && (
          <div className="grid grid-cols-4 gap-6 px-8 border-y-1 border-gray-700 bg-gray-200 sticky top-0 z-10 divide-x divide-gray-700 items-stretch h-12">
            <div className="font-primary text-gray-700 font-bold text-[0.7875rem] uppercase tracking-wide flex items-center">
              Client ID
            </div>
            <div className="font-primary text-gray-700 font-bold text-[0.7875rem] uppercase tracking-wide flex items-center">
              Metadata
            </div>
            <div className="font-primary text-gray-700 font-bold text-[0.7875rem] uppercase tracking-wide flex items-center">
              Lock Status
            </div>
            <div className="font-primary text-gray-700 font-bold text-[0.7875rem] uppercase tracking-wide flex items-center">
              Actions
            </div>
          </div>
        )}

        {/* Updated File Entries Container */}
        <div className="min-h-96 bg-white">
          {visibleFiles.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-6 max-w-md">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-4xl">🪹</span>
                </div>
                <div>
                  <h3 className="text-gray-900 text-xl font-bold mb-2">No Files Found</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">No files in this bucket are currently locked.</p>
                  <p className="text-gray-500 text-sm mt-2">Add files using the search section above to get started.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {visibleFiles.map((details, index) => (
                <FileEntry
                  key={`${details.name}-${index}`}
                  filename={details.name}
                  details={details}
                  metadataChanges={metadataChanges}
                  lockChanges={lockChanges}
                  setLockChanges={setLockChanges}
                  incBuckets={details.buckets || []}
                  setIncBuckets={setIncBuckets}
                  setEditingMetadata={setEditingMetadata}
                  setEditingFile={setEditingFile}
                  allFiles={allFiles}
                  setObjectIdToBuckets={setObjectIdToBuckets}
                  setLockingFile={setLockingFile}
                />
              ))}
            </div>
          )}

        </div>
      </div>

     
      <Pagination page={page} allFiles={allFiles} setPage={setPage} setVisibleFiles={setVisibleFiles} PAGE_SIZE={PAGE_SIZE}/>
       

      <SaveAllChangesBtn 
      hasChanges = {hasChanges} 
      expiredFiles = {expiredFiles} 
      metadataChanges={metadataChanges} 
      lockChanges={lockChanges}
      objectIdToBuckets = {objectIdToBuckets}
      setNewFiles = {setNewFiles}
      setLockChanges = {setLockChanges}
      setMetadataChanges = {setMetadataChanges}
      setObjectIdToBuckets = {setObjectIdToBuckets}
      setLoading = {setLoading}
      fetchFiles={fetchFiles}
      allFiles={allFiles}
      setPage={setPage}
      PAGE_SIZE={PAGE_SIZE}
      />
    </div>
  );
};

export default FilesList;