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
        <div className='flex justify-between p-4'>
            {/* Previous button */}
            <button
             onClick={handlePreviousPage}
             disabled={currentPage === 1}
             className="px-3 py-1 border rounded-l-md disabled:bg-gray-300"
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
                        className={`px-3 py-1 border rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : ''}`}
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
            className="px-3 py-1 border rounded-md disabled:bg-gray-300"
            >
                Next
            </button>
        </div>
    )
}

export default Pagination;