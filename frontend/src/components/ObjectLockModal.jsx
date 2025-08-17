import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
const ObjectLockModal = ({ filename, objectId, incBuckets, setLockingFile, setLockChanges, setObjectIdToBuckets, setEditingFile, setObjectId, setIncBuckets, setEditingMetadata}) => {
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isIndefinite, setIsIndefinite] = useState(false);

  // Put in "Edit Metadata" & "Lock" Modals  
  const onClose = (filename, update = null) => {
      // Handle modal cancellation
      if (filename === null) {
        setLockingFile(null);
        return;
      }
      
      const isIndefinite = update === null;
      const holdExpiry = isIndefinite
        ? dayjs().add(10, "second").toISOString()
        : update;
      setLockChanges(prev => ({
        ...prev,
        [filename]: {
          temporary_hold: isIndefinite,
          hold_expiry: holdExpiry,
        },
      }));
    
  
      // Update bucket mapping
      setObjectIdToBuckets((prev) => ({
        ...prev, 
        [filename]: incBuckets
      }));
  
      // Handle modal state
      if (objectId) {
        setEditingFile(filename);
      } else {
        setEditingFile(null);
        setObjectId(null);
         // Reset modal states
        setEditingMetadata(null);
        setIncBuckets([]);
      }
      setLockingFile(null);
     
    };
    // Put in "Lock" Button
   
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsIndefinite(false); // Disable "indefinite" if a date is selected
    setShowCalendar(false); // Auto-close calendar (optional)
  };

  const handleSave = () => {
    if (!selectedDate && !isIndefinite) {
      alert("Please select a date or choose Indefinite.");
      return;
    }
  
    const resultDate = isIndefinite ? null : format(selectedDate, "yyyy-MM-dd");
  
    // 👇 Now send the updateType too
    onClose(filename, resultDate, incBuckets);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out bg-black/50 h-[100vh]">
      <div className="bg-white rounded-2xl p-8 w-[600px] max-w-[95vw] shadow-2xl relative border border-gray-100 max-h-[80vh] max-h-[90%] overflow-y-auto">
        <h2 className="font-primary text-2xl font-bold mb-6 text-gray-800">
          🔒 Lock Object
        </h2>
        <div className="mb-4 px-4 py-3 bg-[#009432]/5 rounded-xl border border-[#009432]/20">
          <span className="text-[#009432] font-semibold text-lg">{objectId ?? filename}</span>
        </div>
  
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="font-primary block text-sm font-semibold text-gray-600 mb-3 px-1">
              Select Lock Expiry Date
            </label>
  
            <div className="relative">
              <input
                type="text"
                value={
                  isIndefinite
                    ? "Indefinite"
                    : selectedDate
                    ? format(selectedDate, "yyyy-MM-dd")
                    : ""
                }
                readOnly
                className="font-primary w-full bg-gray-50 text-gray-800 p-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#009432] focus:outline-none transition-colors duration-200"
                placeholder="Pick a date or select Indefinite"
              />
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="font-accent absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#009432] transition-colors duration-200"
                title="Pick a date"
              >
                <FiCalendar size={20} />
              </button>
            </div>
  
            {showCalendar && !isIndefinite && (
              <div className="bg-white border-2 border-gray-100 rounded-xl p-4 shadow-lg flex justify-center items-center">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  inline
                  minDate={new Date()}
                />
              </div>
            )}
          </div>
  
          <div className="px-4 py-3 bg-[#009432]/5 rounded-xl border border-[#009432]/20">
            <div className="flex items-start gap-3">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="indefinite"
                  checked={isIndefinite}
                  onChange={() => {
                    setIsIndefinite(!isIndefinite);
                    if (!isIndefinite) setSelectedDate(null);
                  }}
                  className="w-4 h-4 text-[#009432] border-2 border-gray-300 rounded focus:ring-[#009432] focus:ring-2"
                />
              </div>
              <label htmlFor="indefinite" className="text-sm text-gray-700 leading-relaxed font-secondary">
                Set lock to <span className="font-bold text-[#009432] font-primary">Indefinite</span> (no expiration)
              </label>
            </div>
          </div>
        </div>
  
        <div className="flex justify-end gap-4 mt-2">
          <button
            onClick={() => onClose(null, null, null)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#009432] hover:bg-[#009432]/90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Lock
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObjectLockModal;
