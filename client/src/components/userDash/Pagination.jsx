// File: components/Pagination.jsx
import React from 'react';

export default function Pagination({ currentPage, totalPages, paginate }) {
  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null
  }
  
  // Generate pagination numbers
  const renderPaginationNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(
      <button 
        key={1} 
        onClick={() => paginate(1)}
        className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition`}
      >
        1
      </button>
    );
    
    // If there are many pages, use ellipsis
    if (totalPages > 5) {
      // Current page is near the beginning
      if (currentPage < 4) {
        for (let i = 2; i <= 4; i++) {
          if (i <= totalPages) {
            pageNumbers.push(
              <button 
                key={i} 
                onClick={() => paginate(i)}
                className={`px-3 py-1 rounded-md ${currentPage === i ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition`}
              >
                {i}
              </button>
            );
          }
        }
        pageNumbers.push(<span key="ellipsis1">...</span>);
      } 
      // Current page is near the end
      else if (currentPage > totalPages - 3) {
        pageNumbers.push(<span key="ellipsis1">...</span>);
        for (let i = totalPages - 3; i < totalPages; i++) {
          pageNumbers.push(
            <button 
              key={i} 
              onClick={() => paginate(i)}
              className={`px-3 py-1 rounded-md ${currentPage === i ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition`}
            >
              {i}
            </button>
          );
        }
      } 
      // Current page is in the middle
      else {
        pageNumbers.push(<span key="ellipsis1">...</span>);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          if (i > 1 && i < totalPages) {
            pageNumbers.push(
              <button 
                key={i} 
                onClick={() => paginate(i)}
                className={`px-3 py-1 rounded-md ${currentPage === i ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition`}
              >
                {i}
              </button>
            );
          }
        }
        pageNumbers.push(<span key="ellipsis2">...</span>);
      }
      
      // Always show last page if not already included
      if (totalPages > 1) {
        pageNumbers.push(
          <button 
            key={totalPages} 
            onClick={() => paginate(totalPages)}
            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition`}
          >
            {totalPages}
          </button>
        );
      }
    } else {
      // Less than 5 pages, show all
      for (let i = 2; i <= totalPages; i++) {
        pageNumbers.push(
          <button 
            key={i} 
            onClick={() => paginate(i)}
            className={`px-3 py-1 rounded-md ${currentPage === i ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition`}
          >
            {i}
          </button>
        );
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition`}
        >
          &laquo;
        </button>
        
        {renderPaginationNumbers()}
        
        <button 
          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition`}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}