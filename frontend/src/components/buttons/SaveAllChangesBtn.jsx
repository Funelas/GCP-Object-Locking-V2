import React from 'react'

const SaveAllChangesBtn = ({hasChanges, expiredFiles, metadataChanges, lockChanges, objectIdToBuckets, setNewFiles, setLockChanges, setMetadataChanges, setObjectIdToBuckets, setLoading}) => {
    const saveAllChanges = async () => {
        console.log("Lock Changes: ", lockChanges)
        setLoading(true);
        
        try {
          // Format expired files
          const formattedExpiredFiles = expiredFiles.map(file => ({
            filename: file.name,
            metadata: file.metadata,
            lockstatus: {
              temporary_hold: file.temporary_hold,
              hold_expiry: file.expiration_date
            }
          }));
    
          // Combine all updates
          const combinedUpdates = [...formattedExpiredFiles];
          const filenames = new Set([
            ...Object.keys(metadataChanges),
            ...Object.keys(lockChanges),
          ]);
    
          filenames.forEach(filename => {
            const entry = { filename };
    
            if (metadataChanges[filename]) {
              entry.metadata = metadataChanges[filename];
            }
    
            if (lockChanges[filename]) {
              const { temporary_hold, hold_expiry } = lockChanges[filename];
              entry.lockstatus = {
                temporary_hold,
                ...(hold_expiry && { hold_expiry }),
              };
            }
    
            combinedUpdates.push(entry);
          });
    
    
          console.log("COMBINED UPDATES: ", combinedUpdates);
          // Organize updates by bucket
          const newPayload = {};
          console.log("OBJECT ID TO BUCKETS: ", objectIdToBuckets)
          const uniqueBuckets = [...new Set(
            Object.values(objectIdToBuckets)
              .flatMap(inner => Object.values(inner))
              .flat()
          )];
          console.log("Unique BUCKETS: ", uniqueBuckets);
          // Initialize empty arrays for each bucket
          uniqueBuckets.forEach(bucketName => {
            newPayload[bucketName] = [];
          });
          
          // Populate updates by bucket
          combinedUpdates.forEach(item => {
            const { filename, ...rest } = item;
            const buckets = objectIdToBuckets[filename] 
              ? Object.values(objectIdToBuckets[filename]).flat()
              : []; // fallback to current bucket
              
            buckets.forEach(bucket => {
              if (newPayload[bucket]) {
                newPayload[bucket].push({ filename, ...rest });
              }
            });
          });
    
          console.log("PAYLOAD: ", newPayload)
          // Send updates to server
          const response = await fetch("http://localhost:8000/update-all-buckets", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPayload),
          });
    
          if (!response.ok) {
            throw new Error("🚨 Lock File Generation Mismatch. Please refresh the webpage.");
          }
          
          alert("✅ All changes saved successfully.");
          
        } catch (error) {
          alert(error.message || "❌ Failed to save changes. Please try again.");
        } finally {
          // Reset all states
          setNewFiles([]);
          setMetadataChanges({});
          setLockChanges({});
          setObjectIdToBuckets({});
          
          setLoading(false);
        }
      };
  return (hasChanges ?
        (
        <div className="flex justify-center pt-4">
          <button
            className="text-white px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-4 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            style={{background: 'linear-gradient(135deg, #009432 0%, #007428 100%)'}}
            onClick={saveAllChanges}
          >
            <span className="text-2xl">💾</span>
            <span>Save All Changes</span>
          </button>
        </div>
        ) 
      : null
  )
}

export default SaveAllChangesBtn