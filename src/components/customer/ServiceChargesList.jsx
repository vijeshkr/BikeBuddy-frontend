import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import makeRequest from '../../common/axios';
import LoadingIndicator from '../LoadingIndicator';

const ServiceChargesList = ({ close }) => {
    // State to manage loading
    const [loading, setLoading] = useState(false);

    // State to manage service charges 
    const [serviceCharges, setServiceCharges] = useState([]);

    // State to manage search
    const [searchTerm, setSearchTerm] = useState('');

    // Handle search term
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    // Function for fetch service charges from the api
    const fetchServiceCharges = async () => {
        try {
            setLoading(true)
            const response = await makeRequest.get('/get-individual-works');
            if (response.data.success) {
                setServiceCharges(response.data.data.reverse());
            }
        } catch (error) {
            console.error('Error fetching service charges: ', error);
        } finally {
            setLoading(false)
        }
    };

    // Search data
    const searchData = serviceCharges.filter(wrk => wrk.workName.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        fetchServiceCharges();
    }, []);

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4'>
            {loading ? <LoadingIndicator /> :
                <div className='bg-white p-10 rounded-md w-full h-full'>
                    <div className='flex justify-between items-center'>
                    <h2 className="text-xl xs:text-2xl font-semibold mb-4 ">Services Charges</h2>
                        <button
                            className='bg-red-600 text-xs xs:text-base text-white px-2 py-1 rounded-md flex-shrink-0'
                            onClick={close}>Close</button>
                    </div>
                    <div >
                        {/* Showing all service charges in a table */}
                        {
                            serviceCharges.length === 0 ? 'No services available' :
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
                                                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Suitable</th>
                                                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-16'>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className='bg-white divide-y divide-gray-200'>
                                                {
                                                    searchData.map((wrk, index) => (
                                                        <tr key={index} className='hover:bg-gray-50'>
                                                            <td className='px-4 py-3'>{wrk.workName}</td>
                                                            <td className='px-4 py-3'>{wrk.suitable}</td>
                                                            <td className='px-4 py-3'><span>&#8377; </span>{wrk.price}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Small screen device card */}
                                    <div className='sm:hidden overflow-y-auto scrollbar-none max-h-[450px]'>
                                        {
                                            searchData.map((wrk, index) => (
                                                <div key={index} className='min-w-[260px] text-sm flex flex-col gap-3 p-2 shadow-custom'>
                                                    <h1 className='font-semibold'>{wrk.workName}</h1>
                                                    <h3>Suitable for {wrk.suitable}</h3>
                                                    <div className='flex justify-between'>
                                                        <h3 className='font-medium'>Price : <span>&#8377; </span>{wrk.price}</h3>
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

export default ServiceChargesList;
