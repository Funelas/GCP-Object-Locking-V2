import React, {useEffect, useMemo} from "react";

const Pagination = ({ page, setPage, allFiles, setVisibleFiles, PAGE_SIZE}) => {
  const pages = useMemo(() => 
      Math.ceil(allFiles.length / PAGE_SIZE), 
      [allFiles.length]);
  useEffect(() => {
        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        // Change to setState
        setVisibleFiles(allFiles.slice(start, end));
      }, [allFiles, page])

  const getPagination = () => {
    if (pages <= PAGE_SIZE) return [...Array(pages).keys()].map(i => i + 1);

    const left = Math.max(2, page - 2);
    const right = Math.min(pages - 1, page + 2);
    const range = [];

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < pages - 1) range.push("...");
    range.push(pages);

    return range;
  };

  return (pages > 0 ?
    (<div className="flex justify-center gap-2 mt-4">
      <button
        className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </button>

      {getPagination().map((p, i) =>
        p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
            <button
            key={`page-${p}`}
            className={`px-3 py-1 rounded ${
                page === p ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setPage(p)}
            >
            {p}
            </button>
        )
        )}


      <button
        className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  ): null);
};

export default Pagination;
