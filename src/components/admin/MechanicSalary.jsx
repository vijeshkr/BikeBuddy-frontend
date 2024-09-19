import React, { useEffect, useState } from 'react';
import MechanicTargetForm from '../../components/admin/MechanicTargetForm';
import makeRequest from '../../common/axios';
import { CiEdit } from "react-icons/ci";
import { displayINRCurrency } from '../../common/utils';
import Pagination from '../common/Pagination';
import SearchBox from '../common/SearchBox';

const MechanicSalary = () => {
    // State for loading
    const [loading, setLoading] = useState(false);

    // State for the visibility of add new mechanic targets form
    // const [openAddNewTargets, setOpenAddNewTargets] = useState(false);
    // State for the filter options
    // const [selectedMonth, setSelectedMonth] = useState('');
    // const [selectedYear, setSelectedYear] = useState('');

    // State to store fetched mechanic target data
    const [targets, setTargets] = useState([]);
    // State to manage search
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [targetsPerPage] = useState(4);

    // Search logic
    const searchData = targets.filter(target => target?.mechanicId?.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()));

    // Pagination logic
    const indexOfLastTarget = currentPage * targetsPerPage;
    const indexOfFirstTarget = indexOfLastTarget - targetsPerPage;
    const currentPageTargets = searchData.slice(indexOfFirstTarget, indexOfLastTarget);

    const totalPages = Math.ceil(searchData.length / targetsPerPage);

    // Handle search term
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    // Function for fetch mechanic targets based on filter
    const fetchTargets = async () => {
        setLoading(true);
        try {
            const response = await makeRequest.get('/get-all-mechanic-targets', {
                // params: { month: selectedMonth, year: selectedYear }
            });
            setTargets(response.data.data);
        } catch (error) {
            console.error('Error fetching mechanic targets:', error);
        } finally {
            setLoading(false);
        }
    }

    // useEffect hook to fetch targets when the component is first mounted
    useEffect(() => {
        fetchTargets();
    }, []);

    return (

        <div className='p-4 mt-4 bg-white rounded-lg'>
            <div className='flex justify-between items-center'>
                {/* Title */}
                <h1 className='font-semibold text-xl xs:text-2xl pb-4'>Salary</h1>
                {/* <div className='pb-2 flex gap-4'>
                    <div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className='bg-primaryColor cursor-pointer outline-none text-xs xs:text-sm text-white p-1 rounded-md'
                        >
                            <option value=''>Month</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className='bg-primaryColor cursor-pointer outline-none text-xs xs:text-sm text-white p-1 rounded-md'
                        >
                            <option value=''>Year</option>
                            {Array.from({ length: 10 }, (_, i) => (
                                <option key={i + 2023} value={i + 2023}>
                                    {i + 2023}
                                </option>
                            ))}
                        </select>
                    </div>
                </div> */}
            </div>

            {/* Search box */}
            <div>
                <SearchBox value={searchTerm} onChange={handleSearch} />
            </div>

            {/* Table for large screens */}
            <div className='items-start hidden lg:flex'>
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-bb-theme-50">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Name</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Basic Salary</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Labour Achievements</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Incentive</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider w-40">Achievement</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            // Show loading spinner when data is being fetched
                            <tr>
                                <td colSpan="6" className="px-4 py-3 text-center">Loading...</td>
                            </tr>
                        ) : currentPageTargets.length > 0 ? (
                            currentPageTargets.map((target) => (
                                target.achievement.map((ach) => (
                                    <tr key={ach.month} className='hover:bg-bb-theme-50 even:bg-gray-50'>
                                        <td className="px-4 py-3 whitespace-nowrap">{target.mechanicId?.name}</td>
                                        <td className="px-4 py-3">{displayINRCurrency(target.baseSalary)}</td>
                                        <td className="px-4 py-3">{displayINRCurrency(ach.labourAchievement)}</td>
                                        <td className="px-4 py-3">{ach.incentivePercentage}%</td>
                                        <td className="px-4 py-3">
                                            {displayINRCurrency(ach.labourAchievement / 100 * ach.incentivePercentage)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {displayINRCurrency(ach.labourAchievement / 100 * ach.incentivePercentage + target.baseSalary)}
                                        </td>
                                    </tr>
                                ))
                            ))
                        ) : (
                            // Show message if no data is available
                            <tr>
                                <td colSpan="6" className="px-4 py-3 text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Small screens */}
            <div className='flex flex-wrap gap-4 lg:hidden w-full'>
                {loading ? (
                    // Show loading message
                    <p>Loading...</p>
                ) : searchData.length > 0 ? (
                    // Render mechanic target cards for mobile view
                    searchData.map((target) =>
                        target.achievement.map((ach) => (
                            <div key={ach.month} className="border p-4 rounded-md w-full xs:w-[300px] min-w-[300px]">
                                <h1 className="text-lg font-semibold">{target.mechanicId?.name}</h1>
                                <div><span className='font-medium text-gray-500 text-sm'>Basic Salary:</span> {displayINRCurrency(target.baseSalary)}</div>
                                <div><span className='font-medium text-gray-500 text-sm'>Labour Achievements:</span> {displayINRCurrency(ach.labourAchievement)}</div>
                                <div><span className='font-medium text-gray-500 text-sm'>Incentive:</span> {ach.incentivePercentage}%</div>
                                <div><span className='font-medium text-gray-500 text-sm'>Achievements:</span> {displayINRCurrency(ach.labourAchievement / 100 * ach.incentivePercentage)}</div>
                                <div><span className='font-medium text-gray-500 text-sm mr-6'>Total</span> {displayINRCurrency(ach.labourAchievement / 100 * ach.incentivePercentage + target.baseSalary)}</div>
                            </div>
                        ))
                    )
                ) : (
                    // Message when no data is available
                    <p>No data available</p>
                )}
            </div>

            {/* Pagination component */}
            <div className='p-4 hidden lg:block'>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default MechanicSalary;
