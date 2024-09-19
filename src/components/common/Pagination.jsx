import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Function to handle previous page click
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    }

    // Function to handle next page click
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    }
    return (
        <div className='flex justify-between p-2'>
            {/* Previous button */}
            <button
             onClick={handlePreviousPage}
             disabled={currentPage === 1}
             className="px-2 py-1 border rounded-l-md text-sm text-white bg-gradient-to-b from-bb-theme-500 to-bb-theme-600
              hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 shadow-sm
               disabled:from-transparent disabled:to-transparent disabled:bg-bb-theme-100 disabled:text-bb-theme-400"
            >
                Previous
            </button>
            {/* Loop through total pages and create buttons */}
            <div>
            {
                Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => onPageChange(index + 1)}
                        className={`px-3 py-1 border rounded-md text-sm shadow-sm ${currentPage === index + 1 ? 'text-bb-theme-400 bg-bb-theme-100 cursor-default' :'bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 text-white'}`}
                        >
                        {index + 1}
                    </button>
                ))
            }
            </div>
            {/* Next button */}
            <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded-l-md text-sm text-white bg-gradient-to-b from-bb-theme-500 to-bb-theme-600
             hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 shadow-sm
              disabled:from-transparent disabled:to-transparent disabled:bg-bb-theme-100 disabled:text-bb-theme-400"
            >
                Next
            </button>
        </div>
    )
}

export default Pagination;