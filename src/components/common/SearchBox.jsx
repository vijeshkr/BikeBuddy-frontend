import React from 'react';
import { IoSearch } from 'react-icons/io5';

/**
 * SearchBox Component
 * @param {string} value - The current value of the search input
 * @param {function} onChange - Function to handle the change event    
 * 
 */

const SearchBox = ({value, onChange}) => {
    return (
        <div className='border rounded-md px-2 flex items-center justify-between max-w-[250px] mb-3'>
            {/* Input field */}
            <input
                type="text"
                value={value}
                onChange={onChange}
                className='outline-none p-1 text-sm w-full'
                placeholder='Search'
            />

            {/* Search icon */}
            <div className='px-2 text-gray-400'>
                <IoSearch />
            </div>
        </div>
    )
}

export default SearchBox