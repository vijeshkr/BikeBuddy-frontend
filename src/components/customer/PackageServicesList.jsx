import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import makeRequest from '../../common/axios';
import LoadingIndicator from '../LoadingIndicator';

const PackageServicesList = ({ close }) => {
    // State to manage loading
    const [loading, setLoading] = useState(false);

    // State to manage service packages 
    const [servicePackages, setServicePackages] = useState([]);

    // State to manage search
    const [searchTerm, setSearchTerm] = useState('');

    // Handle search term
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    // Function for fetch service packages from the api
    const fetchServicePackages = async () => {
        try {
            setLoading(true)
            const response = await makeRequest.get('/get-packages');
            if (response.data.success) {
                setServicePackages(response.data.data.reverse());
            }
        } catch (error) {
            console.error('Error fetching service packages: ', error);
        } finally {
            setLoading(false)
        }
    };

    // Search data
    const searchData = servicePackages.filter(pkg => pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        fetchServicePackages();
    }, []);

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4'>
            {loading ? <LoadingIndicator /> :
                <div className='bg-white p-10 rounded-md w-full h-full'>
                    <div className='flex justify-between items-center'>
                    <h2 className="text-xl xs:text-2xl font-semibold mb-4 ">Our Packages</h2>
                        <button
                            className='bg-red-600 text-xs xs:text-base text-white px-2 py-1 rounded-md flex-shrink-0'
                            onClick={close}>Close</button>
                    </div>
                    <div >
                        {/* Showing all service packages in a table */}
                        {
                            servicePackages.length === 0 ? 'No packages available' :
                                <div>
                                    <div className='py-2 flex justify-between flex-wrap'>
                                        <div className='border rounded-md px-2 flex items-center justify-between max-w-[250px]'>
                                            <input
                                                onChange={handleSearch}
                                                value={searchTerm}
                                                className='outline-none p-1 text-sm'
                                                type="text"
                                                placeholder='Search' />
                                            <div className='px-2 text-gray-400'>
                                                <IoSearch />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Table section */}
                                    <div className='overflow-y-auto scrollbar-none max-h-[450px] border-b'>
                                        <table className='hidden sm:table w-full divide-y divide-gray-200 shadow-custom min-w-[455px]'>
                                            <thead className='bg-gray-50'>
                                                <tr className='text-left'>
                                                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                                                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Description</th>
                                                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Suitable</th>
                                                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-16'>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className='bg-white divide-y divide-gray-200'>
                                                {
                                                    searchData.map((pkg, index) => (
                                                        <tr key={index} className='hover:bg-gray-50'>
                                                            <td className='px-4 py-3'>{pkg.packageName}</td>
                                                            <td className='px-4 py-3 max-w-[350px]'>{pkg.description}</td>
                                                            <td className='px-4 py-3'>{pkg.suitable}</td>
                                                            <td className='px-4 py-3'><span>&#8377; </span>{pkg.price}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Small screen device card */}
                                    <div className='sm:hidden overflow-y-auto scrollbar-none max-h-[450px]'>
                                        {
                                            searchData.map((pkg, index) => (
                                                <div key={index} className='min-w-[260px] text-sm flex flex-col gap-3 p-2 shadow-custom'>
                                                    <h1 className='font-semibold'>{pkg.packageName}</h1>
                                                    <p className='text-gray-500'>{pkg.description}</p>
                                                    <h3>Suitable for {pkg.suitable}</h3>
                                                    <div className='flex justify-between'>
                                                        <h3 className='font-medium'>Price : <span>&#8377; </span>{pkg.price}</h3>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                        }
                    </div>
                </div>}
        </div>
    )
}

export default PackageServicesList;
