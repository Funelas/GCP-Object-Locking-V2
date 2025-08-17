import React from 'react';
import dayjs from 'dayjs';
const LockBtn = ({isLocked, filename, incBuckets, setLockChanges, setObjectIdToBuckets, setLockingFile, setIncBuckets }) => {
    const handleToggleLock = (filename, currentLockState) => {
        if (currentLockState) {
          // Unlock the file
          setLockChanges((prev) => ({
            ...prev,
            [filename]: {
              temporary_hold: false,
              hold_expiry: dayjs().add(10, 'second').toISOString(),
            },
          }));
          
          setObjectIdToBuckets((prev) => ({
            ...prev, 
            [filename]: incBuckets
          }));
        } else {
          // Lock the file - open modal
          setLockingFile(filename);
          setLockChanges((prev) => {
            const filtered = Object.fromEntries(
              Object.entries(prev).filter(([key]) => key !== filename)
            );
            return filtered;
          });
          setIncBuckets(incBuckets);
        }
      };
  return (
    <button
            className={`font-accent px-3.5 py-2 rounded-xl border-2 transition-all duration-200 text-[0.7875rem] flex items-center space-x-2 hover:shadow-md font-semibold active:scale-95 ${
              isLocked
                ? "bg-red-500 hover:bg-red-700 text-white border-red-500 hover:border-red-600"
                : "text-white border-transparent hover:shadow-lg hover:bg-[#007a29] bg-[#009432]"
            }`}
            onClick={() => handleToggleLock(filename, isLocked, incBuckets)}
          >
            <span className="text-base">{isLocked ? "🔓" : "🔒"}</span>
            <span>{isLocked ? "Unlock" : "Lock"}</span>
    </button>
  )
}

export default LockBtn;