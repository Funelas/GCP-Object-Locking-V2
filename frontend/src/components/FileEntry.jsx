// components/FileEntry.jsx
import React from "react";
import dayjs from "dayjs";
import EditMetadataBtn from "./buttons/EditMetadataBtn";
import LockBtn from "./buttons/LockBtn";

const FileEntry = ({
  filename,
  details,
  metadataChanges,
  lockChanges,
  incBuckets,
  setIncBuckets,
  setEditingMetadata,
  allFiles,
  setEditingFile,
  setObjectIdToBuckets,
  setLockingFile,
  setLockChanges
}) => {
  const calculateLockDuration = (holdExpiry) => {
    if (!holdExpiry) return "Indefinite";
  
    const now = dayjs();
    const expiry = dayjs(holdExpiry);
  
    // 👉 Treat anything 30 seconds or more into the future as indefinite
    if (expiry.diff(now, "second") <= 30) {
      return "Indefinite";
    }
  
    const diff = expiry.diff(now, "day");
  
    if (diff > 0) return `${diff} day(s) left`;
    if (diff === 0) return "Expires today";
    return `Expired ${Math.abs(diff)} day(s) ago`;
  };
  
  const pendingMetadata = metadataChanges[filename];
  const metadata = pendingMetadata || details.metadata || {};
  const pendingLock = lockChanges[filename];
  const finalLockState = pendingLock?.temporary_hold ?? details.temporary_hold;
  const finalExpiry = pendingLock?.hold_expiry ?? details.expiration_date;
  const now = dayjs().add(30, "second");
  const expiryDate = finalExpiry ? dayjs(finalExpiry) : null;
  const isExpiryValid = expiryDate && expiryDate.isAfter(now);
  const isLocked = finalLockState === true || isExpiryValid;
  const lockDuration = isLocked ? calculateLockDuration(finalExpiry) : null;

  const isModified =
    metadataChanges.hasOwnProperty(filename) ||
    lockChanges.hasOwnProperty(filename);
  
  return (
    <div className={`grid grid-cols-4 gap-6 px-8 py-3 items-center transition-all duration-200 border-b border-gray-100 relative ${
      isModified 
        ? "bg-gradient-to-r from-green-50/80 to-white border-l-4 border-l-green-400" 
        : "hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-white"
    }`}>
      

      {/* Client ID Column - Left aligned */}
      <div className="flex flex-col space-y-1">
        {isModified && (
          <div className="flex items-center space-x-2 text-green-600 text-xs mb-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Modified</span>
          </div>
        )}
        <div className="font-primary text-gray-900 font-bold text-md truncate" title={filename}>
          {filename}
        </div>
      </div>

      {/* Metadata Column - Left aligned */}
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <span className="font-accent text-gray-500 text-[0.7875rem] font-medium w-20">Project:</span>
          <span className="font-primary text-gray-900 text-[0.7875rem] font-semibold bg-green-100 px-2 py-1 rounded-md ml-2">
            {metadata.project || "None"}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-accent text-gray-500 text-[0.7875rem] font-medium w-20">Category:</span>
          <span className="font-primary text-gray-900 text-[0.7875rem] font-semibold bg-green-100 px-2 py-1 rounded-md ml-2">
            {metadata.category || "None"}
          </span>
        </div>
      </div>

      {/* Lock Status Column - Left aligned to match header */}
      <div>
        {isLocked ? (
          <div className="inline-flex items-center space-x-2 text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200 min-w-[80%]">
            <span className="text-red-600 text-sm">🔒</span>
            <div className="text-sm">
              <div className="font-primary text-[0.7875rem] font-bold">Locked</div>
              <div className="font-secondary text-[0.675rem] text-red-600 font-medium">{lockDuration}</div>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-2 text-white bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 rounded-lg">
            <span className="text-white text-sm">🔓</span>
            <div className="font-primary text-[0.7875rem] font-bold">Unlocked</div>
          </div>
        )}
      </div>

      {/* Actions Column - Left aligned to match header */}
      <div className="flex items-center space-x-3">
        <EditMetadataBtn 
            filename={filename}
            setIncBuckets={setIncBuckets}
            incBuckets={incBuckets}
            metadataChanges={metadataChanges}
            setEditingFile={setEditingFile}
            setEditingMetadata={setEditingMetadata}
            allFiles={allFiles}          
        />
        
        <LockBtn 
          filename={filename}
          incBuckets={incBuckets}
          isLocked={isLocked}
          setLockChanges={setLockChanges}
          setObjectIdToBuckets={setObjectIdToBuckets}
          setLockingFile={setLockingFile}
          setIncBuckets={setIncBuckets}
        />
      </div>
    </div>
  );
};

export default FileEntry;