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
    <div className={`bg-white border-2 rounded-xl shadow-sm shadow-gray-600 transition-all duration-300 hover:shadow-lg ${
      isModified 
        ? "border-l-4 border-l-orange-400 bg-gradient-to-r from-orange-50/50 to-white shadow-md" 
        : "border-gray-100 hover:border-gray-200"
    }`}>
      {/* Modified indicator */}
      {isModified && (
        <div className="flex items-center space-x-2 text-orange-600 text-xs px-6 pt-4 pb-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-sm"></div>
          <span className="font-semibold tracking-wide uppercase">Pending Changes</span>
        </div>
      )}

      {/* Content Row */}
      <div className="grid grid-cols-4 gap-6 px-6 py-5 items-center">
        {/* Client ID Column */}
        <div className="min-w-0">
          <div className="text-gray-900 font-bold text-lg truncate tracking-tight" title={filename}>
            {filename}
          </div>
        </div>

        {/* Metadata Column */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-gray-500 font-medium min-w-fit">Project:</span>
            <span className="text-gray-900 font-semibold truncate bg-gray-50 px-2 py-1 rounded-md">
              {metadata.project || "None"}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-gray-500 font-medium min-w-fit">Category:</span>
            <span className="text-gray-900 font-semibold truncate bg-gray-50 px-2 py-1 rounded-md">
              {metadata.category || "None"}
            </span>
          </div>
        </div>

        {/* Lock Status Column */}
        <div>
          {isLocked ? (
            <div className="flex items-center space-x-3 text-red-700 bg-red-50 px-4 py-3 rounded-xl border-2 border-red-100 shadow-sm">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">🔒</span>
              </div>
              <div className="text-sm">
                <div className="font-bold">Locked</div>
                <div className="text-xs text-red-600 font-medium">{lockDuration}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-white bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 rounded-xl shadow-sm" style={{background: 'linear-gradient(135deg, #009432 0%, #007428 100%)'}}>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🔓</span>
              </div>
              <div className="text-sm font-bold">Unlocked</div>
            </div>
          )}
        </div>

        {/* Actions Column */}
        <div className="flex items-center space-x-3">
          <EditMetadataBtn 
              filename = {filename}
              setIncBuckets={setIncBuckets}
              incBuckets = {incBuckets}
              metadataChanges={metadataChanges}
              setEditingFile={setEditingFile}
              setEditingMetadata = {setEditingMetadata}
              allFiles={allFiles}          
          />
          
          <LockBtn 
            filename={filename}
            incBuckets={incBuckets}
            isLocked={isLocked}
            setLockChanges={setLockChanges}
            setObjectIdToBuckets = {setObjectIdToBuckets}
            setLockingFile = {setLockingFile}
            setIncBuckets={setIncBuckets}
          />
        </div>
      </div>
    </div>
  );
};

export default FileEntry;